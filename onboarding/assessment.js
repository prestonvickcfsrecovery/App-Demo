const assessmentAge = Object.freeze({min:18, max:125});

// Older previews sent physical pattern labels with a different sentence separator.
function currentPatternAnswer(id, value) {
  if (!id.startsWith('physicalPattern') || typeof value !== 'string') return value;
  return value.replace(' ' + String.fromCodePoint(0x2014) + ' ', '. ');
}

// Local server inserts a capability marker only into the HTML it serves.
// The standalone preview never makes a submission request, even when hosted.
(() => {
  const version = 'nsha-draft-2026-10-15';
  const platinum = 'recovery-academy-platinum';
  const routes = ['shared',platinum,'academy','school','companion'];
  const renderedProgram = document.querySelector('meta[name="assessment-program"]')?.content;
  const requested = new URLSearchParams(location.search).get('program');
  const questions = assessmentSections.flatMap(section =>
    section.questions.map(question => ({...question, category: section.category}))
  );
  const connected = false;
  const standaloneProgram = routes.includes(requested) ? requested : platinum;
  const programContext = connected ? renderedProgram : standaloneProgram;

  function validate(answers, profile, minimumAge = assessmentAge.min) {
    if (!answers || typeof answers !== 'object' || Array.isArray(answers) ||
        Object.keys(answers).length !== questions.length) throw Error('invalid_answers');
    for (const question of questions) {
      const value = answers[question.id];
      if (question.multi) {
        if (!Array.isArray(value) || value.length !== new Set(value).size ||
            value.some(entry => !question.options.includes(entry))) throw Error('invalid_list');
      } else if (question.category === 'text') {
        if (typeof value !== 'string' || !value.trim() || Array.from(value.trim()).length > question.maxLength) {
          throw Error('invalid_text');
        }
      } else if (question.category === 'capacity') {
        if (!['number', 'string'].includes(typeof value) || !question.options.includes(String(value))) {
          throw Error('invalid_capacity');
        }
      } else {
        const ordinal = ['overall', 'polarity'].includes(question.category) &&
          Number.isInteger(value) && question.optionValues.includes(value);
        if (!ordinal && !question.options.includes(currentPatternAnswer(question.id, value))) throw Error('invalid_choice');
      }
    }
    const profileFields = ['firstName', 'lastName', 'email', 'age', 'illnessYears', 'illnessMonths', 'assessmentConsent'];
    if (!profile || Object.keys(profile).length !== profileFields.length ||
        !profileFields.every(key => Object.prototype.hasOwnProperty.call(profile, key)) ||
        profile.assessmentConsent !== true || !Number.isInteger(profile.age) ||
        profile.age < minimumAge || profile.age > assessmentAge.max) throw Error('invalid_profile');
    if (profile.illnessYears !== '50+' &&
        (!Number.isInteger(profile.illnessYears) || profile.illnessYears < 0 || profile.illnessYears > 49)) {
      throw Error('invalid_years');
    }
    if (!Number.isInteger(profile.illnessMonths) || profile.illnessMonths < 0 || profile.illnessMonths > 11) {
      throw Error('invalid_months');
    }
    for (const name of ['firstName', 'lastName']) {
      if (typeof profile[name] !== 'string' || !profile[name].trim() ||
          Array.from(profile[name].trim()).length > 100) throw Error('invalid_profile');
    }
    if (typeof profile.email !== 'string' || Array.from(profile.email.trim()).length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) throw Error('invalid_email');
  }

  async function submit(answers, assessmentId, profile, expectedRevision, supportSource, priorReceipt) {
    validate(answers, profile);
    if (!agreementChoices.terms || !agreementChoices.privacy) throw Error('agreement_required');
    const agreement = {termsAccepted:true, privacyAccepted:true, termsVersion:companionPolicies.version,
      privacyVersion:companionPolicies.version};
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(assessmentId)) {
      throw Error('invalid_id');
    }
    if (!connected) {
      const submittedAt = priorReceipt?.assessmentId === assessmentId && priorReceipt.submittedAt
        ? priorReceipt.submittedAt : new Date().toISOString();
      return {status:'preview', assessmentId, questionCount:questions.length, schemaVersion:version,
        surveyVersion:NSHA_SURVEY_VERSION, dateCompleted:submittedAt.slice(0,10), submittedAt,
        programContext, revision:expectedRevision + 1};
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        mode: 'same-origin',
        credentials: 'same-origin',
        cache: 'no-store',
        redirect: 'error',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({schemaVersion: version, assessmentId, programContext, expectedRevision, answers, profile, agreement, supportSource}),
        signal: controller.signal
      });
      if (response.status === 409) throw Error('revision_conflict');
      if (!response.ok) throw Error('submission_failed');
      const receipt = await response.json();
      if (receipt.status !== 'saved' || receipt.assessmentId !== assessmentId ||
          receipt.schemaVersion !== version || receipt.questionCount !== questions.length ||
          receipt.programContext !== programContext || !Number.isSafeInteger(receipt.revision) || receipt.revision < 1) {
        throw Error('invalid_receipt');
      }
      return receipt;
    } finally {
      clearTimeout(timer);
    }
  }

  // Completed records can be recovered on refresh only in their original demo session and program.
  const scope = document.querySelector('meta[name="assessment-session"]')?.content;
  const tabKey = connected && scope ? ['assessment',scope,programContext,version].join('.') : null;
  async function readSaved(id) {
    if (!connected || !/^[a-f0-9-]{36}$/.test(id)) throw Error('invalid_id');
    const url = '/api/assessments/'+id;
    const options = {
      headers:{'X-Assessment-Reader':'same-origin'}, mode:'same-origin',
      credentials:'same-origin', cache:'no-store', redirect:'error'
    };
    const response = await fetch(url, options);
    if (response.status === 404) {
      const stageResponse = await fetch(url+'/stage',options);
      if (stageResponse.status === 404) throw Error('saved_not_found');
      if (!stageResponse.ok) throw Error('read_failed');
      const earlier = await stageResponse.json();
      const ordinal = earlier.overallCapacity?.choiceOrdinal;
      if (earlier.assessmentId !== id || earlier.schemaVersion !== 'nsha-v1' ||
          (earlier.programContext !== null && earlier.programContext !== programContext) ||
          !Number.isInteger(ordinal) || ordinal < 1 || ordinal > 6) throw Error('saved_not_found');
      return {...earlier, status:'historical-stage'};
    }
    if (!response.ok) throw Error('read_failed');
    const saved = await response.json();
    if (saved.assessmentId !== id || saved.programContext !== programContext || saved.schemaVersion !== version ||
        !Number.isSafeInteger(saved.revision) || saved.revision < 1 || !saved.agreement?.termsAccepted ||
        !saved.agreement?.privacyAccepted) throw Error('invalid_record');
    // Earlier records retain their original age. Correcting or submitting one uses today's limits.
    validate(saved.answers,saved.profile,0);
    return saved;
  }
  window.assessmentApi = Object.freeze({mode: connected ? 'connected' : 'preview', schemaVersion:version, surveyVersion:NSHA_SURVEY_VERSION, programContext, submit, tabKey, readSaved});
})();

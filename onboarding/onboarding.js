// The reader and public pages are built from the same versioned policy text.
const agreementChoices = {terms:false, privacy:false};
function policyReader(key, trigger) {
  const dialog = node('dialog','policy-reader');
  dialog.setAttribute('aria-label',key === 'terms' ? 'Terms and Conditions' : 'Privacy Policy');
  const documentBody = node('div','policy-document');
  documentBody.innerHTML = companionPolicies.articles[key];
  const done = button('Back to onboarding','primary',() => dialog.close());
  dialog.append(documentBody,done);
  document.body.append(dialog);
  dialog.addEventListener('close',() => { dialog.remove(); trigger.focus(); },{once:true});
  dialog.showModal();
  documentBody.tabIndex = 0;
  documentBody.focus();
}
function agreementView() {
  heading(C.scope.title,'This is a learning tool. Ask your doctor or nurse about symptoms or treatment.');
  page.append(node('p','agreement-purpose',isPreview()
    ? 'Try it with made-up answers. They stay in this tab.'
    : 'Use made-up answers. This demo saves a draft on this computer as you go. Your report is ready when you finish.'));
  const group = node('div','agreement-options');
  const nextButton = footer('Agree and continue',() => {
    if (agreementChoices.terms && agreementChoices.privacy) next();
  },C.buttons.back,back);
  const update = () => { nextButton.disabled = !(agreementChoices.terms && agreementChoices.privacy); };
  for (const [key, title, message] of [
    ['terms','Terms and Conditions','I agree to the Terms and Conditions.'],
    ['privacy','Privacy Policy','I agree to the Privacy Policy. You may save my answers as I go and use them for my assessment and monthly check-ins.']
  ]) {
    const item = node('div','agreement-item');
    const link = button('Read the '+title,'link policy-link',() => policyReader(key,link));
    const label = node('label','consent');
    const box = node('input');
    box.type = 'checkbox';
    box.name = key+'Agreement';
    box.checked = agreementChoices[key];
    box.addEventListener('change',() => {
      agreementChoices[key] = box.checked;
      if (!box.checked) discardProfileDraft();
      update();
    });
    label.append(box,node('span','',message));
    item.append(link,label);
    group.append(item);
  }
  page.append(group);
  update();
}

// Draft rows use the same owner and assessment ID as the final report.
// Only an opaque restore pointer is kept in the connected browser tab.
const profileCheckpoints = {
  'physical-progress': {title:'Thanks for sharing how you move.', subject:'movement', percent:28},
  'cognitive-progress': {title:'Thanks for sharing how you think.', subject:'thinking', percent:52}
};
let profileDraftRevision = 0;
let profileDraftToRead = null;
let savedProfilePercent = 0;

function profileDraftKey() {
  const key = window.assessmentApi.tabKey;
  return key ? key + '.profile-draft' : null;
}
function rememberProfilePointer(value) {
  const key = profileDraftKey();
  if (!key) return;
  try {
    if (value) sessionStorage.setItem(key,JSON.stringify(value));
    else sessionStorage.removeItem(key);
  } catch { /* The server can still save when tab storage is unavailable. */ }
}
function clearProfileDraft() {
  rememberProfilePointer(null);
  profileDraftToRead = null;
  profileDraftRevision = 0;
  savedProfilePercent = 0;
}
function profileDraftURL(id) {
  return '/api/assessment-drafts/' + encodeURIComponent(id) + '?program=' + encodeURIComponent(programContext);
}
function discardProfileDraft() {
  if (submissionId && !isPreview() && !receipt) {
    fetch(profileDraftURL(submissionId),{method:'DELETE',mode:'same-origin',credentials:'same-origin',
      headers:{'X-Assessment-Reader':'same-origin'},cache:'no-store',redirect:'error'}).catch(() => {});
  }
  clearProfileDraft();
}
async function draftRequest(url, options) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(),12000);
  try {
    const response = await fetch(url,{mode:'same-origin',credentials:'same-origin',cache:'no-store',
      redirect:'error',signal:controller.signal,...options});
    if (!response.ok) throw Error(String(response.status));
    return await response.json();
  } finally { clearTimeout(timeout); }
}
function checkDraftResponse(row, id) {
  if (!row || row.assessmentId !== id || row.programContext !== programContext ||
      row.schemaVersion !== window.assessmentApi.schemaVersion || !Object.hasOwn(profileCheckpoints,row.stage) ||
      !Number.isSafeInteger(row.revision) || row.revision < 1) throw Error('invalid_draft');
}
async function saveProfileDraft(currentStage) {
  if (!agreementChoices.terms || !agreementChoices.privacy) throw Error('policies_required');
  const ids = order.slice(0,order.indexOf(currentStage)).filter(id => questions.has(id));
  if (!ids.every(id => answers.has(id))) throw Error('incomplete_draft');
  if (isPreview()) return;
  submissionId ||= newSubmissionId();
  const id = submissionId;
  rememberProfilePointer({id,stage:currentStage});
  const saved = await draftRequest('/api/assessment-drafts',{
    method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      assessmentId:id,schemaVersion:window.assessmentApi.schemaVersion,programContext,stage:currentStage,
      agreement:{termsAccepted:true,privacyAccepted:true,termsVersion:companionPolicies.version,privacyVersion:companionPolicies.version},
      expectedRevision:profileDraftRevision,answers:Object.fromEntries(ids.map(key => [key,answers.get(key)]))
    })
  });
  checkDraftResponse(saved,id);
  if (saved.status !== 'draft-saved' || saved.stage !== currentStage || saved.questionCount !== ids.length) {
    throw Error('invalid_draft_receipt');
  }
  profileDraftRevision = saved.revision;
}
function resumeProfileDraft() {
  const key = profileDraftKey();
  if (!key || reviewer) return false;
  let pointer;
  try { pointer = JSON.parse(sessionStorage.getItem(key)); } catch { return false; }
  if (!pointer || !Object.hasOwn(profileCheckpoints,pointer.stage) ||
      !/^[a-f0-9-]{36}$/.test(pointer.id)) return false;
  profileDraftToRead = pointer;
  submissionId = pointer.id;
  go(pointer.stage);
  return true;
}
async function readProfileDraft(pointer) {
  const row = await draftRequest(profileDraftURL(pointer.id),{headers:{'X-Assessment-Reader':'same-origin'}});
  checkDraftResponse(row,pointer.id);
  if (!row.answers || typeof row.answers !== 'object' || Array.isArray(row.answers) ||
      Object.keys(row.answers).some(id => !questions.has(id))) throw Error('invalid_draft');
  restoreAnswers(row.answers, profile);
  agreementChoices.terms = agreementChoices.privacy = true;
  profileDraftRevision = row.revision;
  profileDraftToRead = null;
  rememberProfilePointer({id:pointer.id,stage:row.stage});
  return row.stage;
}
function showProfileFill(bar, label, from, to, fresh, onComplete) {
  function setPercent(value) {
    bar.value = value;
    label.textContent = value + '%';
  }
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!fresh || from >= to || motion.matches) {
    setPercent(to);
    onComplete?.();
    return;
  }
  const start = performance.now();
  function tick(now) {
    if (!bar.isConnected) return;
    const fraction = motion.matches ? 1 : Math.min(1,(now - start) / 2400);
    setPercent(Math.floor(from + (to - from) * fraction));
    if (fraction < 1) requestAnimationFrame(tick);
    else onComplete?.();
  }
  requestAnimationFrame(tick);
}
function appendProfileMeter(initial) {
  const track = node('div','checkpoint-track');
  const caption = node('div','checkpoint-caption');
  const percent = node('span','checkpoint-percent',initial + '%');
  percent.setAttribute('aria-hidden','true');
  caption.append(node('span','','Recovery Profile'),percent);
  const progress = node('progress','assembly-bar checkpoint-bar');
  progress.max = 100;
  progress.value = initial;
  progress.setAttribute('aria-label',reviewer ? 'Sample recovery profile completion' : 'Recovery profile completion');
  track.append(caption,progress);
  page.append(track);
  return {progress,percent};
}
function choicesProgress(continueButton, revisited) {
  const initial = profileCheckpoints['cognitive-progress'].percent;
  const {progress,percent} = appendProfileMeter(initial);
  continueButton.disabled = true;
  continueButton.classList.add('awaiting-profile-progress');
  showProfileFill(progress,percent,initial,86,!revisited,() => {
    continueButton.disabled = false;
    continueButton.classList.remove('awaiting-profile-progress');
  });
}
async function profileCheckpointView() {
  const currentStage = stage;
  const content = profileCheckpoints[currentStage];
  const restoring = profileDraftToRead;
  page.append(companion('ready'));
  heading(content.title);
  const status = node('p','hint',restoring ? 'Opening your saved answers…' :
    'Adding your ' + content.subject + ' answers to your recovery profile…');
  status.setAttribute('role','status');
  page.append(status);
  const target = content.percent;
  const initial = Math.min(savedProfilePercent,target);
  const {progress,percent} = appendProfileMeter(initial);
  actions.hidden = true;
  try {
    if (restoring) {
      const savedStage = await readProfileDraft(restoring);
      if (savedStage !== currentStage) return go(savedStage);
    } else if (!reviewer) await saveProfileDraft(currentStage);
    if (!status.isConnected) return;
    let message = 'Your ' + content.subject + ' answers are saved in your recovery profile.';
    if (isPreview()) message = 'Your ' + content.subject + ' answers are part of your profile in this tab.';
    if (reviewer) {
      message = 'Here, your ' + content.subject + ' answers are added to your recovery profile.';
    }
    status.textContent = message;
    savedProfilePercent = Math.max(savedProfilePercent,target);
    showProfileFill(progress,percent,initial,target,!restoring);
    footer(C.buttons.next,next,C.buttons.back,back);
  } catch (error) {
    if (!status.isConnected) return;
    if (restoring && error.message === '404') {
      status.textContent = 'We couldn’t find this draft. Try again, or start with fresh answers.';
      footer('Try again',render,'Start again',reset);
      return;
    }
    if (error.message === '409') {
      profileDraftToRead = {id:submissionId,stage:currentStage};
      status.textContent = 'This draft changed in another tab. Open the saved answers to keep going.';
      footer('Open saved answers',render);
      return;
    }
    status.textContent = restoring ? 'Your draft couldn’t open. Try again to pick up here.' :
      'Your answers are still here. Try again to add them to your profile.';
    footer('Try again',render,C.buttons.back,restoring ? undefined : back);
  }
}

// The required flow is also the source of truth for the review and wireframe index.
const platinumProgram = 'recovery-academy-platinum';
const programContext = window.assessmentApi.programContext;
const isPlatinum = programContext === platinumProgram;
const C = assessmentCopy;
const page = document.getElementById('page');
const actions = document.getElementById('actions');
const questions = new Map(assessmentSections.flatMap(section =>
  section.questions.map(question => [question.id, question])
));
const sectionFor = new Map(assessmentSections.flatMap(section => section.questions.map(q => [q.id, section])));
function sectionIds(category, domain) {
  return assessmentSections.filter(s => s.category === category && (!domain || s.domain === domain))
    .flatMap(s => s.questions.map(q => q.id));
}
const blocks = [
  {group:'today', ids:['focusChoice']},
  {group:'symptoms', part:2, ids:sectionIds('symptoms')},
  {group:'body', part:2, ids:sectionIds('capacity','physical')},
  {group:'mind', part:2, ids:sectionIds('capacity','cognitive')},
  {group:'emotionalEnergy', part:2, ids:sectionIds('capacity','emotional')},
  {group:'activity', part:2, ids:['activityLevel']},
  {group:'pacing', part:3, ids:sectionIds('polarity','physical')},
  {group:'thinking', part:3, ids:sectionIds('polarity','cognitive')},
  {group:'feelings', part:3, ids:sectionIds('polarity','emotional')},
  {group:'goal', ids:['goalChoice','personalWin']},
  {group:'help', part:3, ids:['helpInRecovery']}
];
const groups = new Map(blocks.map(block => [block.group,block.ids]));
const groupFor = new Map(blocks.flatMap(block => block.ids.map(id => [id, block])));
const platinumStates = ['platinum-confirmation','platinum-prep','platinum-home','platinum-calendar','platinum-start'];
const handoffStates = isPlatinum ? platinumStates : programContext === 'companion' ? ['first-step'] : ['onboarding-done'];
const terminalStates = ['sending','send-error','report-loading','review',...handoffStates];
const beats = onboardingSequence.map(phase => phase.screens.flatMap(id =>
  id.startsWith('$') ? groups.get(id.slice(1)) : [id]
));
const beatFor = new Map(beats.flatMap((ids,i) => ids.map(id => [id,i+1])));
const openingCards = ['opening-study','opening-community'];
const order = [...entryScreens,...beats.flat(),'assembling',...terminalStates];
const visitedOpening = new Set();
const orderedQuestions = order.filter(id => questions.has(id));
const lessons = new Set(['scope','difficulty','catch-up','fatigue-pem','brain-fog',...Object.keys(C.lessons),'pattern-profile','learn','proof','outcomes','story','assembling','sending','send-error','first-step']);
const profile = {firstName:'', lastName:'', email:'', age:'', illnessYears:'', illnessMonths:''};
const answers = new Map();
let stage = order[0];
let editing = false;
let supportSource = 'memberText';
let sample = false;
let reviewer = false;
let receipt = null;
let sending = false;
let submissionId = null;
let revision = 0;
let retryRead = false;
let savedCopyMissing = false;
let openReviewGroup = '';

const isPreview = () => window.assessmentApi?.mode === 'preview';
const savedLinkId = !isPreview() ? new URLSearchParams(location.search).get('assessmentId') : null;
const node = (tag, className = '', content = '') => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (content !== '') element.textContent = content;
  return element;
};
function format(template, slots) {
  return template.replace(/\{(\w+)\}/g, (match, key) => slots[key] ?? match);
}
function button(label, className, onClick) {
  const element = node('button', className, label);
  element.type = 'button';
  element.addEventListener('click', onClick);
  return element;
}
function heading(title, body) {
  const titleElement = node('h1','',title);
  titleElement.tabIndex = -1;
  page.append(titleElement);
  if (body) page.append(node('p','hint',body));
}
function footer(label, onClick, backLabel, onBack) {
  let primary;
  if (label) {
    primary = button(label, 'primary', onClick);
    actions.append(primary);
  }
  if (onBack) {
    const row = node('div','secondary');
    row.append(button(backLabel || C.buttons.back, 'link', onBack));
    actions.append(row);
  }
  const version = actions.querySelector('.survey-version');
  if (version) actions.append(version);
  actions.hidden = !actions.childElementCount;
  return primary;
}
let reportLoadTimer;
function go(id) {
  clearTimeout(reportLoadTimer);
  if (!terminalStates.includes(id)) sample = false;
  stage = id;
  render();
}
function next() {
  if (editing) {
    editing = false;
    send();
    return;
  }
  if (stage === beats[6].at(-1)) {
    if (reviewer && answers.size !== questions.size) return jump('assembling');
    send(true);
    return;
  }
  go(order[order.indexOf(stage) + 1]);
}
function back() {
  if (editing) {
    editing = false;
    go('review');
    return;
  }
  go(stage === 'goal-intro' ? 'profile' : order[order.indexOf(stage) - 1]);
}
function edit(id, group) {
  openReviewGroup = group;
  editing = true;
  go(id);
}
function supportDisplay(value) {
  return supportSource === 'focusChoice' ? C.difficulty.byFocus[value]?.choice || value : value;
}
function questionPosition(id) {
  const top = node('div','topline');
  const beat = beatFor.get(id);
  const section = sectionFor.get(id);
  const domains = ['physical','cognitive','emotional'];
  const domainIndex = domains.indexOf(section.domain);
  const capacityGroup = domainIndex >= 0 && ['capacity','polarity'].includes(section.category);
  const line = capacityGroup
    ? 'Section '+(domainIndex+1)+' of 3 · '+section.domain[0].toUpperCase()+section.domain.slice(1)+' capacity and patterns'
    : 'Section '+beat+' of 7 · '+(C.symptomLabels[id] || onboardingSequence[beat-1].label);
  const progress = node('progress','assessment-progress progress');
  progress.max = orderedQuestions.length;
  progress.value = orderedQuestions.indexOf(id) + 1;
  progress.setAttribute('aria-label',C.progressLabel);
  const context = node('div','section-meta',line);
  top.append(context, progress);
  page.append(top);
}
function presentedAnswer(question, value) {
  if (value === undefined) return C.check.unanswered;
  if (question.id === 'focusChoice') return C.difficulty.byFocus[value].choice;
  if (Array.isArray(value)) return value.length ? value.join(', ') : C.none;
  return typeof value === 'string' && question.kind !== 'text' ? value.replace(/\s*—\s*/g,'. ') : value;
}
function questionTitle(id) {
  if (id === 'focusChoice') return C.difficulty.question;
  if (id === 'goalChoice') return C.titles[id] || questions.get(id).title;
  return questions.get(id).title;
}
function questionView(id) {
  const q = questions.get(id);
  const isCount = id === 'physicalCapacity5';
  const section = sectionFor.get(id);
  const isScale = section.category === 'capacity';
  page.classList.toggle('rating-page',isScale);
  questionPosition(id);
  if (id === 'focusChoice') page.append(companion('notice'));
  if (id === 'helpInRecovery') page.append(node('p','checkpoint','Last question, and your recovery profile will be complete.'));
  heading(questionTitle(id), id === 'focusChoice' ? C.whys.focusChoice : undefined);
  if (C.symptomLabels[id]) page.append(node('p','symptom-subheading',C.symptomSubheads[id]));
  if (id === 'emotionalPattern2') {
    const [before,after] = questionTitle(id).split(' express ');
    if (after) page.querySelector('h1').replaceChildren(before+' ',node('em','','express'),' '+after);
  }
  const field = node('fieldset', isScale ? 'opts scale' : 'opts');
  field.dataset.questionId = id;
  field.append(node('legend','sr',questionTitle(id)));
  const previous = editing || stage !== order[0] ? back : null;
  const backText = editing ? C.buttons.cancelEdit : C.buttons.back;
  if (q.kind === 'text') {
    freeText(q,field,backText,previous);
    return;
  }
  if (q.multi) {
    multiChoice(q, field, backText, previous);
    return;
  }
  for (const [index,value] of q.options.entries()) {
    const choice = button('','opt', () => {
      answers.set(id,value);
      if (id === 'focusChoice' && supportSource === 'focusChoice') answers.set('helpInRecovery',value);
      next();
    });
    if (answers.get(id) === value) {
      choice.classList.add('is-selected');
      choice.setAttribute('aria-pressed','true');
    }
    if (id === 'activityLevel' || (section.category === 'polarity' && value.includes('. '))) {
      const copy = node('span','answer-label option-copy');
      const separator = id === 'activityLevel' ? ': ' : '. ';
      const end = value.indexOf(separator) + 1;
      copy.append(node('strong','',value.slice(0,end)),node('span','stage-meaning',value.slice(end)));
      choice.append(copy);
    } else {
      choice.append(node('span','answer-label option-copy',id === 'focusChoice' ? presentedAnswer(q,value) : presentedAnswer(q,value)));
    }
    if (!isScale) {
      const arrow = node('span','answer-arrow','›');
      arrow.setAttribute('aria-hidden','true');
      choice.append(arrow);
    }
    choice.dataset.optionIndex = index;
    field.append(choice);
  }
  footer(null,null,backText,previous);
  if (isScale) {
    const ends = node('div','scale-ends');
    const labels = isCount ? C.countScale : C.scale;
    ends.setAttribute('aria-hidden','true');
    for (const label of labels) ends.append(node('span','',label));
    field.setAttribute('aria-label',questionTitle(id));
    field.querySelector('button').setAttribute('aria-label',labels[0]);
    field.querySelector('button:last-child').setAttribute('aria-label',labels[1]);
    actions.prepend(ends, field);
  } else {
    page.append(field);
  }
}
function freeText(q, field, backText, previous) {
  const input = node('textarea','field');
  input.name = q.id;
  input.maxLength = q.maxLength;
  input.rows = 4;
  input.required = true;
  input.autocomplete = 'off';
  const isHelp = q.id === 'helpInRecovery';
  input.value = (isHelp ? supportDisplay(answers.get(q.id)) : answers.get(q.id)) || '';
  input.placeholder = C.freePlaceholder;
  input.setAttribute('aria-label',questionTitle(q.id));
  const count = node('small','char-count');
  const proceed = footer(editing ? C.buttons.saveEdit : isHelp ? 'Finish' : C.buttons.next, () => {
    const value = input.value.trim();
    if (!value) return;
    answers.set(q.id,value);
    if (isHelp) supportSource = 'memberText';
    next();
  }, backText, previous);
  const update = () => {
    count.textContent = format(C.charCount,{count:input.value.length});
    proceed.disabled = !input.value.trim();
  };
  input.addEventListener('input',update);
  field.append(input,count);
  page.append(field);
  update();
}
function multiChoice(q, field, backText, previous) {
  const saved = answers.get(q.id);
  const picked = new Set(saved || []);
  let none = answers.has(q.id) && saved.length === 0;
  const rows = new Map();
  const count = node('p','selection-count');
  count.setAttribute('aria-live','polite');
  const noneKey = '__none';
  const sync = () => {
    for (const [key,row] of rows) row.input.checked = key === noneKey ? none : picked.has(key);
    count.textContent = none ? C.none : format(C.selectedCount, {count:picked.size});
    advance.disabled = !picked.size && !none;
  };
  const advance = footer(editing ? C.buttons.saveEdit : C.buttons.next, () => {
    if (!picked.size && !none) return;
    answers.set(q.id, q.options.filter(v => picked.has(v)));
    next();
  }, backText, previous);
  const add = (key, label) => {
    const row = node('label','opt');
    const input = node('input');
    input.type = 'checkbox';
    input.value = label;
    input.addEventListener('change', () => {
      if (key === noneKey) {
        none = input.checked;
        if (none) picked.clear();
      } else if (input.checked) {
        none = false;
        picked.add(key);
      } else {
        picked.delete(key);
      }
      sync();
    });
    row.append(input, node('span','answer-label',label));
    rows.set(key, {row,input});
    field.append(row);
  };
  add(noneKey, C.none);
  for (const value of q.options) add(value,value);
  page.append(count, field);
  sync();
}
function evidenceView(content, drawOutcome = false) {
  heading(content.title,content.everyday);
  if (content.kicker) page.append(node('p','lesson-kicker',content.kicker));
  const stat = node('section','cohort-stat');
  stat.append(node('strong','stat-number',content.number),node('p','stat-label',content.label));
  if (drawOutcome) {
    const graphic = node('span','outcome-graphic');
    graphic.dataset.outcomeGraphic = '';
    graphic.setAttribute('aria-hidden','true');
    stat.append(graphic);
  }
  page.append(stat);
  appendStudyCredit(content);
}
function appendStudyCredit(content) {
  if (content.source) page.append(node('p','source-note',content.source));
  if (content.citation) page.append(node('cite','study-credit',content.citation));
}
function typeNeuroGreeting(paragraph, text) {
  const spoken = node('span','neuro-spoken',text);
  const lettering = node('span','neuro-lettering');
  lettering.setAttribute('aria-hidden','true');
  Array.from(text).forEach((letter, index) => {
    const character = node('span','neuro-letter',letter);
    character.style.setProperty('--letter-delay',(750 + 48 * index) + 'ms');
    lettering.append(character);
  });
  paragraph.replaceChildren(spoken,lettering);
}
function openingView(revisited) {
  const content = stage === 'fatigue-pem' ? C.fatiguePem : C.lessons[stage];
  const art = node('div','opening-art');
  art.append(companion(content.pose));
  const copy = node('div','opening-copy');
  const title = node('h1','',content.title);
  title.tabIndex = -1;
  copy.append(title);
  const thoughts = content.lines.map(line => node('p','opening-line',line));
  if (stage === 'opening-neuro' && !revisited && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typeNeuroGreeting(thoughts[0],content.lines[0]);
  }
  copy.append(...thoughts);
  if (stage === 'opening-study') {
    thoughts[0].append(node('cite','study-credit opening-source-inline',content.citation));
  } else if (content.citation) {
    copy.append(node('cite','study-credit opening-credit',content.citation));
  }
  page.append(art,copy);
  const position = openingCards.indexOf(stage);
  if (position >= 0) {
    const track = node('div','opening-track');
    track.setAttribute('role','img');
    track.setAttribute('aria-label',`Introduction, card ${position + 1} of ${openingCards.length}`);
    openingCards.forEach((_,i) => track.append(node('span',i <= position ? 'filled' : '')));
    page.append(track);
  }
  footer(content.cta || C.buttons.next,next,C.buttons.back,back);
}
let logoTimer;
function logoView(revisited) {
  const wordmark = node('h1','opening-wordmark',C.lessons['opening-logo'].title);
  wordmark.tabIndex = -1;
  page.append(wordmark);
  footer(C.buttons.next,next);
  if (revisited || reviewer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  logoTimer = setTimeout(() => {
    if (stage === 'opening-logo' && !document.hidden && !actions.contains(document.activeElement)) next();
  },3200);
}
function storiesForMember() {
  const ids = C.story.byGoal[answers.get('goalChoice')] || C.story.defaultIds;
  const hasPain = (answers.get('physicalSymptoms') || []).includes('Chronic Pain');
  return [ids[0], hasPain ? 'alexandr' : ids[1], ids[2]].map(id => C.story.members[id]);
}
function memberStoryView() {
  heading(C.story.title);
  page.append(memberQuoteList(storiesForMember()),node('p','science-note',C.story.proof));
}
function patternProfileView() {
  heading('Your patterns so far','Three more questions will help us see what support fits a hard day.');
  const rows = [
    ['physicalPattern1','On a better day'],
    ['cognitivePattern1','When I make a choice'],
    ['emotionalPattern3','When hard feelings come up']
  ];
  const example = reviewer && rows.every(([id]) => !answers.has(id));
  if (example) page.append(node('p','pattern-example','Example answers'));
  const list = node('dl','pattern-profile');
  for (const [id,label] of rows) {
    const question = questions.get(id);
    const value = example ? question.options[2] : answers.get(id);
    list.append(node('dt','',label),node('dd','',presentedAnswer(question,value)));
  }
  page.append(list);
}
function lessonView(revisited) {
  if (stage === 'scope') {
    agreementView();
    return;
  } else if (stage === 'difficulty') {
    const lesson = C.difficulty.byFocus[answers.get('focusChoice')] || C.difficulty;
    page.append(companion('notice'));
    heading(lesson.title,lesson.body);
    if (C.difficulty.coachingPrompt) page.append(node('p','science-note',C.difficulty.coachingPrompt));
  } else if (stage === 'pattern-profile') {
    patternProfileView();
  } else if (stage === 'goal-intro') {
    const intro = C.lessons[stage];
    heading(intro.title);
    page.append(node('p','goal-pause',intro.pause),node('p','hint',intro.body));
  } else if (stage === 'learn') {
    displayGoalTransformationQuotes(answers.get('goalChoice'));
  } else if (stage === 'proof') {
    displayRecoveryPlanQuotes();
  } else if (stage === 'story') {
    memberStoryView();
  } else if (stage === 'brain-fog') {
    evidenceView(C.brainFog);
  } else if (stage === 'outcomes') {
    heading(C.outcomes.title,C.outcomes.body);
  } else {
    const content = C.lessons[stage] || C.catchUp;
    if (content.milestone) page.append(node('p','checkpoint',content.milestone));
    if (!content.plain) page.append(companion(content.milestone ? 'ready' : 'learn'));
    heading(content.title,content.body);
    appendStudyCredit(content);
  }
  const continueButton = footer(stage === 'outcomes' ? 'Finish my assessment' : stage === 'symptoms-intro' ? 'Got it' : C.buttons.next,next,C.buttons.back,back);
  if (stage === 'feelings-context') choicesProgress(continueButton,revisited);
  if (stage === 'after-surprise') {
    const {progress,percent} = appendProfileMeter(86);
    showProfileFill(progress,percent,86,100,!revisited);
  }
}
function historyField(key, picker) {
  const field = node('div','history-field');
  const label = node('label','profile-label',picker.label);
  const trigger = button('','history-picker',open);
  trigger.id = 'pick-' + key;
  label.htmlFor = trigger.id;
  label.id = trigger.id + '-label';
  const value = node('span');
  value.id = trigger.id + '-value';
  trigger.append(value);
  trigger.setAttribute('aria-labelledby',label.id + ' ' + value.id);
  trigger.setAttribute('aria-haspopup','dialog');
  const select = node('select');
  select.name = key;
  select.hidden = true;
  select.required = true;
  select.append(new Option(picker.prompt,''));
  for (let i = picker.min; i <= picker.max; i++) {
    const text = key === 'illnessYears' && i === 50 ? '50+' : String(i);
    select.append(new Option(text,text));
  }
  select.value = String(profile[key]);
  const error = node('p','history-field-error',picker.prompt + ' to continue.');
  error.id = trigger.id + '-error';
  function refresh() {
    value.textContent = select.value || picker.prompt;
    trigger.removeAttribute('aria-invalid');
    trigger.removeAttribute('aria-describedby');
    error.hidden = true;
  }
  refresh();
  select.addEventListener('change',refresh);
  select.addEventListener('invalid',event => {
    event.preventDefault();
    trigger.setAttribute('aria-invalid','true');
    trigger.setAttribute('aria-describedby',error.id);
    error.hidden = false;
    if (select === field.closest('form').querySelector('select:invalid')) trigger.focus();
  });
  function open() {
    const dialog = node('dialog','number-picker');
    const title = node('h2','',picker.prompt);
    title.id = trigger.id + '-title';
    dialog.setAttribute('aria-labelledby',title.id);
    const list = node('div','number-options');
    list.setAttribute('role','listbox');
    list.setAttribute('aria-labelledby',title.id);
    const choices = Array.from(select.options).slice(1).map(option => {
      const choice = button(option.text,'number-option',() => {
        select.value = option.value;
        select.dispatchEvent(new Event('change',{bubbles:true}));
        dialog.close();
      });
      choice.setAttribute('role','option');
      choice.setAttribute('aria-selected',String(option.selected));
      choice.tabIndex = -1;
      list.append(choice);
      return choice;
    });
    let index = Math.max(0, select.selectedIndex - 1);
    choices[index].tabIndex = 0;
    let digits = '';
    let lastKey = 0;
    list.addEventListener('keydown',event => {
      const moves = {ArrowDown:Math.min(index+1,choices.length-1),ArrowUp:Math.max(index-1,0),Home:0,End:choices.length-1};
      let to = moves[event.key];
      if (/^\d$/.test(event.key)) {
        const now = performance.now();
        digits = (now-lastKey < 750 ? digits : '') + event.key;
        lastKey = now;
        to = choices.findIndex(choice => choice.textContent.startsWith(digits));
      }
      if (to === undefined || to < 0) return;
      event.preventDefault();
      choices[index].tabIndex = -1;
      index = to;
      choices[index].tabIndex = 0;
      choices[index].focus();
    });
    dialog.append(title,list,button('Cancel','number-cancel',() => dialog.close()));
    field.append(dialog);
    dialog.addEventListener('close',() => {dialog.remove(); trigger.focus();},{once:true});
    dialog.showModal();
    choices[index].focus();
  }
  field.append(label,trigger,select,error);
  return field;
}
function intakeView() {
  const history = stage === 'history';
  const fields = history ? ['age','illnessYears','illnessMonths'] : ['firstName','lastName','email'];
  heading(C.intake[stage]);
  if (!history) page.append(node('p','form-note','Use a made-up name and email in this test.'));
  const form = node('form','profile-fields');
  const duration = node('fieldset','duration-fields');
  duration.append(node('legend','',C.intake.illnessDuration));
  const pickers = {
    age:{label:C.intake.age, prompt:C.intake.chooseAge, min:assessmentAge.min, max:assessmentAge.max},
    illnessYears:{label:C.intake.years, prompt:C.intake.chooseYears, min:0, max:50},
    illnessMonths:{label:C.intake.months, prompt:C.intake.chooseMonths, min:0, max:11}
  };
  for (const key of fields) {
    if (history) {
      (key === 'age' ? form : duration).append(historyField(key,pickers[key]));
      continue;
    }
    const label = node('label','profile-label',C.intake[key]);
    const input = node('input','profile-input');
    input.name = key;
    input.type = key === 'email' ? 'email' : 'text';
    input.autocomplete = 'off';
    input.required = true;
    input.value = profile[key];
    input.maxLength = key === 'email' ? 254 : 100;
    if (key === 'email') input.pattern = '[^\\s@]+@[^\\s@]+\\.[^\\s@]+';
    label.append(input);
    form.append(label);
  }
  if (history) form.append(duration);
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const key of fields) {
      const input = form.elements.namedItem(key);
      input.value = input.value.trim();
    }
    if (!form.reportValidity()) return;
    for (const key of fields) {
      const input = form.elements.namedItem(key);
      profile[key] = history && input.value !== '50+' ? Number(input.value) : input.value;
    }
    next();
  });
  page.append(form);
  footer(editing ? C.buttons.saveEdit : C.buttons.next,
    () => form.requestSubmit(), editing ? C.buttons.cancelEdit : C.buttons.back, back);
}
function reviewRow(title, value, editAction) {
  const row = button('','row',editAction);
  const column = node('span','review-answer');
  column.append(node('strong','',title),node('span','',String(value)));
  const editLabel = node('span','review-edit',C.buttons.edit);
  row.append(column,editLabel);
  return row;
}
function savedAnswerDetails() {
  const saved = fold('Check or change a saved answer');
  saved.open = Boolean(openReviewGroup);
  const groups = node('div','review-list');
  for (const block of blocks) {
    const details = node('details','review');
    details.open = openReviewGroup === block.group;
    details.append(node('summary','',C.groups[block.group]));
    for (const id of block.ids) {
      const title = id === 'helpInRecovery' && supportSource === 'focusChoice' ? 'Support you picked at the start' : C.symptomLabels[id] || questionTitle(id);
      const value = id === 'helpInRecovery' ? supportDisplay(answers.get(id)) : presentedAnswer(questions.get(id),answers.get(id));
      details.append(reviewRow(title,value,
        () => edit(id,block.group)));
    }
    groups.append(details);
  }
  const details = node('details','review');
  details.open = openReviewGroup === 'profile';
  details.append(node('summary','',C.check.details));
  for (const key of Object.keys(profile)) {
    const pageId = ['age','illnessYears','illnessMonths'].includes(key) ? 'history' : 'profile';
    const label = key === 'illnessYears' ? C.intake.years : key === 'illnessMonths' ? C.intake.months : C.intake[key];
    details.append(reviewRow(label, profile[key] === '' ? C.check.unanswered : profile[key], () => edit(pageId,'profile')));
  }
  groups.append(details);
  saved.append(groups);
  return saved;
}
function newSubmissionId() {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2,'0')).join('');
  return [hex.slice(0,8), hex.slice(8,12), hex.slice(12,16), hex.slice(16,20), hex.slice(20)].join('-');
}
// Tab storage holds a pending, consented submission only until a server receipt arrives.
// After that it holds an ID. The local service checks the session before returning any answers.
function remember(data) {
  const key = window.assessmentApi.tabKey;
  if (!key) return;
  try {
    if (data) sessionStorage.setItem(key,JSON.stringify(data));
    else sessionStorage.removeItem(key);
  } catch { /* The current page still works when tab storage is unavailable. */ }
}
function rememberReceipt() {
  clearProfileDraft();
  remember({id:submissionId, destination:'review'});
}
function restoreAnswers(health, intake) {
  answers.clear();
  for (const [id,value] of Object.entries(health)) {
    const q = questions.get(id);
    if (typeof value === 'number') {
      answers.set(id,q.optionValues ? q.options[q.optionValues.indexOf(value)] : String(value));
    } else answers.set(id,currentPatternAnswer(id,value));
  }
  for (const key of Object.keys(profile)) profile[key] = intake[key];
}
async function openSaved() {
  retryRead = true;
  savedCopyMissing = false;
  go('sending');
  try {
    const saved = await window.assessmentApi.readSaved(submissionId);
    if (saved.status === 'historical-stage') {
      receipt = saved;
      retryRead = false;
      return go('review');
    }
    restoreAnswers(saved.answers,saved.profile);
    supportSource = saved.supportSource || 'memberText';
    revision = saved.revision;
    agreementChoices.terms = saved.agreement.termsVersion === companionPolicies.version;
    agreementChoices.privacy = saved.agreement.privacyVersion === companionPolicies.version;
    receipt = {...saved, status:'saved'};
    retryRead = false;
    if (!savedLinkId) rememberReceipt();
    go('review');
  } catch (error) {
    savedCopyMissing = ['saved_not_found','invalid_id'].includes(error.message);
    go('send-error');
  }
}
function leaveSavedCopy() {
  if (!savedLinkId) remember(null);
  const url = new URL(location.href);
  url.searchParams.delete('assessmentId');
  location.replace(url.href);
}
function resumeAssessment() {
  const key = window.assessmentApi.tabKey;
  if (key && savedLinkId) {
    submissionId = savedLinkId;
    openSaved();
    return true;
  }
  let saved;
  try { saved = key && JSON.parse(sessionStorage.getItem(key)); } catch { return false; }
  if (!saved || !/^[a-f0-9-]{36}$/.test(saved.id)) return false;
  submissionId = saved.id;
  if (saved.pending && saved.termsVersion === companionPolicies.version && saved.privacyVersion === companionPolicies.version) {
    restoreAnswers(saved.pending.answers,saved.pending.profile);
    supportSource = saved.pending.supportSource || 'memberText';
    revision = saved.revision;
    agreementChoices.terms = agreementChoices.privacy = true;
    send();
  } else if (saved.destination === 'check' || saved.destination === 'review') {
    // Editions with a separate answer-check screen left this destination in the tab.
    openSaved();
  } else {
    remember(null);
    return false;
  }
  return true;
}
const assemblyGroups = [
  {label:'Your symptoms', sections:['symptoms']},
  {label:'Your energy and patterns', sections:['body','mind','emotionalEnergy','activity','pacing','thinking','feelings']},
  {label:'Your goals and support', sections:['today','help','goal']}
];
function assemblyView() {
  heading('Putting your assessment together');
  const progress = node('progress','assembly-bar');
  progress.max = assemblyGroups.length;
  progress.value = 0;
  progress.setAttribute('aria-label','Answer groups ready');
  const status = node('p','assembly-status');
  status.setAttribute('role','status');
  page.append(progress,status);
  actions.hidden = true;
  return {progress,status};
}
async function assembleAnswers(controls, demoOnly) {
  const collected = {};
  for (const [index,group] of assemblyGroups.entries()) {
    if (stage !== 'assembling') return;
    for (const name of group.sections) {
      for (const id of groups.get(name)) collected[id] = answers.get(id);
    }
    const label = node('span','',group.label);
    controls.status.replaceChildren(label);
    controls.progress.value = index + 1;
    // Give the reader time to see each completed group. The bar measures the groups above.
    await new Promise(resolve => setTimeout(resolve, demoOnly ? 630 : 510));
  }
  return collected;
}
async function send(assemble = false) {
  if (sending || answers.size !== questions.size || Object.values(profile).some(value => value === '')) return;
  if (!agreementChoices.terms || !agreementChoices.privacy) { go('scope'); return; }
  submissionId ||= newSubmissionId();
  const intake = {...profile, assessmentConsent:true};
  let health = Object.fromEntries(answers);
  remember({id:submissionId, revision, pending:{answers:health,profile:intake,supportSource},
    termsVersion:companionPolicies.version,privacyVersion:companionPolicies.version});
  sending = true;
  retryRead = false;
  try {
    if (assemble) {
      go('assembling');
      health = await assembleAnswers(assemblyControls,false);
    }
    go('sending');
    const updatingReport = Boolean(receipt);
    const result = await window.assessmentApi.submit(health,submissionId,intake,revision,supportSource,receipt);
    receipt = result;
    revision = result.revision;
    sample = false;
    rememberReceipt();
    go(updatingReport ? 'review' : 'report-loading');
  } catch (error) {
    if (error.message === 'revision_conflict') {
      retryRead = true;
      rememberReceipt();
    }
    go('send-error');
  } finally { sending = false; }
}
function informationCard(label, body) {
  const card = node('section','result-card box');
  card.append(node('b','tag',label),node('p','',String(body)));
  return card;
}
// Fictional values are read only by the explicitly labeled result demonstrator.
// They never enter form inputs, the participant answer map or the submission adapter.
function resultAnswer(id) {
  if (answers.has(id)) return answers.get(id);
  if (!sample) return undefined;
  const q = questions.get(id);
  if (id === 'physicalSymptoms') return ['Fatigue'];
  if (id === 'cognitiveSymptoms') return ['Brain Fog'];
  if (id === 'cognitiveCapacity1') return '1';
  if (id === 'physicalCapacity4') return '2';
  if (id === 'emotionalCapacity5') return '4';
  if (q.multi) return [];
  if (id === 'personalWin') return 'Share a meal with my family.';
  if (id === 'helpInRecovery') return 'Finding time to rest between chores.';
  if (id === 'goalChoice') return q.options[3];
  return q.options[Math.min(2, q.options.length - 1)];
}
function externalLink(label, url, className) {
  const link = node('a',className,label);
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  return link;
}
function platinumView() {
  if (!receipt && !sample) return go(order[0]);
  const copy = C.platinum;
  if (stage === 'platinum-confirmation') {
    heading(copy.title,copy.intro);
    page.append(fastStartCalendar(copy));
    actions.hidden = true;
    return;
  }
  if (stage === 'platinum-prep') {
    heading(copy.prepTitle,copy.prepIntro);
    for (const voice of copy.voices) {
      const block = node('figure','member-voice');
      const credit = node('figcaption','voice-credit');
      credit.append(node('strong','',voice.name),node('span','',voice.context));
      const quote = node('blockquote','story-quote',voice.quote);
      const link = externalLink('Watch '+voice.name+'’s interview',voice.url,'voice-interview');
      block.append(credit,quote,link);
      page.append(block);
    }
    footer(copy.tour,() => go('platinum-home'));
    return;
  }
  if (stage === 'platinum-calendar') return cohortCalendar();
  if (stage === 'platinum-start') return platinumStartingPoint();
  page.append(companion('ready'));
  heading(copy.tourTitle,copy.tourIntro);
  const steps = node('ol','booking-directions');
  for (const step of copy.tourSteps) steps.append(node('li','',step));
  page.append(steps);
  page.append(prepareForCall());
  footer('Add my cohort calls',() => go('platinum-calendar'));
}
function resultView() {
  if (!receipt && !sample) return go(order[0]);
  if (stage === 'review') {
    if (receipt?.status === 'historical-stage') {
      heading('Your earlier assessment');
      page.append(reportDateline(),showTriangle(receipt.overallCapacity.choiceOrdinal - 1));
      footer('Back to onboarding',leaveSavedCopy);
      return;
    }
    assessmentReport();
    if (receipt && !savedLinkId) page.append(savedAnswerDetails());
    if (savedLinkId) footer(null,null,'Back to onboarding',leaveSavedCopy);
    return;
  }
  if (stage === 'report-loading') return reportLoadingView();
  if (stage === 'onboarding-done') {
    heading('You’ve finished onboarding.','Next, you’ll get a tour of your program. Then you can start using Thriver Companion.');
    footer('Back to my assessment',()=>go('review'));
    return;
  }
  const focus = resultAnswer('focusChoice');
  const focusIndex = Math.max(0, questions.get('focusChoice').options.indexOf(focus));
  heading(C.result.heading,C.result.actions[focusIndex]);
  page.append(informationCard(C.result.topic,C.result.topics[focusIndex]));
  page.append(informationCard(C.result.goal,resultAnswer('personalWin')));
  page.append(node('p','science-note',C.result.lens));
  footer(C.buttons.restart,reset,C.result.back,() => go('review'));
}
function planPreviewView() {
  heading(C.lessons['plan-preview'].title);
  const list = node('ol','report-preview-sheet');
  list.style.setProperty('--report-duration','4000ms');
  for (const label of ['Gathering your symptoms','Reviewing your three capacity sections','Matching your patterns']) {
    const row = node('li','report-preview-row');
    row.style.setProperty('--row-delay',list.children.length * 1100 + 'ms');
    row.append(node('span','report-preview-check','✓'),node('span','',label));
    list.append(row);
  }
  page.append(list);
  footer(null,null,C.buttons.back,back);
  reportLoadTimer = setTimeout(next,4000);
}
function reportLoadingView() {
  const duration = 7000;
  heading('Generating your report…');
  const sheet = node('ol','report-preview-sheet');
  sheet.setAttribute('aria-label','Sections of your report');
  sheet.style.setProperty('--report-duration', duration + 'ms');
  for (const [index,label] of ['Your recovery stage','Your energy and patterns','Your goal and support'].entries()) {
    const row = node('li','report-preview-row');
    row.style.setProperty('--row-delay', (index * 2000 + 400) + 'ms');
    const check = node('span','report-preview-check','✓');
    check.setAttribute('aria-hidden','true');
    row.append(check,node('span','',label));
    sheet.append(row);
  }
  page.append(sheet);
  actions.hidden = true;
  reportLoadTimer = setTimeout(() => go('review'),duration);
}
let assemblyControls;
function render() {
  clearTimeout(logoTimer);
  page.replaceChildren();
  actions.replaceChildren();
  actions.hidden = false;
  page.dataset.stage = stage;
  page.dataset.program = programContext;
  page.dataset.beat = beatFor.get(stage) || '';
  page.classList.remove('rating-page');
  const openingBeat = entryScreens.includes(stage) || stage === 'fatigue-pem';
  const openingExample = stage === 'difficulty' || stage === 'catch-up';
  const readingSlide = !openingBeat && (Object.hasOwn(C.lessons,stage) || stage === 'brain-fog' || stage === 'outcomes');
  const revisited = visitedOpening.has(stage);
  page.classList.toggle('opening-beat',openingBeat);
  page.classList.toggle('opening-logo',stage === 'opening-logo');
  page.classList.toggle('reading-reveal',readingSlide);
  page.classList.toggle('opening-example',openingExample);
  page.classList.toggle('opening-question',stage === 'focusChoice');
  page.classList.toggle('opening-revisited',revisited);
  if (openingBeat || openingExample || readingSlide || stage === 'learn' || stage === 'focusChoice') visitedOpening.add(stage);
  page.classList.toggle('lesson',lessons.has(stage) || Object.hasOwn(profileCheckpoints,stage));
  if (reviewer) page.append(node('p','sample-flag',sample ? C.sample : C.sampleScreen));
  if (stage === 'opening-logo') logoView(revisited);
  else if (stage === 'plan-preview') planPreviewView();
  else if (openingBeat) openingView(revisited);
  else if (questions.has(stage)) questionView(stage);
  else if (Object.hasOwn(profileCheckpoints,stage)) profileCheckpointView();
  else if (stage === 'history' || stage === 'profile') intakeView();
  else if (stage === 'assembling') {
    assemblyControls = assemblyView();
    if (!sending && reviewer) {
      assembleAnswers(assemblyControls,true);
      footer(C.buttons.next,() => jump('report-loading'));
    }
  } else if (stage === 'sending') {
    page.append(companion('learn'));
    heading(retryRead ? 'Opening your saved answers…' : isPreview() ? 'Preparing your preview…' : C.sending.title);
    if (sample) footer(C.buttons.next, () => jump('report-loading'));
    else actions.hidden = true;
  } else if (stage === 'send-error') {
    page.append(companion('notice'));
    if (savedCopyMissing) {
      heading('We couldn’t find that assessment.','Open the link in the browser where you saved your answers.');
      footer('Back to onboarding',leaveSavedCopy);
    } else {
      heading(retryRead ? 'Let’s open the saved copy.' : C.error.title,
        retryRead ? 'Check the latest answers on this computer.' : C.error.body);
      footer(retryRead ? 'Open saved answers' : C.buttons.retry, retryRead ? openSaved : sample ? () => go('sending') : () => send(),
        'Back to onboarding',retryRead ? leaveSavedCopy : null);
    }
  } else if (platinumStates.includes(stage)) platinumView();
  else if (terminalStates.includes(stage)) resultView();
  else lessonView(revisited);
  if (beatFor.has(stage) || ['assembling','sending','send-error','report-loading','review'].includes(stage)) {
    const version = stage === 'review' ? receipt?.surveyVersion || receipt?.schemaVersion : null;
    actions.append(node('small','survey-version',version || NSHA_SURVEY_VERSION));
    actions.hidden = false;
  }
  const advance = actions.querySelector('button.primary');
  if (advance && !advance.disabled && !revisited && stage !== 'opening-logo') {
    const reveals = page.getAnimations({subtree:true}).filter(animation =>
      ['opening-fade','opening-question-in','quote-appear'].includes(animation.animationName));
    if (reveals.length) {
      advance.disabled = true;
      Promise.allSettled(reveals.map(animation => animation.finished)).then(() => {
        if (advance.isConnected) advance.disabled = false;
      });
    }
  }
  page.scrollTop = 0;
  page.querySelector('h1')?.focus({preventScroll:true});
}
function reset() {
  discardProfileDraft();
  visitedOpening.clear();
  answers.clear();
  supportSource = 'memberText';
  cohortTimes.fill('');
  for (const key of Object.keys(profile)) profile[key] = '';
  editing = false;
  sample = false;
  reviewer = false;
  remember(null);
  revision = 0;
  retryRead = false;
  agreementChoices.terms = agreementChoices.privacy = false;
  receipt = null;
  submissionId = null;
  openReviewGroup = '';
  go(order[0]);
}
function manifest() {
  const others = {
    scope:C.scope.title, difficulty:C.difficulty.title, 'catch-up':C.catchUp.title, 'fatigue-pem':C.fatiguePem.title, 'brain-fog':C.brainFog.title,
    'pattern-profile':'Your patterns so far',learn:'Stories for your goal',proof:recoveryPlanProof.title, outcomes:C.outcomes.title, story:C.story.title, history:C.intake.history,
    profile:C.intake.profile, assembling:'Putting your assessment together', sending:C.sending.title, 'send-error':C.error.title,
    'report-loading':'Generating your report…','onboarding-done':'You’ve finished onboarding.','platinum-calendar':'Add your cohort calls','platinum-start':'Your Platinum starting point',
    review:'Your Nervous System Health Assessment', 'first-step':C.result.heading, 'platinum-confirmation':C.platinum.title,
    'platinum-prep':C.platinum.prepTitle,'platinum-home':C.platinum.tourTitle
  };
  return order.map(id => {
    const block = groupFor.get(id);
    const label = C.symptomLabels[id] || (questions.has(id) ? questionTitle(id) : C.lessons[id]?.title || profileCheckpoints[id]?.title || others[id]);
    const group = block ? C.groups[block.group] : platinumStates.includes(id) ? C.platinum.group : ['profile','history'].includes(id) ? C.check.details :
      ['sending','send-error','review','first-step'].includes(id) ? C.result.phase : C.buttons.guide;
    const beat = beatFor.get(id) || null;
    return {id,label,group,beat,beatLabel:beat ? onboardingSequence[beat-1].label : null};
  });
}
function jump(id) {
  const legacy = {check:'review',welcome:'arrival','opening-together':'opening-community','opening-ready':'symptoms-intro',cycles:'nervous-system',baseline:'daily-effort','changing-days':'alarm-response'};
  if (isPlatinum) {
    legacy['platinum-report-loading'] = 'report-loading';
    legacy['platinum-booking'] = 'platinum-confirmation';
    legacy['first-step'] = 'platinum-home';
  }
  const requested = Object.hasOwn(legacy,id) ? legacy[id] : id;
  if (!isPreview() || !order.includes(requested) || sending) return false;
  reviewer = true;
  sample = terminalStates.includes(requested) && !receipt;
  editing = false;
  go(requested);
  return true;
}
window.assessmentWireframe = {screens:manifest, jump, showSample:jump};
if (!jump(new URLSearchParams(location.search).get('screen')) && !resumeAssessment() && !resumeProfileDraft()) render();

// Send only the screen catalogue and current screen ID to the local design index.
if (window.parent !== window && new URLSearchParams(location.search).has('wireframes') && window.assessmentApi.mode === 'preview') {
  const stageRoot = document.getElementById('page');
  const notifyReviewer = () => window.parent.postMessage({
    type: 'thriver-wireframe',
    screens: window.assessmentWireframe.screens(),
    current: stageRoot.dataset.stage
  }, '*');
  new MutationObserver(notifyReviewer).observe(stageRoot, {attributes: true, attributeFilter: ['data-stage']});
  window.addEventListener('message', event => {
    if (event.source === window.parent && event.data?.type === 'thriver-review-jump') {
      window.assessmentWireframe.jump(event.data.id);
    }
  });
  notifyReviewer();
}

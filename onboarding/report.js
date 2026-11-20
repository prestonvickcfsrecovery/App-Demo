const resourcePreviews = {
  calendar: 'Platinum members see their group call times in the Academy calendar.',
  modules: 'Platinum members open their lessons in the Academy classroom.',
  chat: 'Platinum members can talk to their coach in a private Discord chat.',
  wins: 'Members share things they can do again in the community.',
  questions: 'Members can post a question and read replies from the community.'
};

function previewResource(label, description) {
  const detail = fold(label);
  detail.append(node('p', '', description));
  return detail;
}

function fastStartCalendar() {
  const card = reportSection('Try a sample booking');
  card.classList.add('sample-calendar');
  card.append(node('p', '', 'Choose a day and time to try the next step. These times are for practice.'));
  const monthNav = node('div', 'month-nav');
  const monthTitle = node('h3');
  monthTitle.setAttribute('aria-live', 'polite');
  const table = node('table');
  table.setAttribute('aria-label', 'Sample dates');
  const headingRow = table.createTHead().insertRow();
  for (const day of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']) {
    const cell = node('th', '', day);
    cell.scope = 'col';
    headingRow.append(cell);
  }
  const dates = table.createTBody();
  const times = node('div', 'sample-times');
  const monthLabel = new Intl.DateTimeFormat(undefined, {month: 'long', year: 'numeric'});
  const dayLabel = new Intl.DateTimeFormat(undefined, {weekday: 'long', month: 'long', day: 'numeric'});
  const timeLabel = new Intl.DateTimeFormat(undefined, {hour: 'numeric', minute: '2-digit'});
  const firstDay = new Date();
  firstDay.setHours(0, 0, 0, 0);
  firstDay.setDate(firstDay.getDate() + 1);
  while ([0, 6].includes(firstDay.getDay())) firstDay.setDate(firstDay.getDate() + 1);
  let offset = 0;

  function showTimes(date, trigger) {
    for (const day of dates.querySelectorAll('button')) day.setAttribute('aria-pressed', String(day === trigger));
    const title = node('h3', '', dayLabel.format(date));
    title.tabIndex = -1;
    const choices = node('div', 'opts');
    for (const hour of [10, 13, 15]) {
      const slot = new Date(date);
      slot.setHours(hour);
      choices.append(button(timeLabel.format(slot), 'opt', () => go('platinum-prep')));
    }
    times.replaceChildren(title, node('p', '', 'Pick a sample time in your time zone.'), choices);
    title.focus();
  }

  function showMonth() {
    const year = firstDay.getFullYear();
    const month = firstDay.getMonth() + offset;
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0).getDate();
    monthTitle.textContent = monthLabel.format(first);
    previous.disabled = offset === 0;
    nextMonth.disabled = offset === 1;
    dates.replaceChildren();
    times.replaceChildren();
    let row;
    for (let index = 0; index < first.getDay() + last; index++) {
      if (index % 7 === 0) row = dates.insertRow();
      const cell = row.insertCell();
      const number = index - first.getDay() + 1;
      if (number < 1) continue;
      const date = new Date(year, month, number);
      if (date < firstDay || [0, 6].includes(date.getDay())) {
        cell.textContent = number;
        continue;
      }
      const day = button(String(number), '', () => showTimes(date, day));
      day.setAttribute('aria-label', dayLabel.format(date));
      day.setAttribute('aria-pressed', 'false');
      cell.append(day);
    }
  }
  const previous = button('‹', '', () => { offset--; showMonth(); });
  previous.setAttribute('aria-label', 'Previous month');
  const nextMonth = button('›', '', () => { offset++; showMonth(); });
  nextMonth.setAttribute('aria-label', 'Next month');
  monthNav.append(previous, monthTitle, nextMonth);
  card.append(monthNav, table, times);
  showMonth();
  return card;
}

const reportDomains = [
  {key:'physical', label:'Body', items:['Moving around at home for over an hour','Standing for over 30 minutes','Doing chores for over 30 minutes','Walking outside for over 30 minutes','Standing showers per week','Driving for over 30 minutes','Eating most foods']},
  {key:'cognitive',label:'Thinking',items:['Using a screen for over an hour','Talking in person for over an hour','Talking on the phone for over an hour','Keeping a list in your head','Reading for over 30 minutes','Writing short sentences','Remembering things from the past two weeks']},
  {key:'emotional',label:'Feelings',items:['Handling strong feelings','Staying calm in a flare','Dealing with a change in plans','Taking a break without feeling guilty','Feeling calm again','Showing how you feel','Handling the unknown']}
];
function fold(label) {
  const details = node('details','report-fold');
  details.append(node('summary','',label));
  return details;
}
function reportSection(title) {
  const section = node('section','nsha-card');
  section.append(node('h2','',title));
  return section;
}
function prepareForCall() {
  const prep = fold('Get ready for your call');
  prep.append(node('p','','Open your Skool invite from Miguel Bautista. Tap “Join Now” to find your Platinum lessons.'),
    previewResource('Join the Platinum Discord',resourcePreviews.chat),
    node('p','','In Discord, sign the “Recovery Academy Platinum Invitation” agreement. Then find your private chat with your coach.'));
  return prep;
}
function showTriangle(index = reportStageIndex()) {
  const section = reportSection('Your recovery stage');
  const q = questions.get('activityLevel');
  const selected = q.options[index];
  const plot = node('ol','triangle-bands');
  plot.setAttribute('aria-label','Nervous System Triangle, from Thriving to Bedbound');
  const colors = ['#f3aaa6','#f5c097','#f9d689','#f5e387','#eaf09c','#b7ddba'];
  for (let i=q.options.length-1; i>=0; i--) {
    const band = node('li','');
    band.style.setProperty('--band',colors[i]);
    band.style.setProperty('--span',(33+i*13.4)+'%');
    band.append(node('span','band-fill'),node('span','band-label',q.options[i].split(':')[0]));
    if (i===index) {
      band.classList.add('current');
      band.setAttribute('aria-current','true');
      band.querySelector('.band-label').prepend(node('span','band-pin','● '));
    }
    plot.append(band);
  }
  section.append(plot);
  if (index>=0) section.append(node('p','triangle-note','You picked · '+selected.split(':')[0]),
    node('p','',selected.slice(selected.indexOf(':')+1).trim()));
  return section;
}
function reportStageIndex() {
  const stage = questions.get('activityLevel');
  const value = resultAnswer(stage.id);
  return typeof value === 'number' ? stage.optionValues.indexOf(value) : stage.options.indexOf(value);
}
const stageMilestones = [
  'Next month, you can look at how much help you need with a meal or with sitting up.',
  'Next month, you can look at how it feels to spend time in another room.',
  'Next month, you can look at how much planning a trip outside takes.',
  'Next month, you can look at which trips fit into your week.',
  'Next month, you can look at how work, friends or hobbies fit into your week.',
  'Next month, you can look at what stayed steady and what changed.'
];
const polarityScales = {
  physical: {name:'Physical', count:4, low:'Rest more', high:'Push harder'},
  cognitive:{name:'Cognitive', count:2, low:'Act quickly', high:'Overthink'},
  emotional:{name:'Emotional', count:4, low:'Feel little', high:'Feel a lot'}
};
function reportScores(ids) {
  return ids.map(id => {
    const q = questions.get(id);
    const value = resultAnswer(id);
    if (typeof value === 'number') return q.optionValues.includes(value) ? value : null;
    return q.optionValues[q.options.indexOf(value)] ?? null;
  });
}
function scoreAverage(values, count, min) {
  if (values.length !== count || !values.every(value => Number.isInteger(value) && value >= min && value <= 5)) return null;
  return values.reduce((sum,value) => sum + value,0) / count;
}
function compareCapacity(body, thinking) {
  if (body == null || thinking == null) return '';
  if (body === thinking) return 'You gave body tasks and thinking tasks the same average score. A single task may still stand out.';
  return thinking > body
    ? 'You gave body tasks a lower score overall than thinking tasks. Which body task would you like help with first?'
    : 'You gave thinking tasks a lower score overall than body tasks. Which thinking task would you like help with first?';
}
function showCapacity() {
  const section = reportSection('What you can do today');
  section.append(node('p','','Each bar shows the average of your seven answers. Open a group to see what you picked.'));
  const averages = {};
  for (const domain of reportDomains) {
    const ids = sectionIds('capacity',domain.key);
    const values = reportScores(ids);
    const average = scoreAverage(values,7,0);
    averages[domain.key] = average;
    const line = node('div','capacity-row '+domain.key);
    line.append(node('b','',domain.label),node('span','',average === null ? 'Some answers are missing' : average.toFixed(1)+' / 5'));
    const meter = node('div','capacity-track');
    const fill = node('span','');
    fill.style.width = average === null ? '0%' : (average*20)+'%';
    meter.append(fill);
    line.append(meter);
    section.append(line);
    const details = fold('See '+domain.label.toLowerCase()+' ratings');
    ids.forEach((id,i) => {
      const score = values[i];
      const display = score === null ? 'No answer' : id==='physicalCapacity5' ? (score === 5 ? '5+' : score)+' / week' : score+' / 5';
      const row = node('div','rating-line');
      row.append(node('span','',questionTitle(id)),node('strong','',display));
      details.append(row);
    });
    section.append(details);
  }
  const comparison = compareCapacity(averages.physical,averages.cognitive);
  if (comparison) section.append(node('p','report-insight',comparison));
  const info = fold('How the bars work');
  info.append(node('p','','0 means you can’t do the task yet. 5 means you can do it with ease nearly all the time. For standing showers, the score is the number you can take in a week. Five or more counts as 5.'));
  section.append(info);
  return section;
}
function showPatterns() {
  const section = reportSection('Your patterns');
  section.append(node('p','','These dots show how you tend to act, think, and feel. Each dot is your average for that group. The middle choice is 3. Different answers can average to 3, too.'));
  for (const domain of reportDomains) {
    const scale = polarityScales[domain.key];
    const ids = sectionIds('polarity',domain.key);
    const scores = reportScores(ids);
    const mean = scoreAverage(scores,scale.count,1);
    const row = node('div','pattern-line');
    row.append(node('strong','',scale.name+' patterns'),node('span','',mean === null ? 'Some answers are missing' : mean+' / 5'));
    if (mean !== null) {
      const track = node('div','pattern-track');
      const marker = node('i','pattern-marker');
      marker.style.left = (mean-1)*25+'%';
      track.append(marker);
      track.setAttribute('aria-hidden','true');
      const labels = node('div','polarity-labels');
      labels.append(node('span','','1 · '+scale.low),node('span','','3 · Balanced'),node('span','','5 · '+scale.high));
      row.append(track, labels);
    }
    section.append(row);
    const detail = fold('See '+scale.name.toLowerCase()+' answers');
    ids.forEach((id,i) => {
      const q = questions.get(id);
      const score = scores[i];
      const text = score === null ? 'No answer' : presentedAnswer(q,q.options[q.optionValues.indexOf(score)]);
      detail.append(node('b','',questionTitle(id)),node('p','',score === null ? text : score+' / 5 · '+text));
    });
    section.append(detail);
  }
  return section;
}
function assessmentSummary() {
  const section = reportSection('What stands out in your answers');
  const stageQuestion = questions.get('activityLevel');
  const stageIndex = reportStageIndex();
  const selectedStage = stageQuestion.options[stageIndex];
  const stageNotes = [
    'Even sitting up or eating can take planning.',
    'You can get from bed to a chair. Daily tasks still take planning.',
    'You can do some things at home. Going out takes planning and effort.',
    'Short trips fit into your week. Time away from home still has limits.',
    'You can do most daily tasks. Symptoms can still shape your plans.',
    'You described living life with high capacity and no longer experiencing chronic symptoms.'
  ];
  if (stageIndex !== -1) {
    section.append(node('p','','You chose '+selectedStage.split(':')[0]+'. '+stageNotes[stageIndex]));
  }

  const ratings = [];
  for (const domain of reportDomains) {
    const ids = sectionIds('capacity',domain.key);
    reportScores(ids).forEach((score,i) => {
      // Weekly shower counts have different units from the ease ratings.
      if (ids[i] !== 'physicalCapacity5' && score !== null) {
        ratings.push({task:domain.items[i].toLowerCase(),score});
      }
    });
  }
  if (ratings.length) {
    const lowest = Math.min(...ratings.map(r => r.score));
    const harder = ratings.filter(r => r.score === lowest);
    let insight;
    if (lowest >= 4) {
      insight = 'You gave each task a 4 or 5 out of 5. Most things we asked about feel manageable for you right now.';
    } else if (harder.length === ratings.length) {
      insight = 'You gave each task the same rating, '+lowest+' out of 5. '+(lowest <= 2
        ? 'Several parts of the day may take a lot of effort. You could pick just one to talk through first.'
        : 'The scores don’t point to one main hurdle. What you’d like help with can guide where you start.');
    } else {
      const task = harder[0];
      insight = 'You rated '+task.task+' '+lowest+' out of 5. '+(lowest <= 2
        ? 'That may be one part of your day where a little more support would help.'
        : 'That took more effort than some of the other tasks you rated.');
    }
    section.append(node('p','',insight));
  }

  const betterDays = questions.get('physicalPattern1');
  const score = reportScores([betterDays.id])[0];
  if (score !== null) {
    const choice = betterDays.options[betterDays.optionValues.indexOf(score)];
    section.append(node('p','','On days you feel better, you chose “'+presentedAnswer(betterDays,choice)+'”'));
  }
  return section;
}
function illnessDurationLabel(years, months) {
  if (years !== '50+' && (!Number.isInteger(years) || years < 0 || years > 49)) return '';
  if (!Number.isInteger(months) || months < 0 || months > 11) return '';
  return years+' '+(years === 1 ? 'year' : 'years')+', '+months+' '+(months === 1 ? 'month' : 'months');
}
function reportDateline() {
  const dateline = node('p','report-dateline');
  const completed = receipt?.dateCompleted;
  const displayDate = completed && new Date(completed+'T00:00:00Z');
  if (displayDate && Number.isFinite(displayDate.getTime())) {
    const date = node('time','',displayDate.toLocaleDateString(undefined,{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}));
    date.dateTime = completed;
    dateline.append('Date Completed · ',date,' · ');
  }
  const version = receipt?.surveyVersion || (receipt?.status === 'historical-stage' ? receipt.schemaVersion : window.assessmentApi.surveyVersion);
  if (version) dateline.append(version);
  return dateline;
}
function assessmentReport() {
  const mast = node('header','assessment-mast');
  mast.append(reportDateline());
  const title = node('h1','','Your Nervous System Health Assessment');
  title.tabIndex = -1;
  mast.append(title,node('p','monthly-note','You’ll answer these questions each month. We can see what has changed and guide you on your next step.'));
  const duration = sample && profile.illnessYears === '' ? illnessDurationLabel(2,0) : illnessDurationLabel(profile.illnessYears,profile.illnessMonths);
  if (duration) mast.append(node('p','field-note','Time you’ve felt unwell · '+duration));
  page.append(mast);
  page.append(assessmentSummary(),showTriangle());
  const goal = reportSection('What matters to you');
  goal.append(node('p','',resultAnswer('personalWin')),node('h3','',supportSource === 'focusChoice' ? 'Support you picked at the start' : 'Where you want help'),node('p','',supportDisplay(resultAnswer('helpInRecovery'))));
  page.append(goal,showCapacity(),showPatterns());
  const stageIndex = reportStageIndex();
  if (stageMilestones[stageIndex]) {
    const milestone = reportSection('What to look for next month');
    milestone.append(node('p','',stageMilestones[stageIndex]));
    page.append(milestone);
  }
  const symptoms = fold('See the symptoms you picked');
  for (const domain of reportDomains) {
    const id = domain.key+'Symptoms';
    const value = resultAnswer(id);
    const text = Array.isArray(value) ? presentedAnswer(questions.get(id),value) : 'No answer';
    symptoms.append(node('b','',C.symptomLabels[id]),node('p','',text));
  }
  page.append(symptoms,node('p','field-note','These are your answers today. A doctor or nurse can help you figure out what your symptoms mean.'));
  footer('Continue',()=>go(handoffStates[0]));

}
const cohortCalls = [{name:'Learning Call',minutes:90},{name:'Q&A Call',minutes:60}];
const cohortTimes = ['',''];
function calendarStamp(date) {
  return date.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
}
function downloadCohort(times,example) {
  const rows=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Thriver Companion//Platinum Cohort//EN','CALSCALE:GREGORIAN'];
  const stamp=calendarStamp(new Date());
  cohortCalls.forEach((call,index)=>{
    const first=new Date(times[index]);
    for (let week=0; week<4; week++) {
      const start=new Date(first);
      start.setDate(first.getDate()+week*7);
      const begin=calendarStamp(start);
      rows.push('BEGIN:VEVENT','UID:'+index+'-'+begin+(example?'-example':'')+'@thrivercompanion',
        'DTSTAMP:'+stamp,'DTSTART:'+begin,'DURATION:PT'+call.minutes+'M',
        'SUMMARY:'+(example?'Example - ':'')+'Platinum '+call.name,'END:VEVENT');
    }
  });
  rows.push('END:VCALENDAR','');
  const url=URL.createObjectURL(new Blob([rows.join('\r\n')],{type:'text/calendar;charset=utf-8'}));
  const anchor=document.createElement('a');
  anchor.href=url;
  anchor.download=example?'Example Platinum calls.ics':'Platinum cohort calls.ics';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),20000);
}
function exampleTimes() {
  const first = new Date();
  first.setDate(first.getDate()+7);
  return cohortCalls.map((_,i)=>{
    const d = new Date(first);
    d.setDate(first.getDate()+2*i);
    return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')+'T12:00';
  });
}
function cohortCalendar() {
  heading('Add your cohort calls','Your small group meets twice a week for four weeks. Check your invite for the dates and times.');
  for (const call of cohortCalls) page.append(informationCard(call.name,call.minutes+' minutes each week'));
  page.append(previewResource('Open my Academy calendar',resourcePreviews.calendar));
  const setup = fold('Add all four weeks to my calendar');
  const form = node('form','cohort-form');
  const zone=Intl.DateTimeFormat().resolvedOptions().timeZone;
  form.append(node('p','','Add the date and time of the first call of each kind. Use your time zone ('+zone+').'));
  const status=node('p','calendar-status');
  status.setAttribute('role','status');
  cohortCalls.forEach((call,i)=>{
    const label=node('label','profile-label','First '+call.name);
    const input=node('input','profile-input');
    input.required=true;
    input.type='datetime-local';
    input.value=cohortTimes[i];
    input.addEventListener('input',()=>{cohortTimes[i]=input.value;status.textContent='';});
    label.append(input);
    form.append(label);
  });
  const save=node('button','primary','Download eight sample calls');
  save.type='submit';
  form.addEventListener('submit',event=>{
    event.preventDefault();
    const values=Array.from(form.querySelectorAll('input'),input=>input.value);
    if (!form.reportValidity() || values.some(value=>!Number.isFinite(new Date(value).getTime()))) return;
    downloadCohort(values,true);
    status.textContent='Your file has eight sample calls.';
  });
  form.append(save);
  setup.append(form);
  if (reviewer && sample) setup.append(button('Try with example dates','link',()=>{
    downloadCohort(exampleTimes(),true);
    status.textContent='Your test file is ready. All eight calls say “Example”.';
  }));
  setup.append(status);
  page.append(setup);
  footer('See my Platinum resources',()=>go('platinum-start'),'Back to my assessment',()=>go('review'));
}
function platinumStartingPoint() {
  heading('Your Platinum starting point','Here’s where to go when you need a lesson, an answer or someone to talk to.');
  const learning=reportSection('Find your first lesson');
  learning.append(previewResource('Open my Platinum modules',resourcePreviews.modules));
  const support=reportSection('Ask for help');
  support.append(node('p','','Send your coach a note in your private Discord chat. You can also meet one to one with your coach each month.'),
    previewResource('Open Discord',resourcePreviews.chat));
  const peers=reportSection('Meet other Thrivers');
  peers.append(previewResource('Read community wins',resourcePreviews.wins),previewResource('Ask the community a question',resourcePreviews.questions));
  page.append(learning,support,peers);
  footer('Return to my cohort calls',()=>go('platinum-calendar'),'My assessment',()=>go('review'));
}

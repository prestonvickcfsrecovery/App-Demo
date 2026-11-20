// DRAFT. The survey question and answer strings are in the October 15 NSHA catalog.
const assessmentCopy = {
  status: 'DRAFT',
  title: 'Nervous System Health Assessment',
  parts: ['Your goals', 'Your capacity', 'Your patterns'],
  sectionLine: 'Part {part} of 3 · {name}',
  progressLabel: 'Assessment progress',
  groups: {
    today:'Your day', goal:'Your goals', symptoms:'Your symptoms', body:'What your body can do', mind:'Thinking and memory',
    emotionalEnergy:'Handling feelings', activity:'Your daily life', pacing:'When you slow down',
    thinking:'How you make choices', feelings:'How you feel', help:'Your focus'
  },
  symptomLabels: {physicalSymptoms:'Physical symptoms', cognitiveSymptoms:'Cognitive symptoms', emotionalSymptoms:'Emotional symptoms'},
  symptomSubheads: {
    physicalSymptoms:'Think about pain, energy, and other changes in your body.',
    cognitiveSymptoms:'Think about your focus, words, and memory.',
    emotionalSymptoms:'Think about your feelings and changes in your mood.'
  },
  sample: 'Wireframe sample · fictional answers',
  sampleScreen: 'Wireframe preview',
  purpose: {
    goal:'We’ll show you a Thriver’s story that fits what you miss.',
    symptoms:'Pick all that fit. We’ll put them in your report.',
    body:'This shows which daily tasks take work for you.',
    mind:'This helps us plan how much to cover at once.',
    emotionalEnergy:'This shows when you may need more time to settle.',
    activity:'Your pick sets your recovery stage in the report.',
    pacing:'This shows when you keep going and when you pull back.',
    thinking:'This helps us see what gets in the way of a choice.',
    feelings:'This helps us learn what kind of help fits a hard day.',
    help:'We’ll use this to help you pick where to start.'
  },
  titles:{
    physicalSymptoms:'Which physical symptoms do you have?',
    cognitiveSymptoms:'Which cognitive symptoms do you have?',
    emotionalSymptoms:'Which emotional symptoms do you have?',
    physicalCapacity1:'Can you move around your home with ease for over an hour at a time?',
    physicalCapacity2:'Can you stand for over 30 minutes at a time?',
    physicalCapacity3:'Can you do simple chores for over 30 minutes at a time?',
    physicalCapacity4:'Can you walk outside for over 30 minutes at a time?',
    physicalCapacity5:'In a week, how many showers can you take standing up?',
    physicalCapacity6:'Can you drive for over 30 minutes at a time?',
    physicalCapacity7:'Can you eat most foods without trouble?',
    cognitiveCapacity1:'Can you look at a screen for over an hour at a time?',
    cognitiveCapacity2:'Can you talk in person for over an hour at a time?',
    cognitiveCapacity3:'Can you talk on the phone for over an hour at a time?',
    cognitiveCapacity4:'Can you keep a list in your head of things you need to do?',
    cognitiveCapacity5:'Can you read for over 30 minutes at a time?',
    cognitiveCapacity6:'Can you write or type short, clear sentences?',
    cognitiveCapacity7:'Can you remember things you saw or heard in the past two weeks?',
    emotionalCapacity1:'Can you feel upset without the feeling taking over?',
    emotionalCapacity2:'When symptoms get worse, can you stay calm without checking them again and again?',
    emotionalCapacity3:'If plans change or you’re unsure what’s next, can you adjust without getting very upset?',
    emotionalCapacity4:'Can you slow down, rest or change plans without feeling very guilty or rushed?',
    emotionalCapacity5:'When you feel on edge, can you settle again quickly?',
    emotionalCapacity6:'Can you notice how you feel and show it?',
    emotionalCapacity7:'Can you handle not knowing what comes next without needing answers all the time?',
    physicalPattern1:'How much do you do on a better day?',
    physicalPattern2:'How much do you do on a harder day?',
    physicalPattern3:'When do you usually pull back?',
    physicalPattern4:'What do you usually do when symptoms flare?',
    cognitivePattern2:'How often do you get stuck thinking about what to do?',
    emotionalPattern1:'How strong are your feelings most of the time?',
    emotionalPattern2:'How do you usually show your feelings?',
    emotionalPattern3:'When you feel scared, sad or upset, what usually happens?',
    emotionalPattern4:'How do you feel when something takes you by surprise?',
    helpInRecovery:'Where do you need the most help right now?'
  },
  choices:{
    physicalPattern1:['I do almost nothing.','I do a little and hold back.','I do an amount I can handle today.','I do more than usual.','I do as much as I can.'],
    physicalPattern2:['I stop and rest.','I do very little and rest more.','I do an amount I can handle today.','I do a bit less but still push myself.','I push through and do as much as I can.'],
    physicalPattern3:['Even before I feel symptoms.','At the first sign of symptoms.','When symptoms start to bother me a little.','When symptoms get hard to handle.','Only when symptoms feel like too much.'],
    physicalPattern4:['I rest until my symptoms are gone.','I rest until I feel much better.','I rest when symptoms build and do a little more when they ease.','I keep going unless symptoms get very bad.','I keep going even with strong symptoms.'],
    cognitivePattern2:['I act right away without thinking.','I act fast and may give it too little thought.','I can pause, think and then act.','I overthink and find it hard to act.','I feel stuck in my thoughts. I can’t act.'],
    emotionalPattern1:['I feel little or nothing, whatever happens.','I often feel less than I’d expect to.','My feelings usually fit what’s happening.','I often feel more than I’d expect to.','My feelings are always strong. It’s hard to calm down.'],
    emotionalPattern2:['I shut down or feel numb.','I hold my feelings in. It’s hard to show them.','I can show how I feel in a way that fits what happened.','My feelings often spill out before I’m ready.','I often react so strongly that it can feel like a lot to others.'],
    emotionalPattern3:['I barely notice and keep going.','I move on fast. I don’t give them much thought.','I feel them, then they pass.','They last longer than I’d like and affect most of my day.','They take over and I can’t do much for the rest of the day.'],
    emotionalPattern4:['I barely notice. I move straight on.','I adjust fast and give it little thought.','I can stay steady and change my plans.','It throws me off for quite a while.','It feels like too much. It’s very hard to adjust.']
  },
  symptomNames:{
    'Cold Extremities':'Cold hands or feet','Fatigue':'Fatigue (feeling very tired)','Joint Pain':'Pain in your joints','Muscle Weakness':'Weak muscles','Nausea':'Feeling sick to your stomach','Enlarged Lymph Nodes':'Swollen glands','Heart Palpitations':'A racing or pounding heart','Frequent Urination':'Needing to pee often','Insomnia':'Trouble sleeping','Digestive Problems (IBS)':'Gut problems (IBS)','Temperature Dysregulation (feeling hot or cold easily)':'Feeling hot or cold easily','POTS / Dysautonomia':'POTS or dysautonomia (trouble with things your body does on its own)','Hormonal Fluctuations':'Changes in hormones','Tinnitus (ringing in ears)':'Ringing in your ears','Tremors / Internal Vibrations':'Shaking or feeling shaky inside',
    'Feelings of Anxiety or Feeling On Edge':'Feeling worried or on edge','Irritability':'Getting annoyed easily','Emotional Overwhelm':'Feeling like it’s all too much','Increased Sensitivity or Tearfulness':'Feeling hurt or crying more easily','Fear or Hypervigilance':'Feeling scared or always on alert','Emotional Numbness':'Feeling numb','Dissociation':'Feeling far away from yourself or the things around you','Emotional Reactivity':'Strong feelings that come on fast'
  },
  whys:{
    focusChoice:'We’ll use your answer to pick an example that fits your day.',
    personalWin:'We’ll use your words for the goal in your report.',
    physicalSymptoms:'Think about your body. Pick all that fit today for your report.',
    cognitiveSymptoms:'Think about focus, words and memory. Pick all that fit for your report.',
    emotionalSymptoms:'Think about your mood and feelings. Pick all that fit for your report.',
    physicalCapacity1:'This shows how moving at home fits your day.',
    physicalCapacity2:'This shows how long you can stay on your feet.',
    physicalCapacity3:'This shows how jobs like dishes or laundry fit your day.',
    physicalCapacity4:'This shows how much effort a walk can take.',
    physicalCapacity7:'This shows how meals fit into your day.',
    cognitiveCapacity2:'This helps us plan how long to talk at one time.',
    cognitiveCapacity3:'This helps us plan how much to cover on a call.',
    cognitiveCapacity5:'This shows how much reading can fit into your plan.',
    cognitiveCapacity6:'This shows how much work a short note takes.',
    emotionalCapacity1:'This shows how hard it is to sit with a feeling.',
    emotionalCapacity2:'This shows how you feel during a flare.',
    emotionalCapacity3:'This helps us see how last-minute changes feel for you.',
    emotionalCapacity4:'This shows if it’s hard to take a break without blaming yourself.',
    emotionalCapacity5:'This shows how much time you need to feel calm.',
    emotionalCapacity6:'This helps us see how easy it is to share a feeling.',
    emotionalCapacity7:'Think about the need to feel in control or hear “It’ll be okay.” This shows what help fits you.',
    physicalCapacity5:'This shows how a daily task like washing fits your week.',
    physicalCapacity6:'This shows how a trip fits your day. If you don’t drive, take a guess.',
    cognitiveCapacity1:'This helps us choose how much screen time fits your plan.',
    cognitiveCapacity4:'Think about errands or calls. This shows how much work it takes to keep a list in your head.',
    cognitiveCapacity7:'This helps us plan how much to go over at once.',
    helpInRecovery:'This helps us pick a starting point for your recovery roadmap.'
  },
  scale:['0 = Can’t do it yet','5 = Can do it with ease'],countScale:['0 = None','5 = Five or more'],
  freePlaceholder:'Write a few words', charCount:'{count} / 250', none:'None of these',selectedCount:'{count} selected',
  scope:{
    title:'Before we go further.',
    body:'This assessment helps you learn what fits your day right now.',
    note:'Talk to your health care team about symptoms or treatment.',
    preview:'Use made-up details for this test. If you reload this tab, your answers will clear.',
    local:'Use made-up details. When you finish, this demo saves your answers on this computer.'
  },
  difficulty:{
    title:'When a symptom flare up changes your plans.',
    body:'You can look forward to a day out and then feel too sick to go. It’s hard to make plans when symptoms change without warning.',
    question:'What feels hardest right now?',
    byFocus:{
      'Knowing when to pull back':{choice:'I can’t tell when to slow down.',title:'Will I have energy left for dinner?',body:'You might feel okay doing the dishes. Then a symptom flare up hits, and you miss dinner with your family. It’s hard to tell when to slow down.'},
      'Reducing flare-ups':{choice:'Flare-ups keep changing my plans.',title:'Having to cancel activities at the last minute?',body:'You might look forward to seeing a friend, then wake up with a symptom flare up. It hurts to miss out on something you were excited about.'},
      'Understanding recovery':{choice:'I don’t understand what’s happening.',title:'When a symptom flare up changes your plans.',body:'You might feel up to a family party one day, then feel too sick to go. It’s hard to make plans when symptoms change without warning.'},
      'Knowing when to increase activity':{choice:'I’m unsure when I can do more.',title:'Could I join that walk?',body:'A friend asks you to walk to the park. You’d love to go. When a symptom flare up can come out of nowhere, it’s hard to know if the walk will fit your day.'}
    }
  },
  catchUp:{
    title:'Do you miss the old version of you?',
    body:'When mysterious symptoms you can’t explain keep you home, you may feel like you\'re losing a part of yourself.'
  },
  fatiguePem:{
    title:'Wiped out after small activities?',
    lines:['Even small activities can make symptoms flare up. This is called post-exertional malaise, or PEM.',
      'In a UK study of 17,074 people with ME/CFS, 97.5% said a symptom flare up could last over a day after they went past their energy limit.'],
    pose:'notice',
    citation:'DecodeME study, Bretherick and others (2023).',
    url:'https://openresearch.nihr.ac.uk/articles/3-20'
  },
  brainFog:{
    title:'Brain fog can make words hard to find.',
    kicker:'Did You Know?',
    number:'17,074',
    label:'people with ME/CFS took part in a UK study. Confusion or brain fog was one of the three symptoms they reported most.',
    source:'People were asked about symptoms that kept coming back over six months.',
    citation:'DecodeME study, Bretherick and others, 2023, Figure 3.',
    url:'https://openresearch.nihr.ac.uk/articles/3-20'
  },
  lessons:{
    'opening-logo':{title:'Thriver Companion'},
    'opening-neuro':{
      title:'Hi, I’m Neuro.',
      lines:['I’m your Thriver Companion. I’ll be here with you on your recovery journey.'],
      pose:'welcome'
    },
    'opening-study':{
      title:'Did you know?',
      lines:['One estimate says about 70 million people around the world have ME/CFS.',
        'In our community, members say their symptoms make more sense and they know what to try next.'],
      citation:'Vardaman & Gilmour (2025).',
      pose:'learn'
    },
    'opening-community':{
      title:'Meet the Thriver community.',
      lines:['CFS Recovery has helped thousands of people in 50+ countries, including people with Long COVID, ME/CFS, and fibromyalgia.',
        'Members have shared 100+ hours of filmed recovery case studies and posted thousands of wins in our communities.'],
      pose:'welcome'
    },
    arrival:{title:'You’re in the right place.',lines:['You don’t have to know where to start.',
      'Tell us what feels hard today. We’ll take it one question at a time.'],pose:'welcome',cta:'Find my starting point.'},
    'symptoms-intro':{title:"This assessment helps us find your starting point.",body:"We’ll create your recovery profile from your answers. Think about how you feel right now.",plain:true},
    'capacity-intro':{title:'Let’s look at your physical energy and patterns.',body:'Your answers show which tasks take the most energy and where you could use help.',plain:true},
    'plan-preview':{title:'Putting your recovery profile together',plain:true},
    'goal-intro':{title:'You made it to the last section!',pause:'Now for the exciting part...',body:'What would you love to do again? Your goal helps us find a Thriver with a story like yours.',plain:true},
    'nervous-system':{title:"Where can symptoms come from?",body:"Your nervous system carries messages between your brain and body. Changes in how those messages travel may play a part in some symptoms. Your care team can help you explore other causes.",citation:'Institute of Medicine, ME/CFS report, chapter 4 (2015).',url:'https://www.nationalacademies.org/read/19012/chapter/6'},
    standing:{title:'Does standing make you dizzy?',body:'In one clinic study, 429 people with ME/CFS lay on a table. When the table tilted them upright, 9 in 10 had a bigger drop in blood flow to the brain than expected.',citation:'van Campen and colleagues, Clinical Neurophysiology Practice (2020).',url:'https://pubmed.ncbi.nlm.nih.gov/32140630/'},
    'daily-effort':{title:"How did this all start?",body:"Think back to when daily tasks first felt harder. Our coaches call the amount you can manage before symptoms flare your “stress threshold.” It can change from day to day."},
    'mental-energy':{title:'Next, let’s look at your cognitive energy and patterns.',body:'Your answers about reading, calls, and screens help us build your personal cognitive plan.'},
    'stress-threshold':{title:'Why do I flare up after activity?',body:'A shower can feel fine at the time but leave you wiped out later. When effort makes your symptoms flare, that’s called post-exertional malaise, or PEM. It can be hard to spot your stress threshold in the moment.',citation:'Stussman and colleagues, Frontiers in Neurology (2020).',url:'https://pubmed.ncbi.nlm.nih.gov/33071931/'},
    'stress-load':{title:'Can PEM show up the next day?',body:'Yes. In a survey of 1,534 people with ME/CFS, just over half said a flare could start 1 to 2 days after effort.',citation:'Holtzman and colleagues, Diagnostics (2019), Table 2.',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC6468435/'},
    'emotional-context':{title:'What happens when life surprises you?',body:'How you feel when unexpected events occur tells us what support might help on a hard day.'},
    'delayed-symptoms':{title:'Can thinking bring on a symptom flare-up?',body:'Reading or a long phone call takes energy, too. You might enjoy a chat with a friend, then find it hard to think or even get dressed later.',citation:'Stussman and colleagues, Frontiers in Neurology (2020).',url:'https://pubmed.ncbi.nlm.nih.gov/33071931/'},
    'adjustment-period':{title:'Are flare-ups bad?',body:'At CFS Recovery, we call a symptom flare-up after a change in activity an “adjustment period.” A new level of activity may be more than your body can handle right now. It’s okay to do less and rest.'},
    'adjustment-respond':{title:"What can a flare tell me?",body:"A flare can be a cue to pause and adjust what you do. Think back to what felt manageable before it started. Here’s how that can help you spot a pattern over time."},
    'adjustment-research':{title:"What does a progress cycle look like?",body:"You may have easier days, a flare, then a stretch when things settle. Tracking activity and rest can help you see your own pattern. A flare is a reason to respect your limits."},
    'alarm-response':{title:"Why does pain sometimes linger?",body:"Researchers are studying how the brain processes pain. One area they study is the amygdala. It helps you notice possible danger. Always talk with your health care professional about new or changing symptoms."},
    'pain-study':{title:"What did brain scans show?",body:"After pressure on the leg stopped, people with fibromyalgia felt more lingering pain than the comparison group. Activity in a brain region that includes the amygdala settled less. This shows a link, and the cause is still being studied.",citation:'Painful after-sensations study, Journal of Pain (2017).',url:'https://pubmed.ncbi.nlm.nih.gov/28300650/'},
    'freeze-response':{title:"Can learning to express feelings help symptoms?",body:"In a study of 230 adults with fibromyalgia, people who practiced naming and expressing feelings reported fewer overall symptoms than those who took a class about the condition. The groups had similar average pain severity at six months.",citation:'Lumley and colleagues, Pain (2017).',url:'https://pubmed.ncbi.nlm.nih.gov/28796118/'},
    'stress-and-symptoms':{title:'Can stress come with a flare?',body:'In a survey of 1,534 people with ME/CFS, about 9 in 10 said stress could make their symptoms worse. Even a happy event could feel like a lot.',citation:'Holtzman and colleagues, Diagnostics (2019), Table 3.',url:'https://pmc.ncbi.nlm.nih.gov/articles/PMC6468435/'},
    'stress-support-study':{title:'What happened when stress eased?',body:'A small study enrolled 69 people with CFS. The group that practiced stress skills for 12 weeks reported a bigger drop in stress and milder symptoms than the group that took one class.',citation:'Lopez and colleagues, Journal of Psychosomatic Research (2011).',url:'https://pubmed.ncbi.nlm.nih.gov/21414452/'},
    'feelings-context':{title:'You’re almost there.',body:'Your last few answers will help us shape your recovery roadmap.',milestone:'Thanks for telling us how you make choices.'},
    'after-surprise':{title:"Your three capacity sections are complete.",body:"Your profile now includes your answers about physical, cognitive, and emotional capacity and patterns."}
  },
  decisionPause:{
    title:'Give yourself time to choose.',
    balanced:'A new plan comes up. Before you say yes, you might ask, “What feels manageable today?” Our coaches use this question, too.',
    quick:'You said you tend to act fast. Before you say yes to one more task, you can ask, “Does this fit my day?”',
    thinks:'You said it can be hard to choose. Try asking, “What’s one small choice I can make now?”'
  },
  proof:{
    title:'A win worth sharing.',
    matched:'You and {name} have a goal in common.',
    next:'Next, see what other members shared at check-in.'
  },
  outcomes:{title:'Inside the Thriver community',body:'Members have shared thousands of recovery wins. You can also hear their stories in more than 100 hours of filmed case studies.'},
  story:{
    title:'In their own words.',
    proof:'Thrivers have shared 100+ hours of filmed case studies in their own words.',
    byGoal:{
      'Getting back to work':['nicole','annette','jackieFamily'],
      'Getting fit, active, and exercising':['annette','david','nicoleDay'],
      'Traveling and adventuring':['tomoyuki','david','annette'],
      'Enjoying quality time with loved ones':['jackieFamily','david','nicoleDay']
    },
    defaultIds:['jackieFamily','nicoleDay','annette'],
    members:{
      jackieFamily:{name:'Jackie',startingPoint:'Was housebound',title:'At her nephew’s wedding.',body:'Jackie said she used to struggle to get to the store. Later, she told us about dancing with her son at a family wedding.',quote:'dancing after hours with my son',read:'Watch Jackie’s interview',url:'https://www.youtube.com/watch?v=Q10Twc2Wu9w'},
      nicole:{name:'Nicole',startingPoint:'Had been bedbound',title:'Going back to work.',body:'Nicole was an executive assistant. She told us how she went back to work a little at a time.',quote:'I started back to work last week',read:'Watch Nicole’s interview',url:'https://www.youtube.com/watch?v=3BPmRoc-aO4'},
      nicoleDay:{name:'Nicole',startingPoint:'Was in bed for weeks at a time',title:'Fewer symptoms during the day.',body:'Nicole said mornings could be hard. She also told us how she felt later in the day.',quote:"Now, I don't really have a lot of symptoms during the day.",read:'Watch Nicole’s interview about symptoms',url:'https://www.youtube.com/watch?v=LcFAhdrNRVw'},
      alexandr:{name:'Alexandr',startingPoint:'Could rarely leave home',title:'What Alexandr noticed about pain.',body:'Alexandr told us about his pain after he tried exercises from the public channel.',quote:'And after five, six months, I think 80, 90% of my pain was gone.',read:'Watch Alexandr’s interview',url:'https://www.youtube.com/watch?v=AsAU4fnuc3c'},
      tomoyuki:{name:'Tomoyuki',startingPoint:'Could rarely leave home',title:'A trip to go snorkeling.',body:'Tomoyuki took a trip from Jakarta. He told us how much time he spent in the water.',quote:'And then I did a total of 4 hours of snorkeling.',read:'Watch Tomoyuki’s interview',url:'https://www.youtube.com/watch?v=ezqz4TbJSN8'},
      david:{name:'David',startingPoint:'Spent a week in bed',title:'A hike by the sea with his son.',body:'David wanted to carry his one-year-old son. He told us about a hike they took along the coast.',quote:'I was carrying him the whole way in a carrier',read:'Watch David’s interview',url:'https://www.youtube.com/watch?v=6lul1iKCISE'},
      annette:{name:'Annette',startingPoint:'Was in bed for about three months',title:'Back on the dance floor.',body:'At first, Annette went to a dance for half an hour. Here’s what she said about a later visit.',quote:'I went dancing for two and a half hours there',read:'Watch Annette’s interview',url:'https://www.youtube.com/watch?v=gX9ewL-509U'}
    }
  },
  buttons:{
    next:'Continue', back:'Back', check:'Review my answers', submit:'Submit my assessment', preview:'Preview my assessment',
    edit:'Change', saveEdit:'Save change', cancelEdit:'Cancel change', retry:'Try again', returnReview:'Review answers',
    report:'See my starting point', restart:'Start a new assessment', guide:'How this works'
  },
  intake:{
    history:'A little about your history.', historyHint:'Your age and how long you’ve felt unwell help us understand your answers.',
    age:'How old are you?', chooseAge:'Choose your age', years:'Years', months:'Months',
    illnessDuration:'How long have you felt unwell?', chooseYears:'Choose years', chooseMonths:'Choose months',
    profile:'Whose assessment is this?',
    profileHint:'These details link your report to you. Use a made-up name and email in this test.',
    firstName:'First name', lastName:'Last name', email:'Email address'
  },
  check:{
    title:'Ready to see your assessment?', description:'You’ve answered all {count} questions. Open a section to check or change an answer.',
    unanswered:'Unanswered', incomplete:'{count} of {total} answered. You can open a section to fill in a missing answer.',
    details:'Your details',
    previewNote:'In this preview, your answers stay in this tab.',
    storeNote:'Your answers are saved on this computer. If you change an answer here, we’ll update this same assessment.'
  },
  sending:{title:'Saving your answers…'},
  error:{title:'We couldn’t tell if your answers were saved.',body:'Your answers are still here. Tap “Try again” to send the same answers.'},
  platinum:{
    group:'Your Platinum Fast Start Call', title:'Book your Fast Start Call.',
    saved:'Platinum · Assessment saved',
    intro:'Talk with your Recovery Guide about your goal. In 15 minutes, you’ll choose what to focus on first and where to start in Thriver Companion.',
    calendarTitle:'Choose a time for your Fast Start Call with your Recovery Guide',
    stories:'Member stories', snapshot:'My assessment snapshot', back:'Back to the calendar',
    prepTitle:'What helped on coaching calls?',
    prepIntro:'Louis and Sara share what helped on their one-to-one coaching calls.',
    voices:[
      {name:'Louis',context:'On having someone to ask',quote:'And having the one-on-one calls, those were very helpful.',url:'https://www.youtube.com/watch?v=9zU3cAjlfX8'},
      {name:'Sara',context:'On finding a tool to use',quote:'she gave me some really specific tools',url:'https://www.youtube.com/watch?v=orm8nzAqXDM'}
    ],
    tour:'About my Fast Start Call', tourTitle:'What happens on your Fast Start Call?',
    tourIntro:'Your Recovery Guide is your Platinum client coordinator. Here’s what you’ll do together.',
    tourSteps:['Talk through the goal you shared.','Pick a first step and find a tool for it in Thriver Companion.','Find out where to ask for help.']
  },
  result:{
    preview:'Assessment preview',saved:'Assessment saved',title:'Your nervous system snapshot.',
    note:'Here’s what you told us about your day, what takes effort, and the support you want.',
    phase:'Your starting point', heading:'One step for today.', focus:'Your focus', capacity:'Your day right now',
    goal:'What you’d love more room for', specificGoal:'Your goal in your own words', help:'What you’d like help with', hints:'Look at your answers',
    screen:'Screen time over 60 minutes', walk:'Walking outside over 30 minutes', emotional:'Feeling calm again',
    rating:'{value} of 5', pattern:'When symptoms build',
    topics:['When to pull back','Making room to adjust','Understanding your nervous system','Knowing what feels manageable today'],
    topic:'Your first learning topic', actions:[
      'Think of one task you could leave for later today.',
      'Choose one thing that can wait if your plans need to change.',
      'Think of one time you felt more settled today. It can be as small as a quiet moment.',
      'Think of a task you felt okay after. Bring it up when you talk about doing more.'
    ],
    lens:'Think about what fits your day now. You can come back to your answers later to see what changed.',
    previewFoot:'Your assessment answers stayed in this tab.',savedFoot:'Your complete assessment is saved on this computer.',back:'Back to my snapshot'
  }
};

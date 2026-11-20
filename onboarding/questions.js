// NSHA Final Review Draft, November 10, 2026 text (October 15 title date). Original questions and option order.
const assessmentSections = [
  {
    "label": "Recovery goal",
    "kind": "assessment",
    "category": "text",
    "questions": [
      {
        "id": "personalWin",
        "title": "What is your next recovery goal?",
        "kind": "text",
        "options": [],
        "maxLength": 250
      }
    ]
  },
  {
    "label": "Physical symptoms",
    "kind": "assessment",
    "category": "symptoms",
    "domain": "physical",
    "questions": [
      {
        "id": "physicalSymptoms",
        "title": "Select the symptoms that apply to you:",
        "options": [
          "Blurry Vision",
          "Burning Sensations",
          "Cold Extremities",
          "Chronic Pain",
          "Digestive Problems (IBS)",
          "Dizziness",
          "Enlarged Lymph Nodes",
          "Fatigue",
          "Food Sensitivities",
          "Frequent Urination",
          "Headaches",
          "Heart Palpitations",
          "Hormonal Fluctuations",
          "Insomnia",
          "Irregular Menstrual Periods",
          "Joint Pain",
          "Light Sensitivity",
          "Muscle Weakness",
          "Nausea",
          "Noise Sensitivity",
          "POTS / Dysautonomia",
          "Shortness of Breath",
          "Temperature Dysregulation (feeling hot or cold easily)",
          "Tingling or Numbness",
          "Tinnitus (ringing in ears)",
          "Tremors / Internal Vibrations"
        ],
        "multi": true
      }
    ]
  },
  {
    "label": "Cognitive symptoms",
    "kind": "assessment",
    "category": "symptoms",
    "domain": "cognitive",
    "questions": [
      {
        "id": "cognitiveSymptoms",
        "title": "Select the symptoms that apply to you:",
        "options": [
          "Brain Fog",
          "Memory Problems",
          "Mood Swings",
          "Nightmares",
          "Speech Issues"
        ],
        "multi": true
      }
    ]
  },
  {
    "label": "Emotional symptoms",
    "kind": "assessment",
    "category": "symptoms",
    "domain": "emotional",
    "questions": [
      {
        "id": "emotionalSymptoms",
        "title": "Select the symptoms that apply to you:",
        "options": [
          "Feelings of Anxiety or Feeling On Edge",
          "Irritability",
          "Frustration",
          "Emotional Overwhelm",
          "Increased Sensitivity or Tearfulness",
          "Fear or Hypervigilance",
          "Emotional Numbness",
          "Depression",
          "Dissociation",
          "Mood Swings",
          "Emotional Reactivity"
        ],
        "multi": true
      }
    ]
  },
  {
    "label": "Physical capacity",
    "kind": "assessment",
    "category": "capacity",
    "domain": "physical",
    "questions": [
      {
        "id": "physicalCapacity1",
        "sourceId": 1,
        "title": "Moving around the house freely for more than 1 hour at a time. Rate from 0-5.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "physicalCapacity2",
        "sourceId": 2,
        "title": "Standing for more than 30 minutes at a time. Rate from 0-5.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "physicalCapacity3",
        "sourceId": 3,
        "title": "Doing simple chores around the house for more than 30 minutes at a time (dishes, laundry, cleaning, cooking). Rate from 0-5.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "physicalCapacity4",
        "sourceId": 4,
        "title": "Walking outside the home for more than 30 minutes at a time. Rate from 0-5.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "physicalCapacity5",
        "sourceId": 5,
        "title": "How many standing showers are you able to take per week? (if more than 5, please select 5). Rate from 0-5.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "physicalCapacity6",
        "sourceId": 6,
        "title": "Ability to drive for more than 30 minutes at a time. Rate from 0-5. If you don't drive, give your best estimate.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "physicalCapacity7",
        "sourceId": 7,
        "title": "Ability to tolerate most food. Rate from 0-5.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      }
    ],
    "scaleAnchors": [
      "0 = I cannot do this at all yet",
      "5 = I can do this nearly all of the time with ease and consistency"
    ]
  },
  {
    "label": "Cognitive capacity",
    "kind": "assessment",
    "category": "capacity",
    "domain": "cognitive",
    "questions": [
      {
        "id": "cognitiveCapacity1",
        "sourceId": 1,
        "title": "Looking at screens for more than 60 minutes at a time (phone, tv, computer). Rate from 0-5.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "cognitiveCapacity2",
        "sourceId": 2,
        "title": "Holding conversations in person for more than 60 minutes at a time. Rate from 0-5.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "cognitiveCapacity3",
        "sourceId": 3,
        "title": "Holding conversations over the phone for more than 60 minutes at a time. Rate from 0-5.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "cognitiveCapacity4",
        "sourceId": 4,
        "title": "Thinking about your mental to-do list (appointments, things to do). Rate from 0-5.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "cognitiveCapacity5",
        "sourceId": 5,
        "title": "Reading for more than 30 minutes at a time. Rate from 0-5.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "cognitiveCapacity6",
        "sourceId": 6,
        "title": "Writing/typing clear, concise sentences. Rate from 0-5.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "cognitiveCapacity7",
        "sourceId": 7,
        "title": "Remembering things you've seen/heard over the past 2 weeks and recalling that information without issues. Rate from 0-5.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      }
    ],
    "scaleAnchors": [
      "0 = I cannot do this at all yet",
      "5 = I can do this nearly all of the time with ease and consistency"
    ]
  },
  {
    "label": "Emotional capacity",
    "kind": "assessment",
    "category": "capacity",
    "domain": "emotional",
    "questions": [
      {
        "id": "emotionalCapacity1",
        "sourceId": 1,
        "title": "When difficult emotions come up, I can feel them without becoming consumed by them.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "emotionalCapacity2",
        "sourceId": 2,
        "title": "When symptoms increase, I can stay calm and avoid spiraling into fear, panic, or excessive symptom monitoring.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "emotionalCapacity3",
        "sourceId": 3,
        "title": "When plans change, uncertainty comes up, or life throws me a curveball, I can adapt without becoming highly distressed.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "emotionalCapacity4",
        "sourceId": 4,
        "title": "I can rest, slow down, or change course without intense guilt, urgency, or self-criticism.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "emotionalCapacity5",
        "sourceId": 5,
        "title": "When my nervous system feels activated, I can return to a more grounded and regulated state more quickly.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "emotionalCapacity6",
        "sourceId": 6,
        "title": "I can notice what I'm feeling and express it rather than suppressing it, avoiding it, or pushing through it.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "emotionalCapacity7",
        "sourceId": 7,
        "title": "I can experience uncertainty in recovery without needing constant reassurance, answers, or control.",
        "options": [
          "0",
          "1",
          "2",
          "3",
          "4",
          "5"
        ],
        "optionValues": [
          0,
          1,
          2,
          3,
          4,
          5
        ]
      }
    ],
    "scaleAnchors": [
      "0 = I cannot do this at all yet",
      "5 = I can do this nearly all of the time with ease and consistency"
    ]
  },
  {
    "label": "Overall capacity",
    "kind": "assessment",
    "category": "overall",
    "questions": [
      {
        "id": "activityLevel",
        "title": "Please select which situation fits best.",
        "options": [
          "Bedbound: Unable, or mostly unable, to get out of bed. Basic activities like eating, sitting up, or using the bathroom require intentional planning and pacing.",
          "Couch-Bound: Able to get out of bed and sit in other areas of the home such as a couch or chair. Daily activities require intentional planning and pacing.",
          "House Bound / Low Functional: Able to move around the house and manage some daily activities independently, but leaving the home is limited and requires significant planning and effort.",
          "Moderately Functional: Able to leave the house for short outings several times per week, but time and activity outside the home are limited.",
          "Functional: Able to work or volunteer, study, socialize, travel, exercise, and participate in most everyday activities, with symptoms and limitations present.",
          "Thriving: Living life with high capacity, no longer experiencing chronic symptoms."
        ],
        "optionValues": [
          1,
          2,
          3,
          4,
          5,
          6
        ]
      }
    ]
  },
  {
    "label": "Physical polarity",
    "kind": "assessment",
    "category": "polarity",
    "domain": "physical",
    "questions": [
      {
        "id": "physicalPattern1",
        "sourceId": 1,
        "title": "On days when you feel better, what is your activity level?",
        "options": [
          "Do almost nothing. I significantly limit or avoid activity.",
          "Do a little. I engage in some activity, but still hold back quite a bit.",
          "Maintain a balanced level. I do a manageable amount without overly limiting myself.",
          "Do quite a lot. I increase my activity noticeably and try to get more done.",
          "Do everything I can. I take advantage of feeling good by doing as much as possible."
        ],
        "optionValues": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "physicalPattern2",
        "sourceId": 2,
        "title": "On days when you feel worse, what is your activity level?",
        "options": [
          "Stop everything and rest. I avoid all activity and rest.",
          "Do very little. I significantly reduce my activity and spend much more time resting.",
          "Maintain a balanced level. I do a manageable amount without overly limiting myself.",
          "Keep doing quite a lot. I reduce my activity somewhat, but still tend to push myself.",
          "Push through and do everything I can. I try to keep going despite feeling worse."
        ],
        "optionValues": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "physicalPattern3",
        "sourceId": 3,
        "title": "When do you tend to pull back due to symptoms?",
        "options": [
          "I pull back even when I don't have symptoms.",
          "I pull back at the very first sign of symptoms.",
          "I pull back when symptoms become mildly uncomfortable.",
          "I pull back when symptoms start to become unmanageable.",
          "I pull back only when symptoms are completely overwhelming."
        ],
        "optionValues": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "physicalPattern4",
        "sourceId": 4,
        "title": "When your symptoms flare or worsen, what do you typically do?",
        "options": [
          "I rest completely. I stop everything and wait until I feel totally symptom-free.",
          "I tend to rest. I usually wait until I feel noticeably better before doing more.",
          "I try to find a middle ground. I rest when symptoms are moderate and expand when they ease a little.",
          "I push through most of the time. I usually keep going unless symptoms are quite severe.",
          "I push through. I keep going even when symptoms are strong."
        ],
        "optionValues": [
          1,
          2,
          3,
          4,
          5
        ]
      }
    ]
  },
  {
    "label": "Cognitive polarity",
    "kind": "assessment",
    "category": "polarity",
    "domain": "cognitive",
    "questions": [
      {
        "id": "cognitivePattern1",
        "sourceId": 1,
        "title": "How do you tend to make decisions?",
        "options": [
          "I make quick, impulsive decisions without considering the outcome.",
          "I tend to decide fast and rarely revisit things afterward.",
          "I pause enough to consider what matters, without getting stuck in analysis.",
          "I often turn things over and take a while to settle.",
          "I constantly overthink and have difficulty letting things go."
        ],
        "optionValues": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "cognitivePattern2",
        "sourceId": 2,
        "title": "How often do you feel stuck in your thoughts and unable to act?",
        "options": [
          "I act very quickly, often without thinking things through.",
          "I tend to act quickly and may not give things enough thought.",
          "I don't feel stuck in my thoughts; I usually pause, think things through, and then act.",
          "I tend to overthink and have difficulty acting.",
          "I often feel completely stuck in my thoughts and unable to act."
        ],
        "optionValues": [
          1,
          2,
          3,
          4,
          5
        ]
      }
    ]
  },
  {
    "label": "Emotional polarity",
    "kind": "assessment",
    "category": "polarity",
    "domain": "emotional",
    "questions": [
      {
        "id": "emotionalPattern1",
        "sourceId": 1,
        "title": "Which of the following best reflects how you experience your emotions?",
        "options": [
          "My emotions always feel flat or absent regardless of the situation.",
          "My emotions often feel more muted than the situation calls for.",
          "My emotions usually feel proportionate to what's happening.",
          "My emotions often feel stronger than the situation calls for.",
          "My emotions always feel so intense they're overwhelming and hard to settle."
        ],
        "optionValues": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "emotionalPattern2",
        "sourceId": 2,
        "title": "Which best describes how you typically express your emotions outwardly?",
        "options": [
          "I tend to shut down, feel numb or disconnected, or suppress what I am feeling.",
          "I often hold emotions in and have difficulty accessing or expressing them.",
          "I can usually feel and express emotions in a grounded, proportionate way.",
          "My emotions often feel intense, reactive, or difficult to contain.",
          "My emotions frequently feel overwhelming and are expressed in ways that others may experience as highly reactive or disproportionate."
        ],
        "optionValues": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "emotionalPattern3",
        "sourceId": 3,
        "title": "When difficult emotions come up like fear, frustration, sadness, or overwhelm, what usually happens?",
        "options": [
          "I barely register them; I push straight through.",
          "I tend to move past them quickly without giving them much attention.",
          "I feel them fully, and they pass.",
          "They linger longer than I'd like and color most of my day.",
          "They take over, and I can't function for the rest of the day."
        ],
        "optionValues": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "id": "emotionalPattern4",
        "sourceId": 4,
        "title": "When unexpected changes, setbacks, or \"curveballs\" happen, how would you best describe your typical emotional response?",
        "options": [
          "I'm largely unaffected; I move straight on without it registering much.",
          "I adapt quickly, though I tend not to dwell on how the setback landed.",
          "I stay grounded and flexible even when things don't go as planned.",
          "Unexpected situations often throw me off and can affect my mood or behavior for a long time.",
          "I become highly overwhelmed or destabilized and have a hard time adjusting at all."
        ],
        "optionValues": [
          1,
          2,
          3,
          4,
          5
        ]
      }
    ]
  },
  {
    "label": "Recovery help",
    "kind": "assessment",
    "category": "text",
    "questions": [
      {
        "id": "helpInRecovery",
        "title": "What's the one area where you currently need the most help and support in your recovery? (Please keep response to 1-2 sentences)",
        "kind": "text",
        "options": [],
        "maxLength": 250
      }
    ]
  },
  {
    "label": "Goal preference",
    "kind": "preference",
    "category": "choice",
    "questions": [
      {
        "id": "goalChoice",
        "title": "What would you love to have more room for?",
        "options": [
          "Getting back to work",
          "Getting fit, active, and exercising",
          "Traveling and adventuring",
          "Enjoying quality time with loved ones"
        ]
      }
    ]
  },
  {
    "label": "Focus preference",
    "kind": "preference",
    "category": "choice",
    "questions": [
      {
        "id": "focusChoice",
        "title": "What would you like a hand with today?",
        "options": [
          "Knowing when to pull back",
          "Reducing flare-ups",
          "Understanding recovery",
          "Knowing when to increase activity"
        ]
      }
    ]
  }
];

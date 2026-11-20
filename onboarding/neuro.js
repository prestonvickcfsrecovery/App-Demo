const companionSprites = {
  "celebrate": "assets/neuro/celebrate.png",
  "connect": "assets/neuro/connect.png",
  "guide": "assets/neuro/guide.png",
  "learn": "assets/neuro/learn.png",
  "listen": "assets/neuro/listen.png",
  "notice": "assets/neuro/notice.png",
  "pace": "assets/neuro/pace.png",
  "ready": "assets/neuro/ready.png",
  "reflect": "assets/neuro/reflect.png",
  "welcome": "assets/neuro/welcome.png"
};
const NSHA_SURVEY_VERSION = "NSHA v1 · preview";

// Choose a gesture that matches what the member is doing on this screen.
const neuroPoses = {
  'opening-community': 'celebrate',
  arrival: 'guide',
  focusChoice: 'listen',
  difficulty: 'notice',
  'catch-up': 'listen',
  'nervous-system': 'connect',
  'daily-effort': 'pace',
  'physical-progress': 'ready',
  'stress-threshold': 'notice',
  'stress-load': 'reflect',
  'mental-energy': 'guide',
  'cognitive-progress': 'celebrate',
  'delayed-symptoms': 'reflect',
  'adjustment-period': 'pace',
  'adjustment-respond': 'learn',
  'adjustment-research': 'reflect',
  'emotional-context': 'listen',
  'feelings-context': 'ready',
  'alarm-response': 'connect',
  'fight-or-flight': 'notice',
  'freeze-response': 'listen',
  'stress-and-symptoms': 'reflect',
  'after-surprise': 'pace',
  'platinum-home': 'guide'
};

function companion(defaultPose = 'welcome') {
  const pose = neuroPoses[stage] || defaultPose;
  const picture = document.createElement('img');
  picture.className = 'companion';
  picture.dataset.pose = pose;
  picture.width = 464;
  picture.height = 464;
  picture.alt = '';
  picture.src = companionSprites[pose];
  return picture;
}

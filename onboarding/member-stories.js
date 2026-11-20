// Excerpts are exact. The team source ledger records each originating Supabase row.
const schoolRunWin = {name: "Kathi", startingPoint: "Spent most days in bed for years", quote: "I drove my son to school for the very first time ever. I just did it!"};
const goalProofPages = {
  "Getting back to work": {
    title: "Back at work",
    body: "Five members share what going back to work looked like for them.",
    voices: [
      {name: "Magdalena", startingPoint: "Had to stop working", quote: "My first day back at work as a nurse is officially behind me!"},
      {name: "Luke", startingPoint: "Could barely use the screen", quote: "Now I'm working part-time, going downstairs and outside regularly, and super chatty!"},
      {name: "Elodie", startingPoint: "Had been away from the office for months", quote: "Made it into the office yesterday for the 1st time"},
      {name: "Natalija", startingPoint: "Could leave home only for urgent doctor visits", quote: "I work part-time again, travel to client meetings, went on a small vacation and so much more!"},
      assessmentCopy.story.members.nicole
    ]
  },
  "Getting fit, active, and exercising": {
    title: "Moving again",
    body: "Five members share how they got back to activities they love.",
    voices: [
      {name: "Janette", startingPoint: "Was couchbound", quote: "I ran my first 5K since before getting CFS! I honestly thought my running days were over for good."},
      {name: "Vera", startingPoint: "Had stopped hiking when she got sick", quote: "This weekend I went hiking for the first time since I got sick."},
      {name: "Amy", startingPoint: "Had gone five years without playing basketball", quote: "Yesterday was my first day back at the hoop."},
      {name: "Dominique", startingPoint: "Just getting to the gym used to be her limit", quote: "Today I climbed 5 routes!"},
      assessmentCopy.story.members.annette
    ]
  },
  "Traveling and adventuring": {
    title: "Out in the world again",
    body: "Five members share a trip they got to take.",
    voices: [
      {name: "Dana", startingPoint: "Was housebound when she joined", quote: "Yes, I made it to Thailand! In the past few weeks, I’ve been traveling in Thailand with my family."},
      {name: "Gabbi", startingPoint: "Could sit up for only five minutes", quote: "I reached one of my biggest north stars which was to travel to the ocean."},
      {name: "Jon", startingPoint: "Was housebound the summer before", quote: "I went to Crete in Greece with my girlfriend and it was pure bliss."},
      {name: "Marco", startingPoint: "Spent about three months in bed or on the couch", quote: "I spent the first two weeks in Cape Town, followed by another breathtaking road trip across the country with my wife."},
      assessmentCopy.story.members.tomoyuki
    ]
  },
  "Enjoying quality time with loved ones": {
    title: "Time with the people you love",
    body: "Five members share moments they got to spend with family.",
    voices: [
      schoolRunWin,
      {name: "Chelsea", startingPoint: "Had stopped playing sports when she got sick", quote: "I went bowling tonight with my family for an hour!"},
      {name: "Lolan", startingPoint: "Was bedbound the year before", quote: "me, my sister and our mother made a one day beach trip"},
      {name: "Tasha", startingPoint: "Had missed two years of trick-or-treating", quote: "Last night was the first time I have been able to trick or treat with my kids in 2 years!"},
      assessmentCopy.story.members.david
    ]
  }
};

const recoveryPlanProof = {
  title: "When the next step felt clear",
  body: "These members share what helped them find their way.",
  voices: [
      {name: "Ruth", startingPoint: "Didn’t know what to aim for", quote: "Now I have a plan to structure my weeks to help me “train” towards these goals."},
      {name: "Nancy", startingPoint: "Kept ending up back in bed after doing too much", quote: "And it all started to make sense."},
      {name: "Vilma", startingPoint: "Used to feel scared when symptoms came back", quote: "But thanks to this amazing program, now I understand, I recognize it, and I know what to do."}
  ]
};

function memberQuoteList(voices) {
  const list = node('ul', 'member-stories');
  for (const voice of voices) {
    const item = node('li');
    item.style.setProperty('--quote-delay',(list.children.length * 380) + 'ms');
    const figure = node('figure', 'story-testimony');
    const quote = node('blockquote', 'story-quote', voice.quote);
    const caption = node('figcaption', 'story-attribution');
    caption.append(node('span', 'story-name', voice.name));
    if (voice.startingPoint) {
      caption.append(node('span', 'story-start', ' · ' + voice.startingPoint));
    }
    figure.append(quote, caption);
    item.append(figure);
    list.append(item);
  }
  return list;
}

function displayProofPage(content) {
  heading(content.title, content.body);
  page.append(memberQuoteList(content.voices));
}

function displayGoalTransformationQuotes(goal) {
  const storyPage = Object.hasOwn(goalProofPages, goal) ? goalProofPages[goal] : undefined;
  if (storyPage) {
    displayProofPage(storyPage);
    return;
  }
  // A reviewer can jump directly here before choosing a goal.
  displayProofPage({
    title: 'What members got back to',
    body: 'Members share a moment that mattered to them.',
    voices: Object.values(goalProofPages).map(story => story.voices[0])
  });
}

function displayRecoveryPlanQuotes() {
  displayProofPage(recoveryPlanProof);
}

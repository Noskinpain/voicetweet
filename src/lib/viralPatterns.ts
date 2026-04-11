export interface ViralPattern {
  name: string
  category: string
  structure: string
  hookFormula: string
  example: string
  powerWords: string[]
}

export const VIRAL_PATTERNS: ViralPattern[] = [
  {
    name: 'The Uncomfortable Truth',
    category: 'truth',
    structure: 'State what nobody says → explain why → land the point',
    hookFormula: 'Nobody talks about [X] but it is destroying [Y]',
    example: 'Nobody talks about how loneliness is the actual reason most people overwork. Not ambition. Loneliness.',
    powerWords: ['nobody', 'destroying', 'actual', 'real reason', 'truth is'],
  },
  {
    name: 'The Sharp Hot Take',
    category: 'opinion',
    structure: 'Bold claim → one sentence proof → mic drop',
    hookFormula: '[Mainstream belief] is actually [opposite]. Here is why.',
    example: 'Working hard is overrated. Working on the right thing is everything. Most people mix these up their whole life.',
    powerWords: ['overrated', 'actually', 'most people', 'whole life', 'everything'],
  },
  {
    name: 'The Story Arc',
    category: 'story',
    structure: 'I was [struggling] → moment of change → I now [result]',
    hookFormula: 'X years ago I [pain point]. Today [transformation].',
    example: '2 years ago I was broke and embarrassed to tell people what I did. Today I turned down a 6 figure salary. Same skills. Different belief.',
    powerWords: ['broke', 'embarrassed', 'turned down', 'same', 'different'],
  },
  {
    name: 'The Pattern Interrupt',
    category: 'attention',
    structure: 'Say something unexpected → pause → reframe everything',
    hookFormula: 'Stop [common advice]. Do [unexpected thing] instead.',
    example: 'Stop networking. Start making things people talk about. Nobody remembers the person who handed them a business card.',
    powerWords: ['stop', 'nobody remembers', 'instead', 'actually'],
  },
  {
    name: 'The Contrast',
    category: 'insight',
    structure: 'Short sentence. Short sentence. LONG payoff sentence.',
    hookFormula: '[What people think]. [What is real]. [Why it matters].',
    example: 'People want followers. They should want trust. Because trust is the only thing that actually converts.',
    powerWords: ['should', 'only thing', 'actually', 'converts'],
  },
  {
    name: 'The Numbered Insight',
    category: 'value',
    structure: 'Hook number → punchy insights → each one earns the next',
    hookFormula: '[Number] things I wish I knew before [experience]:',
    example: '5 things I wish I knew before my first startup failed:',
    powerWords: ['wish I knew', 'before', 'failed', 'nobody tells you'],
  },
  {
    name: 'The Open Loop',
    category: 'curiosity',
    structure: 'Create mystery → withhold the answer → deliver with weight',
    hookFormula: 'I found out something about [topic] that changed how I see everything.',
    example: 'I found out why truly confident people never argue online. And once you see it you cannot unsee it.',
    powerWords: ['cannot unsee', 'changed how', 'once you see', 'truly'],
  },
  {
    name: 'The Warning',
    category: 'urgency',
    structure: 'Identify the trap → explain who falls in it → give the exit',
    hookFormula: 'If you are doing [X] you are going to [bad outcome].',
    example: 'If you are still waiting to feel ready you are going to wait forever. Readiness is not a feeling. It is a decision.',
    powerWords: ['still waiting', 'forever', 'decision', 'trap'],
  },
  {
    name: 'The Vulnerable Truth',
    category: 'connection',
    structure: 'Admit the real thing → no sugarcoating → universal truth',
    hookFormula: 'I am going to be honest. [Raw admission].',
    example: 'I am going to be honest. Some days I have no idea what I am doing. I just keep moving because stopping feels worse.',
    powerWords: ['honest', 'no idea', 'keep moving', 'real talk'],
  },
  {
    name: 'The Rhythm Drop',
    category: 'style',
    structure: 'Short. Sharp. Punchy. Then one long sentence that lands the whole thing with weight.',
    hookFormula: 'One word. One word. One phrase. Full thought.',
    example: 'Less noise. More action. Stop announcing your plans. The results will do the talking.',
    powerWords: ['less', 'more', 'stop', 'results'],
  },
]

export const THREAD_STRUCTURES = [
  {
    name: 'The Revelation Thread',
    hooks: [
      'I spent [time] studying [topic]. Here is what nobody tells you (thread):',
      'The real reason [common thing] does not work — and what actually does (thread):',
      '[Number] things that changed how I think about [topic] forever:',
    ],
    structure: [
      'Tweet 1: Hook — bold promise, creates strong open loop',
      'Tweet 2: The problem — agitate the pain everyone feels',
      'Tweet 3-6: The insights — each one punchy, each one earns the next',
      'Tweet 7: The twist — one thing that reframes everything',
      'Tweet 8: CTA — follow for more, share if this hit',
    ],
  },
  {
    name: 'The Story Thread',
    hooks: [
      'In [year] I [failed/struggled/lost]. Here is the full story (thread):',
      'How I went from [bad place] to [good place] in [time]:',
      'The day everything changed for me:',
    ],
    structure: [
      'Tweet 1: Hook — the most dramatic moment of the story',
      'Tweet 2: Set the scene — where you were before',
      'Tweet 3-5: The journey — what happened, what you tried',
      'Tweet 6: The turning point — the exact moment things changed',
      'Tweet 7: The result — where you are now',
      'Tweet 8: The lesson — one clean takeaway',
    ],
  },
  {
    name: 'The How-To Thread',
    hooks: [
      'How to [desirable outcome] without [common sacrifice]:',
      'The exact process I use to [outcome] every single time:',
      'Step by step: how to [achieve thing] starting today:',
    ],
    structure: [
      'Tweet 1: Hook — the outcome + who this is for',
      'Tweet 2: Why most people fail at this',
      'Tweet 3-7: The actual steps — numbered, clear, actionable',
      'Tweet 8: The shortcut or secret most skip',
      'Tweet 9: CTA — save this, share it',
    ],
  },
]

export const POWER_WORDS = {
  attention: ['nobody', 'stop', 'warning', 'finally', 'truth', 'secret', 'real', 'actual'],
  emotion: ['broke', 'embarrassed', 'terrified', 'obsessed', 'exhausted', 'proud', 'ashamed'],
  contrast: ['instead', 'actually', 'but', 'however', 'yet', 'while', 'although'],
  urgency: ['now', 'today', 'immediately', 'before', 'still', 'already', 'yet'],
  social: ['everyone', 'nobody', 'most people', 'they', 'the ones who', 'people who'],
}
export type GameMode =
  | "binary" // two-choice (e.g. Green/Red, Agree/Disagree, Yes/No, This/That)
  | "open"   // both players write/answer freely, reveal together
  | "rank"   // rank a list
  | "pick"   // pick one from many
  | "dare";  // truth or dare style

export interface GameCategory {
  id: string;
  title: string;
  tagline: string;
  blurb: string;
  emoji: string;
  image?: string;
  spicy?: boolean;
  mode: GameMode;
  choices?: [string, string]; // for binary
  options?: string[];          // for pick/rank questions when same across
  questions: string[];
  // For pick/rank, each question can have its own options:
  questionOptions?: string[][];
}

const greenFlag: GameCategory = {
  id: "green-red",
  title: "Green Flag or Red Flag",
  tagline: "Spot the signal.",
  blurb: "Behaviours, habits, opinions — call them as you see them.",
  emoji: "❤",
  mode: "binary",
  choices: ["Green Flag", "Red Flag"],
  questions: [
    "They keep a private journal but won't tell you what's in it.",
    "They text their ex on their birthday — every year.",
    "They split every bill down to the cent, including coffee.",
    "They tell their best friend everything you say in arguments.",
    "They never post you on social media but talk about you constantly.",
    "They keep gifts from past relationships in a drawer.",
    "They schedule a weekly 'state of us' conversation.",
    "They lie to their parents to protect your relationship.",
    "They cry watching movies but never in real life.",
    "They pick fights when they're stressed, then apologize with breakfast.",
    "They keep their location on for you at all times.",
    "They have a folder of screenshots of your sweet messages.",
    "They refuse to argue past 10pm — no matter what.",
    "They mute notifications when you're together.",
    "They keep one toxic friend around 'for nostalgia'.",
  ],
};

const testingBoundaries: GameCategory = {
  id: "testing-boundaries",
  title: "Testing Boundaries",
  tagline: "Where is the line?",
  blurb: "Tender, tricky situations about friendships, attention, and emotional closeness.",
  emoji: "Boundary",
  mode: "binary",
  choices: ["Not okay", "Okay"],
  questions: [
    "Your partner still receives affectionate words like \“I love you\” or \“I care about you.\” from someone who has or had feelings for them.",
    "Your partner uses red heart emojis with friends of the opposite sex.",
    "Your partner comforts someone who has or had feelings for them.",
    "Your partner keeps talking to someone they know has or had romantic feelings for them.",
    "Your partner has someone outside the relationship who liked them saying things like\"I care about you.\"",
    "Your partner hides a friendship because they think you'll be upset.",
    "Your partner takes pictures with someone who likes them.",
    "Your partner stays close with someone they used to have romantic tension with.",
    "Your partner accepts \"I love you\" from someone else but doesn't say it back.",
    "Your partner still shows little sign of affection toward someone who has or had feelings for them.",
    "Your partner lets someone who likes them stay emotionally close.",
    "Your partner says \"they're just a friend\" about someone who wants more than friendship.",
    "Your partner talks daily with someone who has or had feelings for them.",
    "Your partner keeps a friendship that makes their partner uncomfortable.",
    "Your partner reconnects with someone who once had feelings for them.",
    "Your partner has a \“best friend\” they tell things to before telling you.",
    "Your partner shares personal problems with someone else because “they understand me better.",
    "Your partner compliments someone else’s appearance in a way that feels flirty.",
    "Your partner compliments someone else’s appearance in a way that feels flirty.",
    "Your partner secretly checks up on their ex’s social media but says it means nothing.",
    "Your partner spends a lot of time with someone who clearly wants to be more than friends.",
    "Your partner says “you’re the only one who understands me” to someone outside the relationship.",
    "Your partner compares you to someone they used to like or date."
  ],
};

const isItCheating: GameCategory = {
  id: "is-it-cheating",
  title: "Is It Cheating If…",
  tagline: "Define your lines.",
  blurb: "Where do you draw it — and does your partner draw it there too?",
  emoji: "🤔",
  mode: "binary",
  choices: ["Cheating", "Not Cheating"],
  questions: [
    "You like an ex's photo from three years ago.",
    "You have a recurring dream about someone and never tell.",
    "You text a coworker after midnight about non-work things.",
    "You go to dinner alone with someone who clearly likes you.",
    "You keep flirty messages because they're 'just a confidence boost'.",
    "You meet up with an ex 'for closure' without saying so.",
    "You delete a conversation before your partner sees it.",
    "You share inside jokes with someone you're attracted to.",
    "You fantasize about a friend and never act on it.",
    "You vent about your relationship to someone who's into you.",
    "You wear something specifically because they'll be there.",
    "You match with someone on a dating app 'by accident' and don't unmatch.",
    "You hide a friendship because your partner 'wouldn't get it'.",
  ],
};

const mostLikelyTo: GameCategory = {
  id: "most-likely",
  title: "Who's Most Likely To?",
  tagline: "Point fingers, gently.",
  blurb: "Pick the guilty one. No mercy.",
  emoji: "😂",
  mode: "binary",
  choices: ["You", "Me"],
  questions: [
    "Start a fight over how the dishwasher is loaded.",
    "Cry first during our wedding vows.",
    "Survive a zombie apocalypse using charm alone.",
    "Get arrested on vacation — and laugh about it.",
    "Fake an injury to skip something they don't want to do.",
    "Become famous on the internet for something embarrassing.",
    "Spend the rent on something completely unnecessary.",
    "Forget our anniversary and somehow make it romantic anyway.",
    "Lose their phone within an hour at a music festival.",
    "Start a business idea at 2am and never finish it.",
    "Befriend the cat before the host.",
    "Pretend to read a book they never opened.",
    "Drunk-text their boss something poetic.",
  ],
};

const agreeDisagree: GameCategory = {
  id: "agree-disagree",
  title: "Agree or Disagree",
  tagline: "Take a stance.",
  blurb: "Strong opinions, kindly held.",
  emoji: "⚖",
  mode: "binary",
  choices: ["Agree", "Disagree"],
  questions: [
    "Being friends with your ex is always a quiet form of disrespect.",
    "Couples who never argue are hiding something.",
    "Love is a decision you make every morning, not a feeling.",
    "You should never go to bed angry — even if it takes till dawn.",
    "Phones should be off the table during every meal together.",
    "Jealousy, in small doses, is proof you still care.",
    "A relationship without occasional boredom isn't real.",
    "You shouldn't have to ask for the things you need.",
    "Apologies without changed behaviour are manipulation.",
    "Long-distance reveals what proximity hides.",
    "Marriage should be re-signed every five years like a lease.",
  ],
};

const thisOrThat: GameCategory = {
  id: "this-or-that",
  title: "This or That",
  tagline: "Two roads. Pick one.",
  blurb: "No 'both'. No 'depends'. Choose.",
  emoji: "💭",
  mode: "binary",
  choices: ["Left", "Right"],
  questions: [
    "Quiet Sunday at home || Spontaneous road trip at midnight",
    "Know all my secrets || Keep yours forever",
    "A handwritten letter || A perfect playlist",
    "Loud honesty || Gentle silence",
    "Forehead kisses || Long hugs",
    "Adventure together || Build a quiet life together",
    "Be deeply understood || Be intensely desired",
    "Apologize first always || Be apologized to first always",
    "Read each other's minds || Read each other's diaries",
    "A house full of friends || A house just for us",
  ],
};

const pickOne: GameCategory = {
  id: "pick-one",
  title: "Pick One",
  tagline: "One choice. No hedging.",
  blurb: "Tap the answer that's truest, even if it stings.",
  emoji: "🎯",
  mode: "pick",
  questions: [
    "The hardest thing about loving me is…",
    "If I had to change one thing about how we fight, it would be…",
    "What I miss most from the early days of us…",
    "The version of you I love most is…",
    "If we had one rule we never broke, it would be…",
  ],
  questionOptions: [
    ["My silence", "My stubbornness", "My moods", "My loyalty to others"],
    ["Slow down sooner", "Say sorry faster", "Stop bringing up the past", "Touch first, talk second"],
    ["The nervousness", "The endless questions", "The newness of every kiss", "The way time disappeared"],
    ["Tired you, on the couch", "Wild you, at 1am", "Quiet you, in the morning", "Brave you, in public"],
    ["No phones in bed", "No leaving angry", "No comparing us to anyone", "No secrets larger than a smile"],
  ],
};

const rankThese: GameCategory = {
  id: "rank-these",
  title: "Rank These",
  tagline: "Order is everything.",
  blurb: "Drag your priorities. Then defend them.",
  emoji: "🏆",
  mode: "rank",
  questions: [
    "Rank what matters most in love",
    "Rank the qualities you want in a partner",
    "Rank what you fear losing most",
    "Rank what makes a home feel like home",
  ],
  questionOptions: [
    ["Loyalty", "Passion", "Laughter", "Stability"],
    ["Patience", "Ambition", "Honesty", "Humour"],
    ["Trust", "Time", "Touch", "Talk"],
    ["The people", "The smell", "The light", "The silence"],
  ],
};

const yesNo: GameCategory = {
  id: "yes-no",
  title: "Yes or No",
  tagline: "Simple. Brutal. Clear.",
  blurb: "No 'maybe'. No 'kind of'. Yes — or no.",
  emoji: "🙋",
  mode: "binary",
  choices: ["Yes", "No"],
  questions: [
    "Would you move to another country for me within a year?",
    "Have you ever wished, even for a second, that we hadn't met?",
    "Would you tell me if you stopped finding me attractive?",
    "Could you forgive me for something I haven't done yet?",
    "Would you want to know if I had doubts about us?",
    "Have you ever lied to protect my feelings?",
    "Would you go to therapy with me if I asked tonight?",
    "Do you secretly want a bigger wedding than we've talked about?",
    "Would you let me read every message on your phone right now?",
  ],
};

const hiddenSide: GameCategory = {
  id: "hidden-side",
  title: "My Hidden Side",
  tagline: "The parts you don't show.",
  blurb: "Write the truth. Reveal together.",
  emoji: "🎭",
  mode: "open",
  questions: [
    "One thing about me you'd be surprised I think about often…",
    "A version of myself I keep hidden from you…",
    "The compliment I secretly long to hear from you…",
    "Something I pretend not to care about, but do…",
    "An ambition I haven't told you yet…",
    "A fear I've been carrying quietly…",
    "A memory I replay more than I should…",
  ],
};

const whatWouldHurt: GameCategory = {
  id: "what-would-hurt",
  title: "What Would Hurt More",
  tagline: "Two wounds. Choose one.",
  blurb: "Hypotheticals that aren't really hypothetical.",
  emoji: "💔",
  mode: "binary",
  choices: ["The first", "The second"],
  questions: [
    "I forgot your birthday || I forgot our anniversary",
    "I told my friends our secrets || I kept a secret from you for a year",
    "I cancelled our trip last minute || I went on the trip without you",
    "I chose work over you once || I chose family over you once",
    "I flirted while drunk || I flirted while sober and stopped",
    "I cried about an ex || I laughed about us with an ex",
  ],
};

const princessTreatment: GameCategory = {
  id: "princess-treatment",
  title: "Princess Treatment",
  tagline: "How would you spoil me?",
  blurb: "Open answers. The softer the better.",
  emoji: "👑",
  mode: "open",
  questions: [
    "Describe my perfect Sunday from sunrise to sunset.",
    "What would you do for me without me ever asking?",
    "Plan a 24-hour surprise — no budget, no rules.",
    "What's the smallest detail you'd remember about me forever?",
    "How would you make me feel chosen on an ordinary Tuesday?",
  ],
};

const whatYouThink: GameCategory = {
  id: "what-you-think",
  title: "What You Think of Me",
  tagline: "Say it out loud.",
  blurb: "Compliments, observations, gentle truths.",
  emoji: "💬",
  mode: "open",
  questions: [
    "The first word that comes to mind when you see me.",
    "Something I do that you find unexpectedly attractive.",
    "A way I've changed since we met — for the better.",
    "Something you'd never want me to lose.",
    "A thing I do that quietly makes you proud.",
  ],
};

const beforeTheRing: GameCategory = {
  id: "before-the-ring",
  title: "Before the Ring",
  tagline: "Big questions, before the big day.",
  blurb: "The conversations every couple postpones.",
  emoji: "💍",
  mode: "open",
  questions: [
    "What's a non-negotiable for you in a marriage?",
    "How would we handle a year of real hardship together?",
    "What does loyalty mean to you, beyond fidelity?",
    "What role should our families play in our decisions?",
    "What's one thing you'd never want us to compromise on?",
    "How do you want us to argue ten years from now?",
  ],
};

const finishSentence: GameCategory = {
  id: "finish-sentence",
  title: "Finish the Sentence",
  tagline: "Half a thought. Complete it.",
  blurb: "Write your ending. Compare.",
  emoji: "✍",
  mode: "open",
  questions: [
    "I knew I loved you the moment…",
    "What I admire most about you is…",
    "If I could relive one day with you, it would be…",
    "Sometimes I wish you'd…",
    "The thing I'll never get tired of is…",
    "If we ever drifted apart, I'd…",
  ],
};

const spicyWyr: GameCategory = {
  id: "spicy-wyr",
  title: "Spicy Would You Rather",
  tagline: "Turn the heat up.",
  blurb: "Playfully provocative. Never explicit.",
  emoji: "🌶",
  spicy: true,
  mode: "binary",
  choices: ["First", "Second"],
  questions: [
    "A slow kiss in the rain || A long whisper in the dark",
    "Be teased all day || Be held all night",
    "A handwritten love note || A look across a crowded room",
    "Dance with me in the kitchen || Disappear with me upstairs",
    "Be told you're beautiful || Be shown",
  ],
};

const spicyNhi: GameCategory = {
  id: "spicy-nhi",
  title: "Spicy Never Have I Ever",
  tagline: "Confess by elimination.",
  blurb: "Tap if you have. No judging. Maybe.",
  emoji: "🌶",
  spicy: true,
  mode: "binary",
  choices: ["I have", "I haven't"],
  questions: [
    "…thought about you during a meeting I should've been listening to.",
    "…re-read our old messages just to feel something.",
    "…lied about being busy to spend the day daydreaming about you.",
    "…rearranged my schedule for one extra hour with you.",
    "…written a message I never sent you.",
    "…kept a photo of you I never told you about.",
  ],
};

const spicyMostLikely: GameCategory = {
  id: "spicy-most-likely",
  title: "Spicy Who's Most Likely To",
  tagline: "Point the finger.",
  blurb: "We both know the answer. Tap it.",
  emoji: "🌶",
  spicy: true,
  mode: "binary",
  choices: ["You", "Me"],
  questions: [
    "Initiate when we said we'd 'just sleep'.",
    "Get caught making eyes across the dinner table.",
    "Whisper something inappropriate in public.",
    "Suggest the hotel before the vacation is even booked.",
    "Send a risky text 'by accident'.",
  ],
};

const confessions: GameCategory = {
  id: "confessions",
  title: "Confessions",
  tagline: "The truth, finally.",
  blurb: "Small admissions. Big honesty.",
  emoji: "🤫",
  mode: "open",
  questions: [
    "Something I've never told you that wouldn't even hurt to know.",
    "A small lie I've kept going for too long.",
    "Something I judged you for, then realised I was wrong.",
    "A time I almost said something and didn't.",
    "Something I do only when you're not looking.",
  ],
};

const fantasyLab: GameCategory = {
  id: "fantasy-lab",
  title: "Fantasy Lab",
  tagline: "Build the impossible us.",
  blurb: "Imagine, design, dream out loud.",
  emoji: "✨",
  mode: "open",
  questions: [
    "Design our dream home in three sentences.",
    "If money disappeared tomorrow, how would we live?",
    "Invent a tradition we'll start this year and keep forever.",
    "Pick a city, a season, and a soundtrack for our life.",
    "What does our life look like at 70 — be specific.",
  ],
};

const compatibility: GameCategory = {
  id: "compatibility",
  title: "Compatibility Test",
  tagline: "How aligned are we, really?",
  blurb: "Answer privately. Reveal together. Score yourselves.",
  emoji: "🧠",
  mode: "binary",
  choices: ["Agree", "Disagree"],
  questions: [
    "We should be able to spend a whole weekend in silence and still feel close.",
    "Friends should never know the details of our fights.",
    "Big purchases should always be a shared decision.",
    "We should keep some mystery from each other, on purpose.",
    "Loyalty matters more than passion in the long run.",
    "Date nights should be sacred — non-negotiable.",
  ],
};

const debate: GameCategory = {
  id: "debate",
  title: "Relationship Debate",
  tagline: "Argue. Kindly.",
  blurb: "Take a side. Defend it. Then swap.",
  emoji: "❤",
  mode: "binary",
  choices: ["For", "Against"],
  questions: [
    "Couples should share every password.",
    "One person should always plan the dates.",
    "Sleeping in separate beds occasionally is healthy.",
    "Phones should be banned during arguments.",
    "Going to bed angry is sometimes the right call.",
    "Saying 'I love you' loses meaning if you say it daily.",
  ],
};

const truthOrDare: GameCategory = {
  id: "truth-or-dare",
  title: "Truth or Dare",
  tagline: "Classic, refined.",
  blurb: "Pick your poison. We'll handle the rest.",
  emoji: "🎲",
  mode: "dare",
  questions: [
    "Truth: What's a compliment you wish I gave you more often?",
    "Dare: Send me the most flattering selfie in your camera roll, right now.",
    "Truth: What's a memory of us you replay before you fall asleep?",
    "Dare: Slow dance with me to the next song that plays — wherever we are.",
    "Truth: What's one thing you'd never say sober but want me to know?",
    "Dare: Kiss me like it's the last time, then like it's the first.",
    "Truth: What's the moment you knew this was different?",
  ],
};

const quickFire: GameCategory = {
  id: "quick-fire",
  title: "Quick Fire",
  tagline: "10 seconds. Don't think.",
  blurb: "Speed reveals truth.",
  emoji: "🎯",
  mode: "open",
  questions: [
    "One word for me, right now.",
    "Last thing that made you proud of us.",
    "Your favourite version of me — go.",
    "A place you'd teleport to with me, now.",
    "First song that comes to mind for us.",
    "One thing you want more of this month.",
  ],
};

const hotSeat: GameCategory = {
  id: "hot-seat",
  title: "Hot Seat",
  tagline: "All the questions. All at once.",
  blurb: "One person answers everything. Then swap.",
  emoji: "🔥",
  mode: "open",
  questions: [
    "The first time you doubted us — what did you do with that feeling?",
    "Tell me about the moment you decided to stay.",
    "What's a piece of advice about us you've ignored?",
    "If you wrote a book about our love, the opening line would be…",
    "What's a fear about us you've never said out loud?",
  ],
};

const finishStory: GameCategory = {
  id: "finish-story",
  title: "Finish My Story",
  tagline: "Co-write the ending.",
  blurb: "I start. You finish. We discover.",
  emoji: "📝",
  mode: "open",
  questions: [
    "We met again, ten years from now, in an airport. The first thing you said was…",
    "It was 3am. I texted you one word. That word was…",
    "We bought a house with one strange room. We turned it into…",
    "Our future kid asks how we fell in love. I begin: 'It was raining…' — you continue.",
  ],
};

const guessMyAnswer: GameCategory = {
  id: "guess-my-answer",
  title: "Guess My Answer",
  tagline: "Predict me.",
  blurb: "I answer in private. You guess. Points for accuracy.",
  emoji: "🕵",
  mode: "open",
  questions: [
    "My favourite memory of us from this year.",
    "The thing that makes me feel most loved.",
    "What I'd order on our last meal together.",
    "The song I'd play at our wedding's first dance.",
    "My biggest fear about us.",
  ],
};

const twoTruths: GameCategory = {
  id: "two-truths-lie",
  title: "Two Truths and a Lie",
  tagline: "Spot the imposter.",
  blurb: "Write three. One is fiction. Can they tell?",
  emoji: "🎭",
  mode: "open",
  questions: [
    "Three things about my day. One didn't happen.",
    "Three things I've thought about you this week. One I made up.",
    "Three things I've never told you. One is a beautiful lie.",
    "Three small dreams I have for us. One isn't really mine.",
  ],
};

export const CATEGORIES: GameCategory[] = [
  greenFlag, testingBoundaries, isItCheating, mostLikelyTo, agreeDisagree, thisOrThat, pickOne,
  rankThese, yesNo, hiddenSide, whatWouldHurt, princessTreatment, whatYouThink,
  beforeTheRing, finishSentence, spicyWyr, spicyNhi, spicyMostLikely,
  confessions, fantasyLab, compatibility, debate, truthOrDare, quickFire,
  hotSeat, finishStory, guessMyAnswer, twoTruths,
];

export const FEATURED_ID = "before-the-ring";
export const DAILY_ID = "this-or-that";
export const WEEKLY_ID = "compatibility";
export const RECENT_IDS = ["green-red", "most-likely", "truth-or-dare", "spicy-wyr", "confessions", "rank-these"];

export const COLLECTIONS = [
  { id: "deep", title: "The hard talks", subtitle: "For when you're brave.", ids: ["testing-boundaries", "is-it-cheating", "what-would-hurt", "agree-disagree", "debate", "confessions", "compatibility"] },
  { id: "tonight", title: "For tonight", subtitle: "Slow burn, deep talk.", ids: ["before-the-ring", "hidden-side", "what-you-think", "princess-treatment", "fantasy-lab"] },
  { id: "playful", title: "Playful & light", subtitle: "Laughter required.", ids: ["most-likely", "this-or-that", "quick-fire", "finish-sentence", "two-truths-lie", "guess-my-answer"] },
  { id: "spicy", title: "After 10pm", subtitle: "A little warmer. Tap with consent.", ids: ["spicy-wyr", "spicy-nhi", "spicy-most-likely", "truth-or-dare", "hot-seat"] },
  { id: "discovery", title: "Who are we", subtitle: "Tests, ranks, reveals.", ids: ["green-red", "rank-these", "pick-one", "yes-no", "finish-story"] },
];

export function getCardImage(id: string) {
  return `/images/cards/${id}.jpg`;
}

export function getCategory(id: string) {
  return CATEGORIES.find(c => c.id === id);
}

const SHOWCASE = `A small engineering team uses a review tool to improve releases. The system is a simple way to show errors before customers see them, and it helps each task stay focused. The team has three goals: catch risky changes early, explain decisions clearly, and keep feedback connected to the code.

The process starts when an engineer opens a change. Reviewers read the proposal and discuss its context. The tool connects comments to exact lines and shows which checks passed. This keeps the conversation practical, but the team still decides what matters.

The team measures results over time. Faster reviews are useful, clear ownership is important, and fewer production problems help everyone. The process does not replace judgment; it gives people a shared place to work and learn.`;

const HAMLET = `To be, or not to be, that is the question:
Whether 'tis nobler in the mind to suffer
The slings and arrows of outrageous fortune,
Or to take arms against a sea of troubles,
And by opposing end them. To die, to sleep—
No more—and by a sleep to say we end
The heartache, and the thousand natural shocks
That flesh is heir to, 'tis a consummation
Devoutly to be wish'd. To die, to sleep;
To sleep, perchance to dream—ay, there's the rub:
For in that sleep of death what dreams may come,
When we have shuffled off this mortal coil,
Must give us pause—there's the respect
That makes calamity of so long life.
For who would bear the whips and scorns of time,
Th' oppressor's wrong, the proud man's contumely,
The pangs of despised love, the law's delay,
The insolence of office, and the spurns
That patient merit of the unworthy takes,
When he himself might his quietus make
With a bare bodkin? Who would fardels bear,
To grunt and sweat under a weary life,
But that the dread of something after death,
The undiscovered country, from whose bourn
No traveller returns, puzzles the will,
And makes us rather bear those ills we have
Than fly to others that we know not of?
Thus conscience does make cowards of us all;
And thus the native hue of resolution
Is sicklied o'er with the pale cast of thought,
And enterprises of great pith and moment
With this regard their currents turn awry,
And lose the name of action. Soft you now!
The fair Ophelia! Nymph, in thy orisons
Be all my sins remembered.`;

const ORWELL_RULES = `George Orwell's six rules for writing:

Ask yourself at least four questions, thus:

What am I trying to say?
What words will express it?
What image or idiom will make it clearer?
Is this image fresh enough to have an effect?
And he will probably ask himself two more:

Could I put it more shortly?
Have I said anything that is avoidably ugly?
One can often be in doubt about the effect of a word or a phrase, and one needs rules that one can rely on when instinct fails. I think the following rules will cover most cases:

Never use a metaphor, simile, or other figure of speech which you are used to seeing in print.
Never use a long word where a short one will do.
If it is possible to cut a word out, always cut it out.
Never use the passive where you can use the active.
Never use a foreign phrase, a scientific word, or a jargon word if you can think of an everyday English equivalent.
Break any of these rules sooner than say anything outright barbarous.  `;

export const EXAMPLES = Object.freeze([
  Object.freeze({ id: 'showcase', label: 'Claudify showcase', text: SHOWCASE }),
  Object.freeze({ id: 'hamlet', label: 'Hamlet — To be, or not to be', text: HAMLET }),
  Object.freeze({ id: 'orwell', label: "Orwell — six rules of writing", text: ORWELL_RULES })
]);

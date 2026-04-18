export interface Belief {
  n: string;          // rule number, e.g. "01"
  text: string;       // plain text with *word* emphasis (rendered as italic-signal em)
  homeFeatured?: boolean;  // surfaced in the homepage Why excerpt
}

export const BELIEFS: Belief[] = [
  {
    n: '01',
    text: '*MAP* over motivation. Map the work, act in small loops, publish results early.'
  },
  {
    n: '02',
    text: 'Taste in AI means *constraints*. If an agent cannot explain what it changed, it has not earned trust.',
    homeFeatured: true
  },
  {
    n: '03',
    text: 'One ticket, *one turn*. Speed is real only when quality survives contact.',
    homeFeatured: true
  },
  {
    n: '04',
    text: 'Build for the *next tired* version of yourself. Future me should resume instantly.'
  }
];

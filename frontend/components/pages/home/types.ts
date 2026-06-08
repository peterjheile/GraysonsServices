export type QuickStat = {
    value: string;
    label: string;
}

export type MarqueeServices = [
  string,
  string,
  string,
  string,
  ...string[]
];

export type ValueIconName = "award" | "check" | "shield";
export type ValueCard = {
  icon: ValueIconName;
  title: string;
  body: string;
};


export type CredCard = {
  title: string;
  body: string;
};


export type OurStory = {
  eyebrow: string;
  titleLineNormal: string;
  titleLineHighlight: string;
  paragraphs: string[];
  url: string;
}

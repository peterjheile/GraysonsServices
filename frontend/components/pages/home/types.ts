export type AboutUs = {
  readonly url: string;
  readonly imageAlt: string;
  readonly eyebrow: string;
  readonly titleLineNormal: string;
  readonly titleLineHighlight: string;
  readonly paragraphs: readonly string[];
};

export type ValueIconName =
  | 'craftsmanship'
  | 'communication'
  | 'commitment'
  | 'dependable';

export type ValueCard = {
  readonly icon: ValueIconName;
  readonly title: string;
  readonly body: string;
};

export type CredentialCard = {
  readonly title: string;
  readonly body: string;
};
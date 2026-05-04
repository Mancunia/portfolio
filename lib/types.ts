export interface Profile {
  name: string;
  title: string;
  location: string;
  blurb: string;
  portrait: string;
  portraitTone: string;
  email: string;
}

export interface SocialLink {
  id: string;
  label: string;
  handle: string;
  url: string;
}

export type SkillGroups = Record<string, string[]>;

export interface Project {
  id: string;
  initials: string;
  tone: string;
  title: string;
  role: string;
  year: string;
  summary: string;
  stack: string[];
  status: string;
  liveUrl: string;
  repoUrl: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  note: string;
}

export interface WritingPost {
  id: string;
  title: string;
  date: string;
  read: string;
  slug?: string;
  excerpt?: string;
}

export interface BlogAsset {
  id: string;
  type: "code" | "image" | "link";
  lang?: string;
  filename?: string;
  code?: string;
  url?: string;
  alt?: string;
  caption?: string;
  href?: string;
  linkTitle?: string;
  linkDesc?: string;
}

export interface Reference {
  id: string;
  label: string;
  url: string;
  note?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  read: string;
  tags: string[];
  assets: BlogAsset[];
  references: Reference[];
  published: boolean;
}

export interface PortfolioData {
  profile: Profile;
  social: SocialLink[];
  skills: SkillGroups;
  projects: Project[];
  experience: Experience[];
  writing: WritingPost[];
}

export interface TechStack {
  languages: string[];
  frameworks: string[];
  tools: string[];
}

export interface RepoSummary {
  purpose: string;
  techStack: TechStack;
  architecture: string;
  entryPoints: string[];
  keyFiles: string[];
  setup: string;
  openQuestions: string[];
  analyzedAt: string;
}

export interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
  url: string;
  homepage: string | null;
  updatedAt: string;
  topics: string[];
  summary: RepoSummary | null;
}

export interface ReposData {
  lastUpdated: string;
  owner: string;
  repos: Repo[];
}

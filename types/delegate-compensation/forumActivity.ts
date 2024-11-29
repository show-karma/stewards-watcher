export type ForumPosts = {
  comment: string;
  link: string;
  topic: string;
  insight: string;
  createdAt: string;
  id: string | number;
};

export type ForumActivityBreakdown = {
  id: string | number;
  status: 'valid' | 'invalid';
  relevance: number;
  depthOfAnalysis: number;
  timing: number;
  clarityAndCommunication: number;
  impactOnDecisionMaking: number;
  totalScore: number;
};

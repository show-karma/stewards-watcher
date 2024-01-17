export type CompensationStatBreakdown = {
  score: string;
  tn: number;
  rn: number;
};

export type DelegateCompensationStats = {
  delegate: string;
  delegateImage: string;
  ranking: number;
  participationRate: string;
  snapshotVoting: CompensationStatBreakdown;
  onChainVoting: CompensationStatBreakdown;
  communicatingRationale: CompensationStatBreakdown;
  commentingProposal: CompensationStatBreakdown;
  bonusPoint: number;
  totalParticipation: string;
  payment: number;
};

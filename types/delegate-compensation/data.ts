export type CompensationStatBreakdown = {
  score: string;
  tn: string;
  rn: string;
};

export type DelegateStatsFromAPI = {
  id: number;
  enrollmentId: number;
  stats: {
    address: string;
    participationRate: string;
    snapshotVoting: CompensationStatBreakdown;
    onChainVoting: CompensationStatBreakdown;
    communicatingRationale: CompensationStatBreakdown;
    commentingProposal: CompensationStatBreakdown;
    bonusPoint: number;
    totalParticipation: string;
  };
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
  bonusPoint: string;
  totalParticipation: string;
  payment: number;
};

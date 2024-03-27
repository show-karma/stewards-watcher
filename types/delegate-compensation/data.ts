export type CompensationStatBreakdown = {
  score: string;
  tn: string;
  rn: string;
  breakdown?: Record<string, string>;
};

export type DelegateStatsFromAPI = {
  ensName: string;
  name: string;
  profilePicture: string;
  publicAddress: string;
  id: number;
  incentiveOptedIn: boolean;
  votingPower: string;
  stats: {
    bonusPoint: number;
    commentingProposal: CompensationStatBreakdown;
    communicatingRationale: CompensationStatBreakdown;
    onChainVoting: CompensationStatBreakdown;
    participationRate: string;
    payment: number;
    snapshotVoting: CompensationStatBreakdown;
    totalParticipation: string;
    participationRatePercent: number;
  };
};

export type DelegateCompensationStats = {
  id: number;
  delegate: {
    name?: string;
    ensName?: string;
    publicAddress: string;
    shouldUse: string;
  };
  votingPower: number;
  incentiveOptedIn: boolean;
  delegateImage: string;
  ranking: number;
  participationRate: string;
  participationRatePercent: number;
  snapshotVoting: CompensationStatBreakdown;
  onChainVoting: CompensationStatBreakdown;
  communicatingRationale: CompensationStatBreakdown;
  commentingProposal: CompensationStatBreakdown;
  bonusPoint: string;
  totalParticipation: string;
  payment: string;
};

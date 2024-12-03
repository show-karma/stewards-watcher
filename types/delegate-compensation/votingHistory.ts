export type ParticipationRateProposals = {
  id: string;
  startDate: string;
  end: string;
  discussion: string;
};
export type ParticipationRateVotes = {
  id: string;
  proposal: {
    endDate: string;
    id: string;
    startDate: string;
    timestamp: string;
  };
  support: number;
};
export type ParticipationRateRows = {
  id: string;
  discussion: string;
  votedOn?: string;
  link?: string;
};

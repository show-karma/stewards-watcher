export type EndorsementData = {
  addressOrENS: string;
  votingPower: string;
  date: number;
  reason?: string;
};
export type GeneralisticEndorsementData = {
  delegate: string;
  endorsedBy: string;
  votingPower: string;
  date: number;
  reason?: string;
};

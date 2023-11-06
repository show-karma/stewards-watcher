export type EndorsementData = {
  addressOrENS: string;
  votingPower: string;
  date: number;
  reason?: string;
};
export type GeneralisticEndorsementData = {
  delegate: {
    nameOrAddress: string;
    imageURL: string | null | undefined;
  };
  endorsedBy: {
    nameOrAddress: string;
    imageURL: string | null | undefined;
  };
  votingPower: string;
  date: number;
  reason?: string;
};

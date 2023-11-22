export type EndorsementData = {
  attestationUID: string;
  addressOrENS: string;
  votingPower: string;
  date: number;
  reason?: string;
};
export type GeneralisticEndorsementData = {
  delegate: {
    realName?: string;
    ensName?: string;
    address: string;
    imageURL?: string | null;
  };
  endorsedBy: {
    realName?: string;
    ensName?: string;
    address: string;
    imageURL?: string | null;
  };
  votingPower: string;
  date: number;
  reason?: string;
};

/**
 * A number that can be represented in a String
 *
 *  `1` or `'1'`
 */
export type NumberIsh = string | number;

/**
 * An hexadecimal string
 *
 *  `0x1234567890abcdef`
 */
export type Hex = `0x${string}`;

interface MoonbeamTrackRaw {
  name: string;
  displayName: string;
  maxDeciding: number;
  decisionDeposit: Hex;
  preparePeriod: number;
  decisionPeriod: number;
  confirmPeriod: number;
  minEnactmentPeriod: number;
  minApproval: {
    reciprocal: {
      factor: number;
      xOffset: number;
      yOffset: number;
    };
  };
  minSupport: {
    reciprocal: {
      factor: number;
      xOffset: number;
      yOffset: number;
    };
  };
}

export interface MoonbeamTrack extends MoonbeamTrackRaw {
  id: NumberIsh;
}

export interface OpenGovLockedBalance {
  amount: string;
  id: Hex;
  reasons: string;
}

export type OpenGovLockedBalanceResponse = OpenGovLockedBalance[];

export interface OpenGovIdentityResponse {
  info: {
    additional: string[];
    display: { Raw: string };
    image: { Raw: string };
    twitter: { Raw: string };
    legal: string;
    web: string;
    riot: string;
    email: string;
    pgpFingerprint: boolean;
  };
}
export type MoonbeamTrackRes = [NumberIsh, MoonbeamTrack];
// export interface MoonbeamProposal {
//   proposalId: string;
//   information: AnyJson;
// }

type ProposalStatusData = {
  who: Hex;
  amount: Hex;
};

type ProposalStatusInfo = [NumberIsh, ProposalStatusData, ProposalStatusData?];

export interface MoonbeamProposal {
  proposalId: NumberIsh;
  timestamp: number;
  information: {
    ongoing?: {
      track: string;
      origin: {
        origins: string;
      };
      proposal: {
        lookup: {
          hash: Hex;
          len: number;
        };
      };
      enactment: {
        after: number;
      };
      submitted: number;
      submissionDeposit: {
        who: Hex;
        amount: Hex;
      };
      decisionDeposit: {
        who: Hex;
        amount: Hex;
      };
      deciding: {
        since: number;
        confirming: unknown;
      };
      tally: {
        ayes: Hex;
        nays: number;
        support: Hex;
      };
      inQueue: false;
      alarm: unknown;
    };
    approved?: ProposalStatusInfo;
    timedOut?: ProposalStatusInfo;
    cancelled?: ProposalStatusInfo;
    // not sure if this exists. there's no registry of it in the example data
    rejected?: ProposalStatusInfo;
  };
}

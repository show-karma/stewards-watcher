export interface ProposalsFromAPI {
  daoName: string;
  month: string | number;
  year: string | number;
  proposals: Record<
    string,
    {
      type: 'snapshot' | 'onChain';
      title: string;
      link: string;
      isValid: boolean;
      endDate?: string;
    }
  >;
}

export interface ProposalItem {
  id: string;
  name: string;
  link: string;
  isValid: boolean;
  endDate?: string;
  proposalTopic?: string;
  type: 'snapshot' | 'onChain';
}

export interface Proposal {
  name: string;
  items: ProposalItem[];
}

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

export interface Proposal {
  name: string;
  items: {
    id: string;
    name: string;
    link: string;
    isValid: boolean;
    endDate?: string;
    type: 'snapshot' | 'onChain';
  }[];
}

import { api } from 'helpers';

interface IPostEmailLead {
  publicAddress: string;
  email: string;
  interest: {
    activator: 'delegator' | 'rss';
    target?: string;
  };
}

export function saveLeadEmail(data: IPostEmailLead) {
  return api.post('/email-lead', data);
}

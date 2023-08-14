import axios, { AxiosInstance } from 'axios';
import { NumberIsh } from 'types';

export interface Post {
  comments_count: number;
  created_at: Date;
  curator: string;
  description: string;
  end?: Date;
  hash: string;
  parent_bounty_index: null;
  post_id: number;
  status: string;
  title: string;
}

interface OnChainPostsRes {
  count: number;
  posts: Post[];
}

export const polkassemblyProposalUrl = {
  moonriver: (proposalId: number | string) =>
    `https://moonriver.polkassembly.io/referenda/${proposalId}`,
  moonbeam: (proposalId: number | string) =>
    `https://moonbeam.polkassembly.io/referenda/${proposalId}`,
};

export const routes = {
  onChainPosts: (trackNo: NumberIsh, page = 1, limit = 100) => ({
    url: '/listing/on-chain-posts',
    params: {
      page,
      proposalType: 'referendums_v2',
      listingLimit: limit,
      trackNo,
      trackStatus: 'All',
      sortBy: 'newest',
    },
  }),
};

class PolkassemblyClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.polkassembly.io/api/v1',
    });
  }

  async fetchOnChainPosts(
    trackNo: NumberIsh,
    network: 'moonriver' | 'moonbeam' = 'moonriver',
    page = 1,
    limit = 100
  ): Promise<Post[]> {
    const { url, params } = routes.onChainPosts(trackNo, page, limit);
    const { data } = await this.api.get<OnChainPostsRes>(url, {
      params,
      headers: { 'X-Network': network },
    });
    return data.posts;
  }
}

const polkassembly = new PolkassemblyClient();

export { polkassembly, PolkassemblyClient };

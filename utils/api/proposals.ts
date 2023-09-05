import { MoonbeamProposal, NumberIsh } from 'types';
import { MoonbeamWSC } from '../moonbeam/moonbeamwsc';
import { polkassembly, Post } from '../moonbeam/polkassembly';

export const moonriverProposals = async (
  daoName: 'moonbeam' | 'moonriver' | 'moonbase'= 'moonriver'
) => {
  const clientV2 = await MoonbeamWSC.createClient();

  const [proposals, tracks] = await Promise.all([
    clientV2.getProposals(),
    clientV2.getTracks(),
  ]);

  const postWithTrackId: (Post & {
    trackId: NumberIsh | null;
    openGov: boolean;
  })[] = [];

  const postsV1: (Post & {
    trackId: NumberIsh | null;
    openGov: boolean;
  })[] = [];

  const promises = [
    ...tracks.map(async track => {
      const posts = await polkassembly.fetchOnChainPostsV2(track.id, daoName);
      postWithTrackId.push(
        ...posts.map(post => ({ ...post, trackId: track.id, openGov: true }))
      );
    }),
    (async () => {
      const posts = await polkassembly.fetchOnChainPostsV1(daoName);
      postsV1.push(
        ...posts.map(post => ({ ...post, trackId: null, openGov: false }))
      );
    })(),
  ];

  await Promise.all(promises);
  const result: (MoonbeamProposal & {
    proposal: string;
    trackId: NumberIsh | null;
    openGov: boolean;
  })[] = [];

  postWithTrackId.forEach(post => {
    const currentProposal = proposals.find(
      proposal => +proposal.proposalId === +post.post_id && post.openGov
    );

    if (currentProposal) {
      result.push({
        ...currentProposal,
        proposal: post.title,
        trackId: post.trackId,
        openGov: post.openGov,
      });
    }
  });

  return result.concat(
    postsV1.map(post => ({
      information: {
        timedOut: [
          post.status_history[0].block,
          {
            who: '0x0',
            amount: '0x0',
          },
        ],
      },
      proposalId: post.post_id,
      openGov: false,
      proposal: post.title,
      trackId: null,
      timestamp: 0,
    }))
  );
};

export const moonbeamProposals = () => moonriverProposals('moonbeam');

export const moonbaseProposals = () => moonriverProposals('moonbase');

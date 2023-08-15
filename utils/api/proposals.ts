import { MoonbeamProposal, NumberIsh } from 'types';
import { MoonbeamWSC } from '../moonbeam/moonbeamwsc';
import { polkassembly, Post } from '../moonbeam/polkassembly';

export const moonriverProposals = async () => {
  const client = await MoonbeamWSC.createClient();

  const proposals = await client.getProposals();
  const tracks = client.getTracks(true);
  const postWithTrackId: (Post & { trackId: NumberIsh })[] = [];

  const promises = tracks.map(async track => {
    const posts = await polkassembly.fetchOnChainPosts(track.id, 'moonriver');
    postWithTrackId.push(
      ...posts.map(post => ({ ...post, trackId: track.id }))
    );
  });

  await Promise.all(promises);

  const result: (MoonbeamProposal & {
    proposal: string;
    trackId: NumberIsh;
  })[] = [];

  postWithTrackId.forEach(post => {
    const currentProposal = proposals.find(
      proposal => +proposal.proposalId === +post.post_id
    );

    if (currentProposal) {
      result.push({
        ...currentProposal,
        proposal: post.title,
        trackId: post.trackId,
      });
    }
  });
  return result;
};

export const moonbeamProposals = async () => {
  const client = await MoonbeamWSC.createClient();

  const proposals = await client.getProposals();
  const tracks = client.getTracks(true);
  const postWithTrackId: (Post & { trackId: NumberIsh })[] = [];

  const promises = tracks.map(async track => {
    const posts = await polkassembly.fetchOnChainPosts(track.id, 'moonbeam');
    postWithTrackId.push(
      ...posts.map(post => ({ ...post, trackId: track.id }))
    );
  });

  await Promise.all(promises);

  const result: (MoonbeamProposal & {
    proposal: string;
    trackId: NumberIsh;
  })[] = [];

  postWithTrackId.forEach(post => {
    const currentProposal = proposals.find(
      proposal => +proposal.proposalId === +post.post_id
    );

    if (currentProposal) {
      result.push({
        ...currentProposal,
        proposal: post.title,
        trackId: post.trackId,
      });
    }
  });
  return result;
};

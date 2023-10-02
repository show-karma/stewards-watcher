import { IChainRow } from 'types';

export const checkDecision = (vote: IChainRow) => {
  if (typeof vote === 'undefined') return 'NOTVOTED';
  if (vote.voteMethod !== 'On-chain' && typeof vote.choice === 'string') {
    const { choice } = vote;
    if (/not vote/gi.test(choice)) {
      return 'NOTVOTED';
    }
    // eslint-disable-next-line react/destructuring-assignment
    const choiceLowerCase = choice.toLocaleLowerCase();
    if (
      choiceLowerCase.substring(0, 2) === 'no' ||
      /agai+nst/gi.test(choice) ||
      choiceLowerCase.substring(0, 3) === 'nay' ||
      choiceLowerCase.substring(0, 3) === 'nae'
    ) {
      return 'AGAINST';
    }
    if (/abstain/gi.test(choice)) return 'ABSTAIN';

    return 'FOR';
  }
  if (vote.solution) return 'FOR';
  if (vote.choice === 0) return 'AGAINST';
  if (vote.choice === 1) return 'FOR';
  if (vote.choice === 'ABSTAIN' || vote.choice === 2) return 'ABSTAIN';
  if (vote.choice === -1 && !vote.finished) return 'NOTYET';
  if (vote.choice === 'Did not vote') return 'NOTVOTED';

  return 'NOTVOTED';
};

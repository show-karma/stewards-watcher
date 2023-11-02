import { VotingReasonPayload } from 'utils/voting-reason/save-voting-reason';

export interface SelectedProposal {
  proposalId: string;
  proposalTitle: string;
  source: VotingReasonPayload['source'];
}

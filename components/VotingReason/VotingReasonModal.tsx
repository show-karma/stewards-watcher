import { StyledModal } from 'components/Modals/DelegateToAnyone/StyledModal';
import { VotingReasonForm, VotingReasonFormProps } from './VotingReasonForm';

interface VotingReasonModalProps {
  form: VotingReasonFormProps;
  isOpen: boolean;
  onClose: () => void;
}

export const VotingReasonModal: React.FC<VotingReasonModalProps> = ({
  form,
  isOpen,
  onClose,
}) => (
  <StyledModal title="Add Voting Reason" isOpen={isOpen} onClose={onClose}>
    <VotingReasonForm {...form} />
  </StyledModal>
);

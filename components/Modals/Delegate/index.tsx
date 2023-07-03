import React, { useEffect, useState } from 'react';
import { IDelegate } from 'types';
import { useDAO, useGovernanceVotes } from 'contexts';

import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { ESteps } from './ESteps';
import { Step1 } from './Step1';
import { Step2 } from './Step2';
import { StepChange } from './StepChange';
import { TrackDelegation } from './TrackDelegation';

interface IModal {
  open: boolean;
  handleModal: () => void;
  delegateData: IDelegate;
}

export const DelegateModal: React.FC<IModal> = ({
  open,
  handleModal,
  delegateData,
}) => {
  const { daoData, daoInfo } = useDAO();
  const [step, setStep] = useState(ESteps.DELEGATE);
  const { votes, delegatedBefore, walletAddress } = useGovernanceVotes();

  const resetStep = () => setStep(ESteps.DELEGATE);

  const closeModal = () => {
    handleModal();
    resetStep();
  };

  const renderStep = () => {
    if (!daoData) return null;
    if (daoInfo.config.ALLOW_BULK_DELEGATE)
      return (
        <TrackDelegation
          handleModal={closeModal}
          votes={votes}
          delegatedUser={delegateData}
          walletAddress={walletAddress}
        />
      );
    if (step === ESteps.DONE)
      return <Step2 handleModal={closeModal} delegatedUser={delegateData} />;
    if (
      delegatedBefore !== '0x0000000000000000000000000000000000000000' &&
      delegatedBefore
    )
      return (
        <StepChange
          handleModal={closeModal}
          votes={votes}
          delegatedUser={delegateData}
          delegatedBefore={delegatedBefore}
          walletAddress={walletAddress}
        />
      );

    return (
      <Step1
        handleModal={closeModal}
        votes={votes}
        delegatedUser={delegateData}
        walletAddress={walletAddress}
      />
    );
  };

  return (
    <Modal
      isOpen={open}
      onClose={closeModal}
      aria-labelledby="delegate-modal-title"
      aria-describedby="delegate-modal-description"
      isCentered
    >
      <ModalOverlay />
      <ModalContent maxW="max-content">{renderStep()}</ModalContent>
    </Modal>
  );
};

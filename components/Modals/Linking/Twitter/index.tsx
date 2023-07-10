import { ModalContent, ModalOverlay, Modal } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { AxiosClient } from 'helpers';
import { useToasty } from 'hooks';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { lessThanDays } from 'utils';
import { useAccount } from 'wagmi';
import { ESteps } from './ESteps';

const Step1 = dynamic(() => import('./Step1').then(module => module.Step1));
const Step2 = dynamic(() => import('./Step2').then(module => module.Step2));
const Step3 = dynamic(() => import('./Step3').then(module => module.Step3));
const StepVerified = dynamic(() =>
  import('./StepVerified').then(module => module.StepVerified)
);

interface IModal {
  open: boolean;
  handleModal: () => void;
  onClose: () => void;
}

export const TwitterModal: React.FC<IModal> = ({
  open,
  handleModal,
  onClose,
}) => {
  const [step, setStep] = useState(ESteps.INPUT);
  const [signature, setSignature] = useState('');
  const [username, setUsername] = useState('');
  const { toast, updateState } = useToasty();
  const { address: publicAddress } = useAccount();
  const { daoData, daoInfo } = useDAO();
  const { profileSelected } = useDelegates();
  const daoName = daoData?.name || '';
  const logoUrl = daoData?.socialLinks.logoUrl || '';
  const request = AxiosClient();

  const validationPromise = () =>
    new Promise((resolve, reject) =>
      // eslint-disable-next-line no-promise-executor-return
      request
        .post('/dao/link/twitter', {
          daoName,
          message: username,
        })
        .then(() => {
          setStep(ESteps.VERIFIED);
          updateState({
            title: 'Verified.',
            description:
              'Your twitter handle has been verified and linked to your profile!',
            status: 'success',
            duration: 10000,
          });
          return resolve(true);
        })
        .catch(error => {
          setStep(ESteps.PUBLISH);
          const errorMessage = error?.response?.data;
          if (!errorMessage) return reject(error);
          updateState({
            title: 'Twitter verification failed',
            description: errorMessage.error,
            status: 'error',
            duration: 10000,
          });
          return reject(error);
        })
    );

  const verifyPublication = async () => {
    setStep(ESteps.VERIFYING);
    try {
      toast({
        title: 'Verifying your tweet',
        description: 'Please wait while we verify your tweet.',
        duration: 100000,
        status: 'info',
      });
      validationPromise();
    } catch (error) {
      console.log(error);
    }
  };

  const resetStep = () => setStep(ESteps.INPUT);

  const closeModal = () => {
    handleModal();
    resetStep();
  };

  const renderStep = () => {
    if (step === ESteps.SIGN)
      return (
        <Step2
          handleModal={closeModal}
          setStep={setStep}
          username={username}
          setSignature={setSignature}
          daoInfo={{ name: daoName, logoUrl }}
        />
      );
    if (
      (step === ESteps.PUBLISH ||
        step === ESteps.VERIFICATION ||
        step === ESteps.VERIFYING) &&
      publicAddress
    )
      return (
        <Step3
          handleModal={closeModal}
          setStep={setStep}
          signature={signature}
          publicAddress={publicAddress}
          step={step}
          verifyPublication={verifyPublication}
        />
      );
    if (step === ESteps.VERIFIED)
      return (
        <StepVerified
          handleModal={closeModal}
          username={username}
          daoInfo={{ name: daoName, logoUrl }}
        />
      );
    return (
      <Step1
        handleModal={closeModal}
        setStep={setStep}
        username={username}
        setUsername={setUsername}
        daoInfo={{ name: daoName, logoUrl }}
      />
    );
  };
  // TODO uncomment when twitter comeback
  // const notShowCondition =
  //   daoInfo.config.SHOULD_NOT_SHOW === 'handles' ||
  //   !profileSelected?.userCreatedAt ||
  //   (daoInfo.config.DAO_KARMA_ID === 'starknet' &&
  //     !!profileSelected?.userCreatedAt &&
  //     lessThanDays(profileSelected?.userCreatedAt, 100));

  // TODO: TEMPORARY HIDE
  // useEffect(() => {
  //   if (notShowCondition) {
  //     onClose();
  //   }
  // }, [open]);
  useEffect(() => {
    onClose();
  }, [open]);

  return (
    <Modal
      isOpen={open}
      onClose={closeModal}
      aria-labelledby="twitter-modal-title"
      aria-describedby="twitter-modal-description"
    >
      <ModalOverlay />
      <ModalContent>{renderStep()}</ModalContent>
    </Modal>
  );
};

import { Modal, ModalContent, ModalOverlay } from '@chakra-ui/react';
import { useDAO, useWallet } from 'contexts';
import { AxiosClient } from 'helpers';
import { useToasty } from 'hooks';
import dynamic from 'next/dynamic';
import { queryClient } from 'pages/_app';
import React, { useEffect, useState } from 'react';
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

export const GithubModal: React.FC<IModal> = ({
  open,
  handleModal,
  onClose,
}) => {
  const [step, setStep] = useState(ESteps.INPUT);
  const [signature, setSignature] = useState('');
  const [username, setUsername] = useState('');
  const { toast, updateState } = useToasty();
  const { address: publicAddress } = useAccount();
  const { daoData } = useDAO();
  const daoName = daoData?.name || '';
  const logoUrl = daoData?.socialLinks.logoUrl || '';
  const request = AxiosClient();
  const { address } = useWallet();

  const validationPromise = () =>
    new Promise((resolve, reject) =>
      // eslint-disable-next-line no-promise-executor-return
      request
        .post('/user/link/github', {
          message: username.toLowerCase(),
        })
        .then(() => {
          setStep(ESteps.VERIFIED);
          updateState({
            title: 'Verified.',
            description:
              'Your github handle has been verified and linked to your profile!',
            status: 'success',
            duration: 10000,
          });
          queryClient.invalidateQueries({
            queryKey: ['profile', address?.toLowerCase() as string],
          });
          return resolve(true);
        })
        .catch(error => {
          setStep(ESteps.PUBLISH);
          const errorMessage = error?.response?.data;
          if (!errorMessage) return reject(error);
          updateState({
            title: 'Github verification failed',
            description:
              errorMessage?.error?.message ||
              errorMessage?.error?.error ||
              errorMessage?.error,
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
        title: 'Verifying your publication',
        description: 'Please wait while we verify your github.',
        duration: 100000,
        status: 'info',
      });
      validationPromise();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error);
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
  const { daoInfo } = useDAO();
  // const { profileSelected } = useDelegates();

  // const notShowCondition =
  //   daoInfo.config.SHOULD_NOT_SHOW === 'handles' ||
  //   !profileSelected?.userCreatedAt ||
  //   (daoInfo.config.DAO_KARMA_ID === 'starknet' &&
  //     !!profileSelected?.userCreatedAt &&
  //     lessThanDays(profileSelected?.userCreatedAt, 100));

  const notShowCondition =
    !daoInfo.config.ENABLE_HANDLES_EDIT?.includes('github');

  useEffect(() => {
    if (notShowCondition) {
      onClose();
    }
  }, [open]);

  return (
    <Modal
      isOpen={open}
      onClose={closeModal}
      aria-labelledby="github-modal-title"
      aria-describedby="github-modal-description"
    >
      <ModalOverlay />
      <ModalContent>{renderStep()}</ModalContent>
    </Modal>
  );
};

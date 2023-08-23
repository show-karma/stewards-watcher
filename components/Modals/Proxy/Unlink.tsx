import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  FormControl,
  Input,
  Text,
} from '@chakra-ui/react';
import { FC, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDAO, useProxy, useWallet } from 'contexts';
import { truncateAddress } from 'utils';

interface ProxyProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnlinkProxy: FC<ProxyProps> = ({ isOpen, onClose }) => {
  const cancelRef = useRef();
  const { address } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleProxy, realWallet } = useProxy();

  const submit = async () => {
    setIsSubmitting(true);
    await handleProxy('');
    setIsSubmitting(false);
  };

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef as any}
      onClose={onClose}
      isOpen={isOpen}
      isCentered
    >
      <AlertDialogOverlay />

      <AlertDialogContent bgColor="gray.900">
        <AlertDialogHeader color="white">
          Unlink proxy/real account?
        </AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody pb="8">
          <Text
            color="white"
            mb="5"
          >{`Do you really want to unlink proxy (${truncateAddress(
            address as string
          )}) and real account (${realWallet})?`}</Text>
          <Button
            mt="4"
            _hover={{}}
            _disabled={{ opacity: '0.4' }}
            isLoading={isSubmitting}
            bgColor="red.700"
            color="white"
            onClick={submit}
          >
            Unlink accounts
          </Button>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
};

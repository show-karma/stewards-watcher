import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  FormControl,
  Input,
  Text,
} from '@chakra-ui/react';
import { FC, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDAO, useEditProfile } from 'contexts';

interface ProxyProps {
  isOpen: boolean;
  onClose: () => void;
}

const addressRegex = /^0x[a-fA-F0-9]{40}$/;

export const Proxy: FC<ProxyProps> = ({ isOpen, onClose }) => {
  const cancelRef = useRef();
  const { theme } = useDAO();
  const { handleProxy } = useEditProfile();

  const walletSchema = yup
    .object({
      wallet: yup
        .string()
        .required('Wallet is required')
        .test('is-valid-address', 'Please enter a valid address.', value => {
          if (addressRegex.test(value)) return true;
          return false;
        }),
    })
    .required();

  type FormDataDiscussionWallet = yup.InferType<typeof walletSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormDataDiscussionWallet>({
    resolver: yupResolver(walletSchema),
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const onSubmit = async (values: FormDataDiscussionWallet) => {
    await handleProxy(values.wallet).then(() => {
      onClose();
    });
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
        <AlertDialogHeader color="white">Use as proxy</AlertDialogHeader>
        <AlertDialogCloseButton />
        <AlertDialogBody py="8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors.wallet}>
              <Flex
                flexDir="column"
                alignItems="flex-start"
                justifyContent="flex-start"
                gap="2"
              >
                <Text color="white">Cold wallet address</Text>
                <Input
                  px="4"
                  py="2"
                  borderWidth="1px"
                  borderColor={theme.modal.statement.sidebar.item}
                  minW="60"
                  maxW="60"
                  w="max-content"
                  color="white"
                  {...register('wallet')}
                />
                {!isValid && (
                  <Text mt="2" color="red.200">
                    {errors.wallet?.message}
                  </Text>
                )}
              </Flex>
              <Button
                type="submit"
                mt="4"
                disabled={!isValid}
                isDisabled={!isValid}
                _hover={{}}
                _disabled={{ opacity: '0.4' }}
                isLoading={isSubmitting}
                bgColor="black"
                color="white"
              >
                Link wallets
              </Button>
            </FormControl>
          </form>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
};

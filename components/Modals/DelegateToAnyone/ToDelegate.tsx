import { Flex, Input, Text } from '@chakra-ui/react';
import { DelegateButton } from 'components';
import { useDAO, useDelegates } from 'contexts';
import { ethers } from 'ethers';
import { FC, useMemo } from 'react';

interface IToDelegateProps {
  address: string;
  success: boolean;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ToDelegate: FC<IToDelegateProps> = ({
  address,
  setAddress,
  setSuccess,
  success,
}) => {
  const { theme } = useDAO();

  const { setSelectedProfileData } = useDelegates();
  const { delegateTo: modalTheme } = theme.modal;

  const isEthAddress = useMemo(
    () => ethers.utils.isAddress(address),
    [address]
  );

  const handleChange = (addr: string) => {
    if (address !== addr) setAddress(addr);
  };

  const emitSuccess = () => setSuccess(true);

  const fullDisabled = !isEthAddress && address.length > 0;

  return (
    <Flex px="4" flexDir="column" align="center" maxW="368px" pb="6">
      <Text
        mb={1}
        color={modalTheme.text}
        fontWeight="semibold"
        fontSize="2xl"
        textAlign="left"
        w="full"
      >
        Delegate tokens to anyone.
      </Text>
      <Text
        mb={7}
        color={modalTheme.subtext}
        fontWeight="normal"
        fontSize="lg"
        textAlign="left"
        w="full"
      >
        Enter the ETH address to delegate your tokens to this individual.
      </Text>
      <Input
        placeholder="Enter ETH address"
        type="text"
        onChange={event => handleChange(event.target.value)}
        width="full"
        bgColor={modalTheme.bg}
        borderWidth="1px"
        borderColor={modalTheme.input.border}
        _placeholder={{ color: modalTheme.input.placeholder }}
        color={modalTheme.input.text}
        _focus={{
          borderWidth: '1px',
          borderColor: fullDisabled
            ? modalTheme.input.error
            : modalTheme.input.dirtyBorder,
          outline: 'none !important',
        }}
        _active={{
          borderWidth: '1px',
          borderColor: fullDisabled
            ? modalTheme.input.error
            : modalTheme.input.dirtyBorder,
          outline: 'none !important',
        }}
        _focusVisible={{
          borderWidth: '1px',
          borderColor: fullDisabled
            ? modalTheme.input.error
            : modalTheme.input.dirtyBorder,
          outline: 'none !important',
        }}
        _focusWithin={{
          borderWidth: '1px',
          borderColor: fullDisabled
            ? modalTheme.input.error
            : modalTheme.input.dirtyBorder,
          outline: 'none !important',
        }}
        _hover={{
          borderWidth: '1px',
          borderColor: fullDisabled
            ? modalTheme.input.error
            : modalTheme.input.dirtyBorder,
          outline: 'none !important',
        }}
      />
      {!isEthAddress && address !== '' && (
        <Text textAlign="start" w="full" color={modalTheme.input.error}>
          This is not a valid ETH
        </Text>
      )}
      <DelegateButton
        delegated={address}
        disabled={!isEthAddress}
        w="full"
        maxW="full"
        borderRadius="4px"
        mt={4}
        successEmitter={emitSuccess}
        beforeOnClick={() => {
          setSelectedProfileData({
            address,
            forumActivity: 0,
            karmaScore: 0,
            voteParticipation: {
              onChain: 0,
              offChain: 0,
            },
            discordScore: 0,
          });
        }}
      />
    </Flex>
  );
};

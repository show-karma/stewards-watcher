import { Flex, Input, Text } from '@chakra-ui/react';
import { DelegateButton } from 'components';
import { useDAO, useDelegates } from 'contexts';
import { ethers } from 'ethers';
import { FC, useMemo } from 'react';

interface IToDelegateProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  onOk?: () => void;
}

export const ToDelegate: FC<IToDelegateProps> = ({
  address,
  setAddress,
  setSuccess,
  onOk,
}) => {
  const { theme, daoInfo } = useDAO();
  const { setSelectedProfileData, findDelegateByAddress } = useDelegates();
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

  const setDelegate = async () => {
    const emptyDelegate = {
      address,
      forumActivity: 0,
      karmaScore: 0,
      voteParticipation: {
        onChain: 0,
        offChain: 0,
      },
      discordScore: 0,
      status: 'active',
    };
    try {
      const hasTracks = daoInfo.config.DAO_CATEGORIES_TYPE === 'tracks';
      if (hasTracks) {
        const delegate = await findDelegateByAddress(address);
        setSelectedProfileData(delegate || emptyDelegate);
        onOk?.();
        return;
      }

      setSelectedProfileData(emptyDelegate);
    } catch {
      setSelectedProfileData({
        address,
        forumActivity: 0,
        karmaScore: 0,
        voteParticipation: {
          onChain: 0,
          offChain: 0,
        },
        discordScore: 0,
        status: 'active',
      });
    }
  };

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
        Enter the wallet address to delegate your tokens to this individual.
      </Text>
      <Input
        placeholder="Enter Wallet address"
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
          This is not a valid wallet address
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
        beforeOnClick={() => setDelegate()}
        text={
          daoInfo.config.DAO_DELEGATE_CONTRACT ||
          daoInfo.config.ALLOW_BULK_DELEGATE
            ? 'Continue'
            : 'Delegate'
        }
      />
    </Flex>
  );
};

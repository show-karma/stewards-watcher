import { Flex, Text } from '@chakra-ui/react';
import { blo } from 'blo';
import { CheckIcon } from 'components/Icons/CheckIcon';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { truncateAddress } from 'utils';

export const DelegateBlock = () => {
  const { delegateInfo } = useDelegateCompensation();
  const { theme } = useDAO();
  return (
    <Flex flexDir="row" gap="5" align="center">
      <Flex position="relative">
        <ImgWithFallback
          fallback={delegateInfo?.publicAddress}
          src={
            delegateInfo?.profilePicture || delegateInfo?.publicAddress
              ? blo(delegateInfo?.publicAddress as `0x${string}`)
              : undefined
          }
          boxSize="64px"
          borderRadius="full"
        />
        <CheckIcon
          color={theme.compensation?.card.success}
          boxSize="24px"
          borderRadius="full"
          position="absolute"
          left="52px"
        />
      </Flex>
      <Flex flexDir="column" gap="1" align="flex-start">
        <Text
          color={theme.compensation?.card.text}
          fontWeight={700}
          fontSize="16px"
        >
          {delegateInfo?.name ||
            delegateInfo?.ensName ||
            delegateInfo?.publicAddress}
        </Text>
        <Text
          color={theme.compensation?.card.text}
          fontWeight={400}
          fontSize="14px"
        >
          {truncateAddress(delegateInfo?.publicAddress as string)}
        </Text>
      </Flex>
    </Flex>
  );
};

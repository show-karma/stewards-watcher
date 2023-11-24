import { Flex, Text } from '@chakra-ui/react';
import { blo } from 'blo';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { useDAO } from 'contexts';
import { FC } from 'react';

interface UserClickableProps {
  address: string;
  imageURL?: string;
  nameToShow: string;
}

export const UserNotClickable: FC<UserClickableProps> = ({
  address,
  imageURL,
  nameToShow,
}) => {
  const { theme } = useDAO();
  return (
    <Flex
      flexDir="row"
      gap="2"
      textOverflow="ellipsis"
      maxW={{ base: '120px', md: 'none' }}
      w="100%"
      justifyContent="flex-start"
    >
      <ImgWithFallback
        fallback={address}
        src={imageURL || blo(address as `0x${string}`)}
        boxSize="20px"
        borderRadius="full"
      />
      <Text
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        overflow="hidden"
        color={theme.text}
        fontSize={{ base: '12px', sm: '14px' }}
        maxW={{ base: '120px', md: 'none' }}
      >
        {nameToShow}
      </Text>
    </Flex>
  );
};

/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { useDAO } from 'contexts';

export const EmptyDelegatePool: React.FC = () => {
  const { theme } = useDAO();

  return (
    <Flex
      align="center"
      justify="center"
      w="full"
      gap={5}
      py={5}
      borderRadius="lg"
      border={`1px dashed ${theme.text}`}
    >
      <Flex>
        <Image src="/icons/add-delegate-user.svg" alt="add-user" />
      </Flex>
      <Box>
        <Text as="p" fontWeight="bold">
          Delegate to multiple users at once
        </Text>
        <Text as="p">Click "Delegate" on the list below to add them here</Text>
      </Box>
    </Flex>
  );
};

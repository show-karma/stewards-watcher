import React from 'react';
import { ImgWithFallback } from 'components';
import { Flex, Text, Icon, Skeleton } from '@chakra-ui/react';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { useGovernanceVotes } from 'contexts';

interface IVotesToDelegate {
  logoUrl?: string;
  daoName: string;
  votes: string;
}

export const VotesToDelegate: React.FC<IVotesToDelegate> = ({
  logoUrl,
  daoName,
  votes,
}) => {
  const { isLoadingVotes } = useGovernanceVotes();
  return (
    <Flex
      padding="16px 20px"
      border="1px solid #ebedf0"
      boxSizing="border-box"
      borderRadius="6px"
      position="relative"
      flexDirection="column"
    >
      <Text fontStyle="normal" fontWeight="700" fontSize="12px" color="#adb8c0">
        Votes to be delegated
      </Text>
      <Flex
        display="flex"
        flexDirection="row"
        gap="8px"
        marginTop="8px"
        alignItems="center"
      >
        <ImgWithFallback
          fallback={daoName}
          src={logoUrl}
          boxSize="20px"
          borderRadius="full"
        />
        {isLoadingVotes ? (
          <Skeleton height="24px" width="100px" bg="gray.100" />
        ) : (
          <Text
            fontStyle="normal"
            fontWeight="500"
            fontSize="20px"
            color="#000000"
          >{`${votes} ${daoName}`}</Text>
        )}
      </Flex>
      {(votes === '0' || !votes) && (
        <Flex
          background="rgba(244, 171, 104, 0.11)"
          borderRadius="4px"
          color="#ffa552"
          flexDirection="row"
          gap="8px"
          display="flex"
          position="absolute"
          top="12px"
          right="12px"
          padding="8px 12px"
          alignItems="center"
        >
          <Icon as={IoAlertCircleOutline} boxSize="20px" />
          <Text
            color="#ffa552"
            fontStyle="normal"
            fontWeight="700"
            fontSize="12px"
          >
            No tokens to delegate
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

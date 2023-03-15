import {
  Divider,
  Flex,
  Icon,
  Skeleton,
  SkeletonCircle,
  Text,
} from '@chakra-ui/react';
import {
  AbstainIcon,
  AgainstIcon,
  DidNotVoteIcon,
  EmptyCircleIcon,
  ForIcon,
} from 'components/Icons';
import { useDAO } from 'contexts';
import { useVoteReason } from 'hooks';
import { FC } from 'react';
import { IChainRow, IProfile } from 'types';
import { formatDate } from 'utils';
import { ExpandableReason } from './ExpandableReason';
import { ExpandableTitle } from './ExpandableTitle';

const iconStyle = {
  width: '1rem',
  height: '1rem',
};

const CheckDecision = (choice: string) => {
  const { theme } = useDAO();
  if (/not vote/gi.test(choice)) {
    return <Icon as={DidNotVoteIcon} color="#FFF7AE" {...iconStyle} />;
  }
  // eslint-disable-next-line react/destructuring-assignment
  const choiceLowerCase = choice.toLocaleLowerCase();
  if (choiceLowerCase.substring(0, 2) === 'no' || /agai+nst/gi.test(choice)) {
    return <Icon as={AgainstIcon} color="#CA4444" {...iconStyle} />;
  }
  if (/abstain/gi.test(choice))
    return <Icon as={AbstainIcon} color="#DFDFDF" {...iconStyle} />;

  return <Icon as={ForIcon} color="#02E2AC" {...iconStyle} />;
};

const VoteIcon: FC<{ vote: IChainRow }> = ({ vote }) => {
  const { theme } = useDAO();
  if (typeof vote === 'undefined')
    return <Icon as={DidNotVoteIcon} color="#FFF7AE" {...iconStyle} />;
  if (vote.voteMethod !== 'On-chain' && typeof vote.choice === 'string')
    return CheckDecision(vote.choice);
  if (vote.solution)
    return <Icon as={ForIcon} color="#02E2AC" {...iconStyle} />;
  switch (vote.choice) {
    case 0:
      return <Icon as={AgainstIcon} color="#CA4444" {...iconStyle} />;
    case 1:
      return <Icon as={ForIcon} color="#02E2AC" {...iconStyle} />;
    case 'DID NOT VOTE':
      return <Icon as={DidNotVoteIcon} color="#FFF7AE" {...iconStyle} />;
    default:
      return (
        <Icon
          as={EmptyCircleIcon}
          color={theme.modal.votingHistory.proposal.icons.abstain}
          {...iconStyle}
        />
      );
  }
};

interface IProposalVote {
  vote: IChainRow;
  isLoading?: boolean;
  profile: IProfile;
  isLast?: boolean;
  index: number;
}

export const ProposalVote: FC<IProposalVote> = ({
  vote,
  isLoading,
  profile,
  isLast,
  index,
}) => {
  const { theme } = useDAO();
  const { getVoteReason } = useVoteReason({ address: profile.address });

  const showChoice = () => {
    if (vote && typeof vote.choice === 'string') return vote.choice;
    switch (vote.choice) {
      case 0:
        return 'Against';
      case 1:
        return 'For';
      default:
        return 'Abstain';
    }
  };

  const isLoaded = !isLoading && vote;

  const voteReason = vote.voteId && getVoteReason(vote.voteId);

  const isPair = (index + 1) % 2 === 0;

  return (
    <Flex
      flexDir="column"
      w="full"
      bg={isPair ? `${theme.modal.background}40` : `${theme.modal.background}`}
      pt="5"
      pb={isLast ? '4' : '0'}
    >
      <Flex flexDir="row" w="full" align="center" px="4" gap="2">
        <Flex flexDir="column" w="full">
          {isLoaded ? (
            <ExpandableTitle text={vote.proposal} />
          ) : (
            <Skeleton isLoaded={isLoaded} w="300px" maxW="372" h="6" />
          )}
          <Flex flexDir="column">
            <Flex gap="3" pt="6">
              {isLoaded ? (
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color={theme.modal.votingHistory.proposal.type}
                >
                  {vote.voteMethod}
                </Text>
              ) : (
                <Skeleton isLoaded={isLoaded} w="full" maxW="240" h="4" />
              )}
              <Divider
                orientation="vertical"
                bgColor={theme.modal.votingHistory.proposal.verticalDivider}
                w="1px"
                h="4"
              />
              {isLoaded ? (
                <Text
                  fontSize="xs"
                  fontWeight="medium"
                  color={theme.modal.votingHistory.proposal.type}
                >
                  Executed {vote && formatDate(vote.executed, 'MMMM D, YYYY')}
                </Text>
              ) : (
                <Skeleton isLoaded={isLoaded} w="full" maxW="160" h="4" />
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex
          h="max-content"
          maxW={{ base: 'fit-content', sm: '25%' }}
          w={{ base: 'fit-content', sm: 'full' }}
          align="center"
          justify="center"
          gap="2"
          flexDir="column"
        >
          {isLoaded && vote ? (
            <VoteIcon vote={vote} />
          ) : (
            <SkeletonCircle {...iconStyle} />
          )}
          {isLoaded ? (
            <Text
              w="fit-content"
              h="max-content"
              fontWeight="bold"
              fontSize="sm"
              color={theme.modal.votingHistory.proposal.result}
              maxH="70px"
              overflow="hidden"
              textAlign="center"
            >
              {showChoice()}
            </Text>
          ) : (
            <Skeleton w="32" h="4" />
          )}
        </Flex>
      </Flex>
      {!isLast && (
        <Divider
          bgColor={`${theme.modal.votingHistory.reason.divider}0D`}
          mt="4"
          h="1px"
        />
      )}

      {voteReason && (
        <Flex flexDir="column" mt="1" mb="4">
          <ExpandableReason text={voteReason} />

          <Divider
            bgColor={theme.modal.votingHistory.reason.divider}
            mt="4"
            h="1px"
          />
        </Flex>
      )}
    </Flex>
  );
};

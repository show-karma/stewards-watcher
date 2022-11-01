import {
  Divider,
  Flex,
  Icon,
  Skeleton,
  SkeletonCircle,
  Text,
} from '@chakra-ui/react';
import { CheckIcon, EmptyCircleIcon, XMarkIcon } from 'components/Icons';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { IChainRow } from 'types';
import { formatDate } from 'utils';

const iconStyle = {
  width: '1.75rem',
  height: '1.75rem',
};

const CheckDecision = (choice: string) => {
  const { theme } = useDAO();
  if (/not vote/gi.test(choice)) {
    return (
      <Icon
        as={EmptyCircleIcon}
        color={theme.modal.votingHistory.proposal.icons.notVoted}
        {...iconStyle}
      />
    );
  }
  // eslint-disable-next-line react/destructuring-assignment
  const choiceLowerCase = choice.toLocaleLowerCase();
  if (choiceLowerCase.substring(0, 2) === 'no' || /agai+nst/gi.test(choice)) {
    return (
      <Icon
        as={XMarkIcon}
        color={theme.modal.votingHistory.proposal.icons.against}
        {...iconStyle}
      />
    );
  }
  if (/abstain/gi.test(choice))
    return (
      <Icon
        as={EmptyCircleIcon}
        color={theme.modal.votingHistory.proposal.icons.abstain}
        {...iconStyle}
      />
    );

  return (
    <Icon
      as={CheckIcon}
      color={theme.modal.votingHistory.proposal.icons.for}
      {...iconStyle}
    />
  );
};

const VoteIcon: FC<{ vote: IChainRow }> = ({ vote }) => {
  const { theme } = useDAO();
  if (typeof vote === 'undefined')
    return (
      <Icon
        as={EmptyCircleIcon}
        color={theme.modal.votingHistory.proposal.icons.notVoted}
        {...iconStyle}
      />
    );
  if (vote.voteMethod !== 'On-chain' && typeof vote.choice === 'string')
    return CheckDecision(vote.choice);
  if (vote.solution)
    return (
      <Icon
        as={CheckIcon}
        color={theme.modal.votingHistory.proposal.icons.for}
        {...iconStyle}
      />
    );
  switch (vote.choice) {
    case 0:
      return (
        <Icon
          as={XMarkIcon}
          color={theme.modal.votingHistory.proposal.icons.against}
          {...iconStyle}
        />
      );
    case 1:
      return (
        <Icon
          as={CheckIcon}
          color={theme.modal.votingHistory.proposal.icons.for}
          {...iconStyle}
        />
      );
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

export const ProposalVote: FC<{ vote?: IChainRow; isLoading?: boolean }> = ({
  vote,
  isLoading,
}) => {
  const { theme } = useDAO();

  const showChoice = () => {
    if (vote && typeof vote.choice === 'string') return vote.choice;
    switch (vote?.choice) {
      case 0:
        return 'Against';
      case 1:
        return 'For';
      default:
        return 'Abstain';
    }
  };

  const isLoaded = !isLoading && vote;

  return (
    <Flex flexDir="column" w="full">
      <Flex flexDir="row" w="full">
        <Flex flexDir="column" w="full">
          {isLoaded ? (
            <Text
              maxW="372"
              fontSize="sm"
              fontWeight="medium"
              textAlign="left"
              color={theme.modal.votingHistory.proposal.title}
            >
              {vote?.proposal}
            </Text>
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
                  {vote?.voteMethod}
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
          w="max-content"
          align="center"
          justify="center"
          gap="2"
        >
          {isLoaded && vote ? (
            <VoteIcon vote={vote} />
          ) : (
            <SkeletonCircle {...iconStyle} />
          )}
          {isLoaded ? (
            <Text
              w="max-content"
              h="max-content"
              fontWeight="bold"
              fontSize="md"
              color={theme.modal.votingHistory.proposal.result}
            >
              {showChoice()}
            </Text>
          ) : (
            <Skeleton w="32" h="4" />
          )}
        </Flex>
      </Flex>
      <Divider
        bgColor={theme.modal.votingHistory.proposal.divider}
        my="3"
        h="1px"
      />
      {vote?.solution && (
        <Flex flexDir="column" mt="1" mb="4">
          <Flex flexDir="column" gap="2.5">
            <Text fontSize="sm" color={theme.modal.votingHistory.reason.title}>
              Reason
            </Text>
            <Text fontSize="sm" color={theme.modal.votingHistory.reason.text}>
              {vote.solution}
            </Text>
          </Flex>
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

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
  DidNotVoteIcon,
  EmptyCircleIcon,
  VoteAgainstIcon,
  VoteForIcon,
} from 'components/Icons';
import { useDAO } from 'contexts';
import { useVoteReason } from 'hooks';
import { FC } from 'react';
import { IChainRow, IDAOTheme } from 'types';
import { checkDecision, formatDate } from 'utils';
import { ExpandableReason } from './ExpandableReason';
import { ExpandableTitle } from './ExpandableTitle';

const iconStyle = {
  width: '16px',
  height: '16px',
};

const CheckDecision = (choice: string) => {
  const { theme } = useDAO();
  if (/not vote/gi.test(choice)) {
    return (
      <Icon
        as={DidNotVoteIcon}
        color={
          theme.tokenHolders.delegations.card.columns.voting.proposals.vote
            .notVoted
        }
        {...iconStyle}
      />
    );
  }
  // eslint-disable-next-line react/destructuring-assignment
  const choiceLowerCase = choice.toLocaleLowerCase();
  if (
    choiceLowerCase.substring(0, 2) === 'no' ||
    /agai+nst/gi.test(choice) ||
    choiceLowerCase.substring(0, 3) === 'nay' ||
    choiceLowerCase.substring(0, 3) === 'nae'
  ) {
    return (
      <Icon
        as={VoteAgainstIcon}
        color={
          theme.tokenHolders.delegations.card.columns.voting.proposals.vote
            .against
        }
        {...iconStyle}
      />
    );
  }
  if (/abstain/gi.test(choice))
    return (
      <Icon
        as={AbstainIcon}
        color={
          theme.tokenHolders.delegations.card.columns.voting.proposals.vote
            .abstain
        }
        {...iconStyle}
      />
    );

  return (
    <Icon
      as={VoteForIcon}
      color={
        theme.tokenHolders.delegations.card.columns.voting.proposals.vote.for
      }
      {...iconStyle}
    />
  );
};

const colorDecision = (vote: IChainRow, theme: IDAOTheme) => {
  if (typeof vote === 'undefined')
    return theme.tokenHolders.delegations.card.columns.voting.proposals.vote
      .notVoted;
  if (vote.voteMethod !== 'On-chain' && typeof vote.choice === 'string') {
    const { choice } = vote;
    if (/not vote/gi.test(choice)) {
      return theme.tokenHolders.delegations.card.columns.voting.proposals.vote
        .notVoted;
    }
    // eslint-disable-next-line react/destructuring-assignment
    const choiceLowerCase = choice.toLocaleLowerCase();
    if (
      choiceLowerCase.substring(0, 2) === 'no' ||
      /agai+nst/gi.test(choice) ||
      choiceLowerCase.substring(0, 3) === 'nay' ||
      choiceLowerCase.substring(0, 3) === 'nae'
    ) {
      return theme.tokenHolders.delegations.card.columns.voting.proposals.vote
        .against;
    }
    if (/abstain/gi.test(choice))
      return theme.tokenHolders.delegations.card.columns.voting.proposals.vote
        .abstain;

    return theme.tokenHolders.delegations.card.columns.voting.proposals.vote
      .for;
  }
  if (vote.solution)
    return theme.tokenHolders.delegations.card.columns.voting.proposals.vote
      .for;
  switch (vote.choice) {
    case 0:
      return theme.tokenHolders.delegations.card.columns.voting.proposals.vote
        .against;
    case 1:
      return theme.tokenHolders.delegations.card.columns.voting.proposals.vote
        .for;
    case 'DID NOT VOTE':
      return theme.tokenHolders.delegations.card.columns.voting.proposals.vote
        .notVoted;
    default:
      return theme.tokenHolders.delegations.card.columns.voting.proposals.vote
        .abstain;
  }
};
const VoteIcon: FC<{ vote: IChainRow }> = ({ vote }) => {
  const { theme } = useDAO();
  if (typeof vote === 'undefined')
    return (
      <Icon
        as={DidNotVoteIcon}
        color={
          theme.tokenHolders.delegations.card.columns.voting.proposals.vote
            .notVoted
        }
        {...iconStyle}
      />
    );
  if (vote.voteMethod !== 'On-chain' && typeof vote.choice === 'string')
    return CheckDecision(vote.choice);
  if (vote.solution)
    return (
      <Icon
        as={VoteForIcon}
        color={
          theme.tokenHolders.delegations.card.columns.voting.proposals.vote.for
        }
        {...iconStyle}
      />
    );
  switch (vote.choice) {
    case 0:
      return (
        <Icon
          as={VoteAgainstIcon}
          color={
            theme.tokenHolders.delegations.card.columns.voting.proposals.vote
              .against
          }
          {...iconStyle}
        />
      );
    case 1:
      return (
        <Icon
          as={VoteForIcon}
          color={
            theme.tokenHolders.delegations.card.columns.voting.proposals.vote
              .for
          }
          {...iconStyle}
        />
      );
    case 'DID NOT VOTE':
      return (
        <Icon
          as={DidNotVoteIcon}
          color={
            theme.tokenHolders.delegations.card.columns.voting.proposals.vote
              .notVoted
          }
          {...iconStyle}
        />
      );
    default:
      return (
        <Icon
          as={EmptyCircleIcon}
          color={
            theme.tokenHolders.delegations.card.columns.voting.proposals.vote
              .abstain
          }
          {...iconStyle}
        />
      );
  }
};

interface IProposalVote {
  vote: IChainRow;
  isLoading?: boolean;
  address: string;
  isLast?: boolean;
  index: number;
}

export const ProposalVote: FC<IProposalVote> = ({
  vote,
  isLoading,
  address,
  isLast,
  index,
}) => {
  const { theme } = useDAO();
  const { getVoteReason } = useVoteReason({ address });

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

  const isSimpleVote =
    showChoice() === 'DID NOT VOTE' ||
    showChoice().split(' ').length === 1 ||
    showChoice().split(' ')[1].length === 0;

  const voteBg: { [key: string]: string } = {
    ABSTAIN: '#F5F5F5',
    FOR: '#E1F6EA',
    AGAINST: '#FFF3F3',
    NOTVOTED: '#F5F5F5',
  };

  return (
    <Flex
      flexDir="column"
      w="full"
      bg="transparent"
      pt="5"
      pb={isLast ? '4' : '0'}
    >
      <Flex flexDir="row" w="full" align="center" gap="2">
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
                  fontSize="sm"
                  fontWeight="400"
                  color={
                    theme.tokenHolders.delegations.card.columns.voting.proposals
                      .description
                  }
                >
                  {vote.voteMethod}
                </Text>
              ) : (
                <Skeleton isLoaded={isLoaded} w="full" maxW="240" h="4" />
              )}
              <Divider
                orientation="vertical"
                bgColor={
                  theme.tokenHolders.delegations.card.columns.voting.proposals
                    .description
                }
                w="1px"
                h="4"
              />
              {isLoaded ? (
                <Text
                  fontSize="sm"
                  fontWeight="400"
                  color={
                    theme.tokenHolders.delegations.card.columns.voting.proposals
                      .description
                  }
                >
                  Executed {vote && formatDate(vote.executed, 'MMMM D, YYYY')}
                </Text>
              ) : (
                <Skeleton isLoaded={isLoaded} w="full" maxW="160" h="4" />
              )}
            </Flex>
          </Flex>
        </Flex>
        {isSimpleVote ? (
          <Flex
            h="max-content"
            maxW={{ base: 'fit-content', sm: '25%' }}
            w={{ base: 'fit-content', sm: 'full' }}
            align="center"
            justify="center"
            flexDir="column"
          >
            {isLoaded && vote ? (
              <Flex
                background={voteBg[checkDecision(vote)]}
                paddingX="3"
                paddingY="2"
                borderRadius="20px"
                align="center"
                justify="center"
                gap="2"
              >
                <VoteIcon vote={vote} />
                <Text
                  w="fit-content"
                  h="max-content"
                  fontWeight="700"
                  fontSize={{ base: 'xs', md: 'sm' }}
                  color={colorDecision(vote, theme)}
                  maxH="70px"
                  overflow="hidden"
                  textAlign="center"
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    maxWidth: '110px',
                  }}
                >
                  {showChoice()}
                </Text>
              </Flex>
            ) : (
              <SkeletonCircle {...iconStyle} />
            )}
          </Flex>
        ) : (
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
              <Flex
                background={voteBg[checkDecision(vote)]}
                paddingX="3"
                paddingY="2"
                borderRadius="20px"
              >
                <VoteIcon vote={vote} />
              </Flex>
            ) : (
              <SkeletonCircle {...iconStyle} />
            )}
            {isLoaded ? (
              <Text
                w="fit-content"
                h="max-content"
                fontWeight="normal"
                fontSize={{ base: 'xs', md: 'sm' }}
                color={
                  theme.tokenHolders.delegations.card.columns.voting.proposals
                    .vote.text
                }
                maxH="70px"
                overflow="hidden"
                textAlign="center"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  maxWidth: '120px',
                }}
              >
                {showChoice()}
              </Text>
            ) : (
              <Skeleton w="32" h="4" />
            )}
          </Flex>
        )}
      </Flex>
      {!isLast && (
        <Divider
          bgColor={`${theme.tokenHolders.delegations.card.columns.voting.proposals.vote.divider}`}
          mt="4"
          h="1px"
        />
      )}

      {voteReason && (
        <Flex flexDir="column" mt="1" mb="4">
          <ExpandableReason text={voteReason} />

          <Divider
            bgColor={`${theme.tokenHolders.delegations.card.columns.voting.proposals.vote.divider}`}
            mt="4"
            h="1px"
          />
        </Flex>
      )}
    </Flex>
  );
};

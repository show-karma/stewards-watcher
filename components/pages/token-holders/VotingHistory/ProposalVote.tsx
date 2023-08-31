/* eslint-disable no-nested-ternary */
import {
  Divider,
  Flex,
  Icon,
  Link,
  Skeleton,
  SkeletonCircle,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import {
  AbstainIcon,
  DidNotVoteIcon,
  EmptyCircleIcon,
  VoteAgainstIcon,
  VoteForIcon,
} from 'components/Icons';
import { useDAO, useDelegates } from 'contexts';
import { useVoteReason } from 'hooks';
import { FC } from 'react';
import { IChainRow } from 'types';
import { checkDecision, formatDate } from 'utils';
import { ExpandableReason } from './ExpandableReason';
import { ExpandableTitle } from './ExpandableTitle';

const iconStyle = {
  width: '16px',
  height: '16px',
};

const voteBg: { [key: string]: string } = {
  ABSTAIN: '#FFF2E2',
  FOR: '#E1F6EA',
  AGAINST: '#FFF3F3',
  NOTYET: 'orange.50',
  NOTVOTED: '#F5F5F5',
};

const colors = {
  for: '#00BD62',
  against: '#E10000',
  abstain: '#E37423',
  notVoted: '#4F5D6C',
  multiple: 'green.300',
  notYet: 'orange.700',
};

const colorDecision = (vote: IChainRow) => {
  if (typeof vote === 'undefined') return colors.notVoted;
  if (vote.voteMethod !== 'On-chain' && typeof vote.choice === 'string') {
    const { choice } = vote;
    if (choice === 'Not voted yet') return colors.notYet;
    if (/not vote/gi.test(choice)) {
      return colors.notVoted;
    }
    // eslint-disable-next-line react/destructuring-assignment
    const choiceLowerCase = choice.toLocaleLowerCase();
    if (
      choiceLowerCase.substring(0, 2) === 'no' ||
      /agai+nst/gi.test(choice) ||
      choiceLowerCase.substring(0, 3) === 'nay' ||
      choiceLowerCase.substring(0, 3) === 'nae'
    ) {
      return colors.against;
    }
    if (/abstain/gi.test(choice)) return colors.abstain;

    return colors.for;
  }
  if (vote.solution) return colors.for;
  if (vote.choice === 0) return colors.against;
  if (vote.choice === 1) return colors.for;
  if (vote.choice === 'Not voted yet' || (vote.choice === -1 && !vote.finished))
    return colors.notYet;
  if (vote.choice === 'Did not vote') return colors.notVoted;
  if (vote.choice === 'ABSTAIN') return colors.abstain;

  return colors.notVoted;
};

const CheckDecision = (choice: string) => {
  const { colorMode } = useColorMode();

  if (choice === 'Not voted yet') {
    return (
      <Icon
        as={DidNotVoteIcon}
        color={colorMode === 'dark' ? voteBg.NOTYET : colors.notYet}
        {...iconStyle}
      />
    );
  }
  if (/not vote/gi.test(choice)) {
    return (
      <Icon
        as={DidNotVoteIcon}
        color={colorMode === 'dark' ? voteBg.NOTVOTED : colors.notVoted}
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
        color={colorMode === 'dark' ? voteBg.against : colors.against}
        {...iconStyle}
      />
    );
  }
  if (/abstain/gi.test(choice))
    return (
      <Icon
        as={AbstainIcon}
        color={colorMode === 'dark' ? voteBg.abstain : colors.abstain}
        {...iconStyle}
      />
    );

  return (
    <Icon
      as={VoteForIcon}
      color={colorMode === 'dark' ? voteBg.for : colors.for}
      {...iconStyle}
    />
  );
};

const VoteIcon: FC<{ vote: IChainRow }> = ({ vote }) => {
  const { colorMode } = useColorMode();
  if (typeof vote === 'undefined')
    return (
      <Icon
        as={DidNotVoteIcon}
        color={
          colorMode === 'dark'
            ? voteBg[checkDecision(vote)]
            : colorDecision(vote)
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
          colorMode === 'dark'
            ? voteBg[checkDecision(vote)]
            : colorDecision(vote)
        }
        {...iconStyle}
      />
    );
  if (vote.choice === 0)
    return (
      <Icon
        as={VoteAgainstIcon}
        color={
          colorMode === 'dark'
            ? voteBg[checkDecision(vote)]
            : colorDecision(vote)
        }
        {...iconStyle}
      />
    );
  if (vote.choice === 1)
    return (
      <Icon
        as={VoteForIcon}
        color={
          colorMode === 'dark'
            ? voteBg[checkDecision(vote)]
            : colorDecision(vote)
        }
        {...iconStyle}
      />
    );
  if ((vote.choice === -1 && !vote.finished) || vote.choice === 'Not voted yet')
    return (
      <Icon
        as={DidNotVoteIcon}
        color={
          colorMode === 'dark'
            ? voteBg[checkDecision(vote)]
            : colorDecision(vote)
        }
        {...iconStyle}
      />
    );
  if (vote.choice === 'Did not vote')
    return (
      <Icon
        as={DidNotVoteIcon}
        color={
          colorMode === 'dark'
            ? voteBg[checkDecision(vote)]
            : colorDecision(vote)
        }
        {...iconStyle}
      />
    );
  if (vote.choice === 'ABSTAIN')
    return (
      <Icon
        as={EmptyCircleIcon}
        color={
          colorMode === 'dark'
            ? voteBg[checkDecision(vote)]
            : colorDecision(vote)
        }
        {...iconStyle}
      />
    );
  return (
    <Icon
      as={DidNotVoteIcon}
      color={
        colorMode === 'dark' ? voteBg[checkDecision(vote)] : colorDecision(vote)
      }
      {...iconStyle}
    />
  );
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
  const { theme, daoInfo } = useDAO();
  const { tracks } = useDelegates();
  const { getVoteReason } = useVoteReason({ address });
  const { colorMode } = useColorMode();

  const showChoice = () => {
    if (vote && typeof vote.choice === 'string') return vote.choice;
    if (vote.choice === 0) return 'Against';
    if (vote.choice === 1) return 'For';
    if (vote.choice === 'ABSTAIN') return 'Abstain';
    if (vote.choice === -1 && !vote.finished) return 'Not voted yet';
    return 'Did not vote';
  };

  const isLoaded = !isLoading && vote;

  const voteReason = vote.voteId && getVoteReason(vote.voteId);

  const isSimpleVote =
    showChoice() === 'Did not vote' ||
    showChoice() === 'Not voted yet' ||
    showChoice().split(' ').length === 1 ||
    showChoice().split(' ')[1].length === 0;

  const foundTrack = tracks.find(
    track => track.id === vote?.trackId
  )?.displayName;

  console.log(vote);

  return (
    <Flex
      flexDir="column"
      w="full"
      bg="transparent"
      pt="5"
      pb={isLast ? '4' : '0'}
      key={+index}
    >
      <Flex flexDir="row" w="full" align="center" gap="2">
        <Flex flexDir="column" w="full">
          {daoInfo.config.DAO_CATEGORIES_TYPE === 'tracks' ? (
            isLoaded ? (
              <Flex
                gap="1"
                flexDir="row"
                borderBottomWidth="1px"
                borderBottomColor={
                  theme.tokenHolders.delegations.card.columns.voting.proposals
                    .title
                }
                pb="1"
                mb="1"
                flex="1"
              >
                {daoInfo.config.TRACKS_DICTIONARY &&
                foundTrack &&
                daoInfo.config.TRACKS_DICTIONARY[foundTrack] ? (
                  <Text
                    fontSize="md"
                    fontWeight="medium"
                    color={
                      theme.tokenHolders.delegations.card.columns.voting
                        .proposals.title
                    }
                  >
                    {daoInfo.config.TRACKS_DICTIONARY[foundTrack].emoji}
                  </Text>
                ) : null}
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  color={
                    theme.tokenHolders.delegations.card.columns.voting.proposals
                      .title
                  }
                >
                  {foundTrack || null}
                </Text>
              </Flex>
            ) : (
              <Skeleton isLoaded={isLoaded} w="32" h="6" />
            )
          ) : null}
          {isLoaded ? (
            <ExpandableTitle text={vote.proposal} />
          ) : (
            <Skeleton isLoaded={isLoaded} w="300px" maxW="372" h="6" />
          )}
          <Flex gap="3" pt="6" align="center">
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
            <Divider
              orientation="vertical"
              bgColor={theme.modal.votingHistory.proposal.verticalDivider}
              w="1px"
              h="4"
            />
            {((daoInfo.config.PROPOSAL_LINK?.onChain &&
              vote.voteMethod === 'On-chain') ||
              (daoInfo.config.PROPOSAL_LINK?.offChain &&
                vote.voteMethod === 'Off-chain')) &&
            vote?.voteId &&
            vote.version ? (
              <>
                <Divider
                  orientation="vertical"
                  bgColor={theme.modal.votingHistory.proposal.verticalDivider}
                  w="1px"
                  h="4"
                />
                <Link
                  href={daoInfo.config.PROPOSAL_LINK[
                    vote.voteMethod === 'On-chain' ? 'onChain' : 'offChain'
                  ]?.(vote.voteId, vote.version)}
                  isExternal
                  color="blue.400"
                  fontSize="sm"
                  borderBottomColor="blue.400"
                  borderBottomWidth="1px"
                  borderBottomStyle="solid"
                  _hover={{
                    borderBottomColor: 'blue.300',
                    borderBottomWidth: '1px',
                    borderBottomStyle: 'solid',
                  }}
                >
                  See proposal
                </Link>
              </>
            ) : null}
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
                background={
                  colorMode === 'dark'
                    ? colorDecision(vote)
                    : voteBg[checkDecision(vote)]
                }
                paddingX="3"
                paddingY="2"
                borderRadius="20px"
                align="center"
                justify="center"
                gap="2"
              >
                <VoteIcon vote={vote} />
                <Text
                  w="max-content"
                  h="max-content"
                  fontWeight="700"
                  fontSize={{ base: 'xs', md: 'sm' }}
                  color={
                    colorMode === 'dark'
                      ? voteBg[checkDecision(vote)]
                      : colorDecision(vote)
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
                background={
                  colorMode === 'dark'
                    ? colorDecision(vote)
                    : voteBg[checkDecision(vote)]
                }
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
          bgColor={
            theme.tokenHolders.delegations.card.columns.voting.proposals.vote
              .divider
          }
          mt="4"
          h="1px"
        />
      )}

      {voteReason && (
        <Flex flexDir="column" mt="1" mb="4">
          <ExpandableReason text={voteReason} />

          <Divider
            bgColor={
              theme.tokenHolders.delegations.card.columns.voting.proposals.vote
                .divider
            }
            mt="4"
            h="1px"
          />
        </Flex>
      )}
    </Flex>
  );
};

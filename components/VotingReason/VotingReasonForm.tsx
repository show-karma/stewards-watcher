import { Button, Flex, Spinner, Text } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { VotingReasonPayload } from 'utils/voting-reason/save-voting-reason';
import { useDAO } from 'contexts';
import { useToasty } from 'hooks';

export interface VotingReasonFormProps {
  proposalId: string;
  proposalTitle: string;
  source: VotingReasonPayload['source'];
  delegateAddress: string;
  onSubmit: (payload: VotingReasonPayload) => void;
  isLoading: boolean;
}

export const VotingReasonForm: React.FC<VotingReasonFormProps> = ({
  proposalId,
  proposalTitle,
  source,
  delegateAddress,
  onSubmit,
  isLoading,
}) => {
  const {
    daoInfo: {
      config: { DAO_TOKEN_CONTRACT },
    },
  } = useDAO();

  const { toast } = useToasty();

  const [form, setForm] = useState<VotingReasonPayload>({
    daoName: `${DAO_TOKEN_CONTRACT?.[0]?.contractAddress}_${DAO_TOKEN_CONTRACT?.[0]?.chain.id}`,
    delegateAddress,
    proposalId,
    source,
    title: proposalTitle,
    votingReason: '',
  });

  const maxCharReached = useMemo(
    () => form.votingReason.length > 1000,
    [form.votingReason]
  );

  const truncateTitle = (title: string, len = 70) => {
    if (title.length > len) return `${title.slice(0, len)}...`;
    return title;
  };

  return (
    <Flex maxW="500px">
      <form
        onSubmit={ev => {
          ev.preventDefault();
          if (maxCharReached)
            return toast({
              status: 'error',
              title: 'Error',
              description: `Max characters reached, please shorten your reason by ${
                form.votingReason.length - 1000
              } characters. `,
            });

          return onSubmit(form);
        }}
      >
        <Flex flexDir="column" gap="1">
          <Text>Proposal name: </Text>
          <Text fontWeight="bold" textOverflow="ellipsis" overflow="hidden">
            {truncateTitle(form.title)}
          </Text>
          <Flex
            maxW={{ base: '18rem', sm: 'full', lg: '30rem' }}
            minW={{ base: 'full', sm: '18rem', lg: '30rem' }}
            w="full"
            gap="4"
            flexDir="column"
            flex="1"
            mt={3}
          >
            <Text>
              Reason <small>(up to 1000 characters)</small>:{' '}
            </Text>
            <textarea
              readOnly={isLoading}
              style={{ padding: '10px', opacity: isLoading ? 0.5 : 1 }}
              rows={10}
              onChange={ev =>
                setForm(prev => ({ ...prev, votingReason: ev.target.value }))
              }
              maxLength={1000}
            >
              {form.votingReason}
            </textarea>
            <Text
              mt={-4}
              textAlign="right"
              color={maxCharReached ? 'red.400' : 'white'}
            >
              <small>
                {maxCharReached && 'Max characters reached: '}
                {form.votingReason.length}/1000
              </small>
            </Text>

            <Flex justifyContent="flex-end">
              <Button
                mt={3}
                type="submit"
                isDisabled={maxCharReached || isLoading}
              >
                {isLoading && <Spinner mr={5} />} Submit
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </form>
    </Flex>
  );
};

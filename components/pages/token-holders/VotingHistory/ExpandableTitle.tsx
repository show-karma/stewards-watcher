import { Flex, Text } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC, useState } from 'react';

interface IExpandableText {
  text: string;
  maxChars?: number;
}

export const ExpandableTitle: FC<IExpandableText> = props => {
  const { theme } = useDAO();

  const { text, maxChars = 48 } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleIsExpanded = () => setIsExpanded(!isExpanded);

  return (
    <Flex flexDir="column" gap="2.5">
      {text.length <= maxChars ? (
        <Text
          maxW="340"
          fontWeight="400"
          fontSize="14px"
          textAlign="left"
          color={
            theme.tokenHolders.delegations.card.columns.voting.proposals.title
          }
        >
          {text}
        </Text>
      ) : (
        <Flex flexDir="column" w="full">
          <Text
            maxW={{ base: '200', md: '340' }}
            fontWeight="400"
            fontSize="14px"
            textAlign="left"
            color={
              theme.tokenHolders.delegations.card.columns.voting.proposals.title
            }
            whiteSpace={isExpanded ? 'unset' : 'nowrap'}
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {isExpanded ? text : `${text.substring(0, maxChars)}... `}
            {isExpanded && <br />}
            <Flex
              as="span"
              onClick={toggleIsExpanded}
              cursor="pointer"
              color={
                theme.tokenHolders.delegations.card.columns.voting.proposals
                  .hyperlink
              }
              fontWeight="400"
              fontSize="14px"
              w="max-content"
              textDecoration="underline"
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </Flex>
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

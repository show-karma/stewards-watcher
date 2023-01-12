import { Button, Flex, Icon, Text, useMediaQuery } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC, useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface IExpandableText {
  text: string;
  maxChars?: number;
  maxCharsExpanded?: number;
  isExpanded: boolean;
  toggleIsExpanded: () => void;
}

export const ExpandableCardText: FC<IExpandableText> = props => {
  const { theme } = useDAO();
  const [isMobile] = useMediaQuery('(min-width: 425px)', {
    ssr: true,
    fallback: false,
  });

  const {
    text,
    maxChars = 80,
    maxCharsExpanded = 288,
    isExpanded,
    toggleIsExpanded,
  } = props;

  return (
    <Flex flexDir="column" gap="2.5" h="full">
      {text.length <= maxChars ? (
        <Text
          maxW="full"
          fontSize="sm"
          fontWeight="medium"
          textAlign="left"
          color={theme.text}
        >
          {text}
        </Text>
      ) : (
        <Flex flexDir="column" w="full">
          <Text
            maxW="full"
            fontSize="sm"
            fontWeight="normal"
            textAlign="left"
            color={theme.text}
            onClick={isExpanded ? toggleIsExpanded : undefined}
            _hover={{
              cursor: isExpanded ? 'pointer' : 'unset',
              opacity: isExpanded ? 0.9 : 'unset',
            }}
          >
            {isExpanded
              ? `${text.substring(0, maxCharsExpanded)}...`
              : `${text.substring(0, isMobile ? 128 : maxChars)}... `}
            <Text
              onClick={toggleIsExpanded}
              cursor="pointer"
              color={theme.card.text.primary}
              w="max-content"
              as="span"
              fontWeight="bold"
              _hover={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}
            >
              {!isExpanded && 'view statement'}
            </Text>
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

import { Flex, Text, useMediaQuery } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC, useMemo, useRef } from 'react';

interface IExpandableText {
  text: string;
  maxChars?: number;
  isExpanded: boolean;
  toggleIsExpanded: () => void;
  selectProfile: () => void;
}

export const ExpandableCardText: FC<IExpandableText> = props => {
  const { theme } = useDAO();
  const [isMobile] = useMediaQuery('(max-width: 425px)', {
    ssr: true,
    fallback: false,
  });

  const {
    text,
    maxChars = 78,
    isExpanded,
    toggleIsExpanded,
    selectProfile,
  } = props;

  const formattedText = text.replaceAll(/\s/g, '');

  const flexRef = useRef<HTMLDivElement>(null);

  const newMaxChars =
    flexRef.current && flexRef.current?.clientHeight > 50
      ? maxChars - 30
      : maxChars;

  return (
    <Flex flexDir="column" gap="2.5" h="full">
      {formattedText.length <= maxChars ? (
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
        <Flex flexDir="column" w="full" ref={flexRef}>
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
            flex="1"
          >
            {`${text.substring(0, isMobile ? 90 : newMaxChars)}... `}
            <Text
              onClick={selectProfile}
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
              view statement
            </Text>
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

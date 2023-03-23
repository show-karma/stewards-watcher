import { Flex, Skeleton, SkeletonText, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useDAO, useEditProfile } from 'contexts';
import { ICustomFields } from 'types';
import dynamic from 'next/dynamic';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { Sidebar } from '../Sidebar';
import { NoStatement } from './NoStatement';

interface ITextSection {
  statement?: ICustomFields;
}
const TextSection: FC<ITextSection> = ({ statement }) => {
  const { theme } = useDAO();

  const htmlFrom = (htmlString: string) => {
    const cleanHtmlString = DOMPurify.sanitize(htmlString, {
      USE_PROFILES: { html: true },
    });
    const html = parse(cleanHtmlString);
    return html;
  };
  return (
    <Flex
      maxW={{ base: 'full', lg: '30rem' }}
      gap="4"
      flexDir="column"
      flex="1"
      w="full"
      borderBottomRadius="md"
    >
      {statement && statement.value && (
        <Flex
          color={theme.modal.statement.text}
          fontWeight="light"
          fontSize="md"
          fontFamily="body"
          textAlign="left"
          whiteSpace="pre-line"
          flexDir="column"
          wordBreak="break-word"
          listStyleType="none"
          maxW={{ base: 'full', lg: '30rem' }}
          sx={{
            ol: {
              marginLeft: '32px',
            },
            // eslint-disable-next-line id-length
            a: {
              color: 'blue.400',
            },
            li: {
              marginLeft: '24px',
            },
            pre: {
              maxWidth: '30rem',
              wordWrap: 'break-word',
              whiteSpace: 'pre-line',
            },
          }}
        >
          {htmlFrom(statement.value as string)}
        </Flex>
      )}
    </Flex>
  );
};

interface IStatementCases {
  isLoading: boolean;
  isEditing: boolean;
  statement?: ICustomFields;
}

const EditStatement = dynamic(() => import('./EditStatement'), { ssr: false });

const StatementCases: FC<IStatementCases> = ({
  isEditing,
  isLoading,
  statement,
}) => {
  if (isLoading)
    return <SkeletonText w="full" mt="4" noOfLines={4} spacing="4" />;
  if (isEditing) return <EditStatement />;
  if (!statement || !statement?.value.length) return <NoStatement />;
  return <TextSection statement={statement} />;
};

export const Statement: FC = () => {
  const { theme } = useDAO();
  const { isEditing, statement, interests, isLoadingStatement } =
    useEditProfile();

  return (
    <Flex
      flexDir="column"
      gap="1"
      boxShadow={`0px 0px 18px 5px ${theme.modal.votingHistory.headline}0D`}
      px="4"
      py="4"
      mb="10"
      borderRightRadius="lg"
      borderBottomRadius="lg"
    >
      {isEditing && (
        <Flex flexDir="column" gap="1.5" mb={{ base: '5', lg: '5' }}>
          <Text
            fontSize={{ base: 'xl', lg: '2xl' }}
            fontWeight="medium"
            color={theme.modal.statement.sidebar.section}
          >
            Statement
          </Text>
          <Text
            fontSize={{ base: 'md', lg: 'lg' }}
            fontWeight="normal"
            color={theme.modal.statement.sidebar.item.border}
          >
            Add a statement explaining your intention for becoming a delegate
            and your skillset. This will help token holders determine if you are
            the right candidate to delegate their tokens to.
          </Text>
        </Flex>
      )}
      <Flex
        mb={{ base: '10', lg: '20' }}
        gap={{ base: '2rem', lg: '4rem' }}
        flexDir={{ base: 'column', lg: 'row' }}
        px="0"
      >
        <StatementCases
          isEditing={isEditing}
          isLoading={isLoadingStatement}
          statement={statement}
        />
        {isLoadingStatement ? (
          <Flex flexDir="column" w="full" maxW="40" gap="10">
            <Skeleton w="full" h="10" />
            <Skeleton w="full" h="10" />
          </Flex>
        ) : (
          <Sidebar isEditMode={isEditing} interests={interests} />
        )}
      </Flex>
    </Flex>
  );
};

import { Flex, Skeleton, SkeletonText, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useDAO, useEditStatement } from 'contexts';

import { ICustomFields, IProfile } from 'types';
import dynamic from 'next/dynamic';
import { Sidebar } from '../Sidebar';
import { NoStatement } from './NoStatement';

interface ITextSection {
  statement?: ICustomFields;
}
const TextSection: FC<ITextSection> = ({ statement }) => {
  const { theme } = useDAO();
  return (
    <Flex maxW="30rem" gap="4" flexDir="column" flex="1">
      {statement && statement.value && (
        <Flex flexDir="column">
          <Flex
            color={theme.modal.statement.text}
            fontWeight="light"
            fontSize="md"
            fontFamily="body"
            textAlign="left"
            whiteSpace="pre-line"
            dangerouslySetInnerHTML={{ __html: statement.value as string }}
            wordBreak="break-all"
            style={{ lineBreak: 'anywhere' }}
          />
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
  if (!statement?.value) return <NoStatement />;
  return <TextSection statement={statement} />;
};

export const Statement: FC = () => {
  const { theme } = useDAO();
  const { isEditing, statement, interests, isLoadingStatement } =
    useEditStatement();

  return (
    <Flex flexDir="column" gap="1">
      {(statement.value.length > 0 || isEditing) && (
        <Flex
          flexDir="column"
          gap="1.5"
          mt={{ base: '5', lg: '6' }}
          mb={{ base: '5', lg: '5' }}
        >
          <Text
            fontSize="2xl"
            fontWeight="medium"
            color={theme.modal.statement.sidebar.section}
          >
            Statement
          </Text>
          <Text
            fontSize="lg"
            fontWeight="normal"
            color={theme.modal.statement.sidebar.item.border}
          >
            Lorem ipsum dolor sit amet consectetur. Ut quis sed aliquam tortor
            sodales fermentum. Dapibus orolor porta etiam et eget erat
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

import {
  Box,
  Button,
  Flex,
  Skeleton,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { FC, useState } from 'react';
import { useDAO, useEditProfile } from 'contexts';
import { ICustomFields } from 'types';
import dynamic from 'next/dynamic';
import { convertHexToRGBA } from 'utils';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';
import { Sidebar } from '../Sidebar';
import { NoStatement } from './NoStatement';

// eslint-disable-next-line import/no-extraneous-dependencies
const MDPreview = dynamic(() => import('@uiw/react-markdown-preview'), {
  ssr: false,
});
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
          <MDPreview
            source={(statement.value as string) || ''}
            style={{
              backgroundColor: 'transparent',
              color: theme.modal.statement.text,
            }}
          />
          {/* {htmlFrom(statement.value)} */}
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

  const [savingStep, setSavingStep] = useState<0 | 1>(0);

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
          <Flex w="full" flexWrap="wrap">
            <Flex maxW={['100%', '100%', '50%']} gap="10">
              <Text
                fontSize={{ base: 'md', lg: 'lg' }}
                fontWeight="normal"
                color={theme.modal.statement.sidebar.item.border}
              >
                Add a statement explaining your intention for becoming a
                delegate and your skillset. This will help token holders
                determine if you are the right candidate to delegate their
                tokens to.
              </Text>
            </Flex>

            <Flex
              justifyContent="center"
              mb={12}
              w="full"
              maxW={['100%', '100%', '50%']}
              mt={['5', '5', '0']}
            >
              <Button
                background={theme.branding}
                px={['4', '6']}
                py={['3', '6']}
                h="10"
                fontSize={['md']}
                fontWeight="medium"
                onClick={() => setSavingStep(1)}
                _hover={{
                  backgroundColor: convertHexToRGBA(theme.branding, 0.8),
                }}
                _focus={{}}
                _active={{}}
                color={theme.buttonText}
              >
                <Flex gap="2" align="center">
                  Save profile
                </Flex>
              </Button>
            </Flex>
          </Flex>
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

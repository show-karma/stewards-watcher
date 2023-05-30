import { Flex, SkeletonText, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useDAO, useEditProfile } from 'contexts';
import dynamic from 'next/dynamic';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

interface ITextSection {
  delegateToA: any;
}

const TextSection: FC<ITextSection> = ({ delegateToA }) => {
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
      {delegateToA && (
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
          {htmlFrom(delegateToA as string)}
        </Flex>
      )}
    </Flex>
  );
};

interface ITermsofAgreementCases {
  isLoading: boolean;
  isEditing: boolean;
  delegateToA?: string;
}

const EditToA = dynamic(() => import('./EditToA'), { ssr: false });

const TermsofAgreementCases: FC<ITermsofAgreementCases> = ({
  isEditing,
  isLoading,
  delegateToA,
}) => {
  if (isLoading)
    return <SkeletonText w="full" mt="4" noOfLines={4} spacing="4" />;
  if (isEditing) return <EditToA />;
  return <TextSection delegateToA={delegateToA} />;
};

export const ToA: FC = () => {
  const { theme, daoInfo } = useDAO();
  const { isEditing, delegateToA, isLoadingToA } = useEditProfile();

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
            Delegation Agreement
          </Text>
          <Text
            fontSize={{ base: 'md', lg: 'lg' }}
            fontWeight="normal"
            color={theme.modal.statement.sidebar.item.border}
          >
            Add a delegation agreement for people who delegate to you. This is
            optional.
          </Text>
        </Flex>
      )}
      <Flex
        mb={{ base: '10', lg: '20' }}
        gap={{ base: '2rem', lg: '4rem' }}
        flexDir={{ base: 'column', lg: 'row' }}
        px="0"
      >
        <TermsofAgreementCases
          isEditing={isEditing}
          isLoading={isLoadingToA}
          delegateToA={delegateToA || daoInfo.config.DEFAULT_TOA}
        />
      </Flex>
    </Flex>
  );
};

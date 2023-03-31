import { Flex, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useDAO } from 'contexts';
import { IProfile } from 'types';

interface ITextSection {
  text?: string;
}
const TextSection: FC<ITextSection> = ({ text }) => {
  const { theme } = useDAO();

  return (
    <Flex maxW="30rem" gap="4" flexDir="column" flex="1">
      {text ? (
        <Text
          color={theme.modal.statement.text}
          fontWeight="light"
          fontSize="md"
          fontFamily="body"
          textAlign="left"
          whiteSpace="pre-line"
        >
          {text}
        </Text>
      ) : (
        <Text
          color={theme.modal.statement.text}
          fontWeight="light"
          fontSize="md"
          fontFamily="body"
          textAlign="left"
          whiteSpace="pre-line"
        >
          {`This user doesn't have an About section yet`}
        </Text>
      )}
    </Flex>
  );
};

interface IStatement {
  profile: IProfile;
}

export const AboutMe: FC<IStatement> = ({ profile }) => {
  const { theme } = useDAO();
  return (
    <Flex
      py="4"
      gap={{ base: '2rem', lg: '4rem' }}
      flexDir={{ base: 'column', lg: 'row' }}
      mb="10"
      boxShadow={`0px 0px 18px 5px ${theme.modal.votingHistory.headline}0D`}
      px="4"
    >
      <TextSection text={profile.aboutMe} />
    </Flex>
  );
};

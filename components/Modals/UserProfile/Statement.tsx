import {
  ComponentWithAs,
  Flex,
  Icon,
  IconProps,
  Link,
  Skeleton,
  SkeletonText,
  Text,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { useDAO } from 'contexts';
import { RiExternalLinkLine } from 'react-icons/ri';
import { axiosInstance, truncateAddress } from 'utils';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { IconType } from 'react-icons';
import { ICustomFields, IProfile } from 'types';
import { useQuery } from '@tanstack/react-query';

interface ITextSection {
  statement?: ICustomFields[];
}
const TextSection: FC<ITextSection> = ({ statement }) => {
  const { theme } = useDAO();
  return (
    <Flex maxW="30rem" gap="4" flexDir="column" flex="1">
      {statement && statement.length > 0 ? (
        statement.map((text, index) => (
          <Flex flexDir="column" key={+index}>
            {/* <Text
              color={theme.modal.statement.headline}
              fontWeight="semibold"
              fontSize="xl"
            >
              {text.label}
            </Text> */}
            <Text
              color={theme.modal.statement.text}
              fontWeight="light"
              fontSize="md"
              fontFamily="body"
              textAlign="left"
              whiteSpace="pre-line"
            >
              {text.value}
            </Text>
          </Flex>
        ))
      ) : (
        <Text
          color={theme.modal.statement.text}
          fontWeight="light"
          fontSize="md"
          fontFamily="body"
          textAlign="left"
          whiteSpace="pre-line"
        >
          {`We couldn't find the contributor statement`}
        </Text>
      )}
    </Flex>
  );
};

const SectionHeader: FC<{ children: ReactNode }> = ({ children }) => {
  const { theme } = useDAO();
  return (
    <Text color={theme.modal.statement.sidebar.section} fontWeight="semibold">
      {children}
    </Text>
  );
};

interface SectionItem {
  children: ReactNode;
  icon?: IconType | ComponentWithAs<'svg', IconProps>;
}

const SectionItem: FC<SectionItem> = ({ children, icon }) => {
  const { theme } = useDAO();
  return (
    <Flex
      flexDir="row"
      gap="2"
      borderColor={theme.modal.statement.sidebar.item.border}
      borderWidth="1px"
      borderRadius="30px"
      borderStyle="solid"
      w="max-content"
      align="center"
      px="4"
      py="3"
    >
      {icon && (
        <Icon as={icon} color={theme.modal.statement.sidebar.item.border} />
      )}
      <Text
        fontSize="xs"
        color={theme.modal.statement.sidebar.item.text}
        fontWeight="medium"
      >
        {children}
      </Text>
    </Flex>
  );
};

interface ISidebar {
  profile: IProfile;
  interests: ICustomFields;
  languages: ICustomFields;
}

const Sidebar: FC<ISidebar> = ({ profile, interests, languages }) => {
  const { theme } = useDAO();
  const { avatar } = profile;
  const links = [
    {
      address: profile.address,
      ensName: profile.ensName,
    },
  ];

  const languagesValueArray = languages.value as string[];
  const interestsValueArray = interests.value as string[];

  return (
    <Flex w={{ base: 'full', lg: '16.875rem' }}>
      <Flex flexDir="column" gap="10" w="full">
        {/* <Flex flexDir="column" gap="4">
          <SectionHeader>Links</SectionHeader>
          {links.map(({ address, ensName }, index) => (
            <Link isExternal key={+index} href="/" _hover={{}}>
              <Flex flexDir="row" gap="3" align="center">
                <ImgWithFallback
                  fallback={ensName || address}
                  src={avatar}
                  w="4"
                  h="4"
                  borderRadius="full"
                />
                <Text
                  color={theme.modal.statement.sidebar.section}
                  fontWeight="medium"
                  fontSize="sm"
                >
                  {ensName}
                </Text>
                <Text
                  color={theme.modal.statement.sidebar.text}
                  fontWeight="medium"
                  fontSize="sm"
                >
                  {truncateAddress(address)}
                </Text>
                <Icon
                  as={RiExternalLinkLine}
                  color={theme.modal.statement.sidebar.section}
                  w="11.5px"
                  h="11.5px"
                />
              </Flex>
            </Link>
          ))}
        </Flex> */}
        <Flex flexDir="column" gap="5">
          {languages && languagesValueArray.length > 0 && (
            <SectionHeader>Languages</SectionHeader>
          )}
          <Flex columnGap="1" rowGap="2" flexWrap="wrap">
            {languagesValueArray.map((language, index) => (
              <SectionItem key={+index}>{language}</SectionItem>
            ))}
          </Flex>
        </Flex>
        <Flex flexDir="column" gap="5">
          {interests && languages.value.length > 0 && (
            <SectionHeader>Interests</SectionHeader>
          )}
          <Flex columnGap="1" rowGap="2" flexWrap="wrap">
            {interestsValueArray.map((interest, index) => (
              <SectionItem key={+index}>
                {interest[0].toUpperCase() + interest.substring(1)}
              </SectionItem>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

interface IStatement {
  profile: IProfile;
}

export const Statement: FC<IStatement> = ({ profile }) => {
  const { daoInfo } = useDAO();
  const { DAO_KARMA_ID } = daoInfo.config;
  const { data, isLoading } = useQuery({
    queryKey: ['statement', profile.address],
    queryFn: () =>
      axiosInstance.get(
        `/forum-user/${DAO_KARMA_ID}/delegate-pitch/${profile.address}`
      ),
    retry: false,
  });

  const customFields: ICustomFields[] =
    data?.data.data.delegatePitch.customFields;
  const emptyField: ICustomFields = { label: '', value: [] };
  const languages =
    customFields?.find(item =>
      item.label.toLowerCase().includes('languages')
    ) || emptyField;
  const interests =
    customFields?.find(item =>
      item.label.toLowerCase().includes('interests')
    ) || emptyField;
  const statement =
    customFields?.filter(
      (item: { value: string | string[]; label: string }) =>
        typeof item.value === 'string' && item.value.length > 100
    ) || [];

  return (
    <Flex
      mt={{ base: '5', lg: '10' }}
      mb={{ base: '10', lg: '20' }}
      gap={{ base: '2rem', lg: '4rem' }}
      flexDir={{ base: 'column', lg: 'row' }}
      px="0"
    >
      {isLoading ? (
        <SkeletonText w="full" mt="4" noOfLines={4} spacing="4" />
      ) : (
        <TextSection statement={statement} />
      )}
      {isLoading ? (
        <Flex flexDir="column" w="full" maxW="40" gap="10">
          <Skeleton w="full" h="10" />
          <Skeleton w="full" h="10" />
        </Flex>
      ) : (
        <Sidebar
          profile={profile}
          languages={languages}
          interests={interests}
        />
      )}
    </Flex>
  );
};

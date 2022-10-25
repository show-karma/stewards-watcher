import {
  ComponentWithAs,
  Flex,
  Icon,
  IconProps,
  Img,
  Link,
  Text,
} from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { useDAO } from 'contexts';
import { RiExternalLinkLine } from 'react-icons/ri';
import { truncateAddress } from 'utils';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { JoystickIcon } from 'components/Icons';
import { IconType } from 'react-icons';

const TextSection = () => {
  const { theme } = useDAO();
  return (
    <Flex flexDir="column" maxW="30rem" gap="4">
      <Text
        color={theme.modal.statement.headline}
        fontWeight="semibold"
        fontSize="xl"
      >
        Headline
      </Text>
      <Text
        color={theme.modal.statement.text}
        fontWeight="light"
        fontSize="md"
        fontFamily="body"
        textAlign="left"
      >
        I want to further support the important work that Optimism is doing on
        scaling. I’m also passionate about public goods funding and governance
        experimentation. My view on the Optimistic Vision: I align strongly with
        the vision. I’m excited about the new model focused on optimizing for
        positive impact and providing retroactive incentives for public goods.
        My view on the first three articles of the Working Constitution: Agree,
        I think the collective should be open to experimentation and be dynamic
        in the early days as we grow and learn Agree, I’m supportive of checks
        and balances Agree, I’m glad to see the Optimism Foundation be a steward
        of the collective early on My skills and areas of expertise: product
        (previously product manager at Coinbase), governance (delegate for
        Gitcoin and Element DAO), writing / creating educational content,
        operations, strategy, DeFi (advisor of 0x and investor in many DeFi
        projects), investing (co-founder of crypto fund Scalar Capital)
      </Text>
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

const Sidebar = () => {
  const { theme } = useDAO();
  const links = [
    {
      address: '0x12345a54dsa6d54as454567890',
      ensName: 'lindajxe.eth',
    },
    {
      address: '0x12345613s21ad321sa32190',
      ensName: 'lindaj1xe.eth',
    },
  ];

  const languages = [
    'English',
    'Mandarian',
    'German',
    'Spanish',
    'French',
    'Italian',
  ];
  const interests = [
    'Accessibility',
    'DAO',
    'Defi',
    'Governance',
    'Economics',
    'Identity',
    'Privacy',
    'Social Impact',
  ];

  return (
    <Flex w="16.875rem">
      <Flex flexDir="column" gap="10" w="full">
        <Flex flexDir="column" gap="4">
          <SectionHeader>Links</SectionHeader>
          {links.map(({ address, ensName }, index) => (
            <Link isExternal key={+index} href="/" _hover={{}}>
              <Flex flexDir="row" gap="3" align="center">
                <ImgWithFallback
                  fallback={ensName || address}
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
        </Flex>
        <Flex flexDir="column" gap="5">
          <SectionHeader>Languages</SectionHeader>
          <Flex columnGap="1" rowGap="2" flexWrap="wrap">
            {languages.map((language, index) => (
              <SectionItem key={+index}>{language}</SectionItem>
            ))}
          </Flex>
        </Flex>
        <Flex flexDir="column" gap="5">
          <SectionHeader>Crypto Interests</SectionHeader>
          <Flex columnGap="1" rowGap="2" flexWrap="wrap">
            {interests.map((interest, index) => (
              <SectionItem icon={JoystickIcon} key={+index}>
                {interest}
              </SectionItem>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export const Statement: FC = () => (
  <Flex mt="10" mb="20" flexDir="row" gap="4rem">
    <TextSection />
    <Sidebar />
  </Flex>
);

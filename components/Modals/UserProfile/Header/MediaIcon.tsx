import {
  Button,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@chakra-ui/react';
import { useDAO, useHandles, useWallet } from 'contexts';
import { FC, ReactNode } from 'react';
import { IActiveTab, IProfile } from 'types';
import { getUserForumUrl, lessThanDays } from 'utils';

type IMedias = 'twitter' | 'forum' | 'discord';
interface IMediaIcon {
  profile: IProfile;
  media: IMedias;
  changeTab: (selectedTab: IActiveTab) => void;
  isSamePerson: boolean;
  children: ReactNode;
}

interface IMediasObj {
  [key: string]: {
    url: string;
    value?: string;
    disabledCondition?: boolean;
  };
}

export const MediaIcon: FC<IMediaIcon> = ({
  media,
  profile,
  changeTab,
  children,
  isSamePerson,
}) => {
  const { theme, daoData, daoInfo } = useDAO();

  const { isConnected } = useWallet();
  const { config } = daoInfo;
  const { twitterOnOpen, forumOnOpen } = useHandles();

  const medias: IMediasObj = {
    twitter: {
      url: `https://twitter.com/${profile.twitter}`,
      value: profile.twitter,
    },
    forum: {
      url:
        profile?.forumHandle &&
        daoData?.socialLinks.forum &&
        config.DAO_FORUM_TYPE
          ? getUserForumUrl(
              profile?.forumHandle,
              config.DAO_FORUM_TYPE,
              config.DAO_FORUM_URL || daoData?.socialLinks.forum
            )
          : '',
      value: profile.forumHandle,
      disabledCondition: !daoData?.forumTopicURL,
    },
    discord: {
      url: `https://discord.com/users/${profile.discordHandle}`,
      value: profile.discordUsername,
    },
  };

  const chosenMedia = medias[media];

  // TODO REFACTOR THIS ASAP
  const disabledCondition =
    chosenMedia?.disabledCondition ||
    daoInfo.config.SHOULD_NOT_SHOW === 'handles' ||
    !profile?.userCreatedAt ||
    (daoInfo.config.DAO_KARMA_ID === 'starknet' &&
      !!profile?.userCreatedAt &&
      lessThanDays(profile?.userCreatedAt, 100));

  // TODO TEMPORARY HIDE
  const hideTwitter = media === 'twitter';

  const labelTooltip = () => {
    if (media === 'discord' && chosenMedia.value) return chosenMedia.value;
    if (disabledCondition || hideTwitter) return '';
    if (isConnected) return `Update your ${media} handle now`;
    return `Login to update your ${media} handle`;
  };

  const handleClick = () => {
    if (!isSamePerson) return;
    changeTab('handles');
    const onOpens: { [key: string]: () => void } = {
      // TODO TEMPORARY DISABLED
      // twitter: twitterOnOpen,
      forum: forumOnOpen,
    };
    if (onOpens[media]) onOpens[media]();
  };

  if (chosenMedia.value) {
    if (media === 'discord')
      return (
        <Popover>
          <PopoverTrigger>
            <Button
              color={theme.card.socialMedia}
              _hover={{
                transform: 'scale(1.25)',
              }}
              h="max-content"
              w="min-content"
              minW="min-content"
              maxW="min-content"
              display="flex"
              alignItems="center"
              justifyContent="center"
              px="0"
              bg="transparent"
              _active={{}}
              _focus={{}}
              _focusWithin={{}}
            >
              {children}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            w="max-content"
            color={theme.card.interests.text}
            bg={theme.background}
          >
            <PopoverArrow
              color={theme.card.interests.text}
              bg={theme.background}
            />
            <PopoverBody>{chosenMedia.value}</PopoverBody>
          </PopoverContent>
        </Popover>
      );

    return (
      <Link
        href={chosenMedia.url}
        isExternal
        color={theme.card.socialMedia}
        opacity="1"
        _hover={{
          transform: 'scale(1.25)',
        }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        boxSize="6"
        px="0"
        py="0"
        minW="max-content"
      >
        {children}
      </Link>
    );
  }

  return (
    <Tooltip label={labelTooltip()} placement="top" hasArrow>
      <Button
        onClick={() => {
          if (disabledCondition) return;
          handleClick();
        }}
        px="0"
        py="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgColor="transparent"
        _active={{}}
        _focus={{}}
        _focusWithin={{}}
        _focusVisible={{}}
        color={theme.modal.header.title}
        opacity="0.25"
        _hover={{}}
        h="6"
        w="max-content"
        minW="max-content"
        cursor={isSamePerson ? 'pointer' : 'default'}
        isDisabled={disabledCondition}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

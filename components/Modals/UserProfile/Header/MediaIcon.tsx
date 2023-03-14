import { Button, Link, Tooltip } from '@chakra-ui/react';
import { useDAO, useHandles, useWallet } from 'contexts';
import { FC, ReactNode } from 'react';
import { IActiveTab, IProfile } from 'types';
import { getUserForumUrl } from 'utils';

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
      value: profile.discordHandle,
    },
  };
  const chosenMedia = medias[media];

  if (chosenMedia.value)
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

  const handleClick = () => {
    if (!isSamePerson) return;
    changeTab('handles');
    const onOpens: { [key: string]: () => void } = {
      twitter: twitterOnOpen,
      forum: forumOnOpen,
    };
    if (onOpens[media]) onOpens[media]();
  };

  return (
    <Tooltip
      label={
        isConnected
          ? `Update your ${media} handle now`
          : `Login to update your ${media} handle`
      }
      placement="top"
      hasArrow
    >
      <Button
        onClick={() => handleClick()}
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
        isDisabled={chosenMedia?.disabledCondition}
      >
        {children}
      </Button>
    </Tooltip>
  );
};

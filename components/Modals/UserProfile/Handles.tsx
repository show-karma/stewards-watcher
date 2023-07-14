import {
  Flex,
  Text,
  Icon,
  Button,
  Tooltip,
  Input,
  FormControl,
} from '@chakra-ui/react';
import {
  DiscordIcon,
  ForumIcon,
  TwitterIcon,
  ChakraLink,
  WebsiteIcon,
} from 'components';
import {
  useAuth,
  useDAO,
  useDelegates,
  useEditProfile,
  useHandles,
} from 'contexts';
import { FC, useState } from 'react';
import { lessThanDays } from 'utils';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dynamic from 'next/dynamic';
import { YOUTUBE_LINKS } from 'helpers';

const TwitterModal = dynamic(() =>
  import('../Linking/Twitter').then(module => module.TwitterModal)
);

const DiscourseModal = dynamic(() =>
  import('../Linking/Forum').then(module => module.DiscourseModal)
);

interface IHandleCasesProps {
  currentHandle?: string;
  disabledCondition?: boolean;
  action?: () => void;
  mediaName: string;
  canAdminEdit?: boolean;
  actionType: string;
}

const HandleCases: FC<IHandleCasesProps> = ({
  currentHandle,
  disabledCondition,
  action,
  mediaName,
  canAdminEdit,
  actionType,
}) => {
  const { theme, daoInfo } = useDAO();
  const { isDaoAdmin } = useAuth();
  const { isEditing, changeHandle } = useEditProfile();
  const [isLoading, setIsLoading] = useState(false);

  const simpleInputSchema = yup
    .object({
      handle: yup.string().required('Handle is required'),
    })
    .required();

  const websiteSchema = yup
    .object({
      handle: yup
        .string()
        .required('Handle is required')
        .url('Please enter a valid URL.'),
    })
    .required();

  type FormDataAdminEdit = yup.InferType<typeof simpleInputSchema>;
  type FormDataWebsiteEdit = yup.InferType<typeof websiteSchema>;

  const {
    register: registerSimpleInput,
    handleSubmit: handleSubmitSimpleInput,
    formState: {
      errors: errorsSimpleInput,
      isSubmitting: isSubmittingSimpleInput,
    },
  } = useForm<FormDataAdminEdit>({
    resolver: yupResolver(simpleInputSchema),
    defaultValues: {
      handle: currentHandle || '',
    },
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const {
    register: registerWebsite,
    handleSubmit: handleSubmitWebsite,
    formState: { errors: errorsWebsite, isSubmitting: isSubmittingWebsite },
  } = useForm<FormDataWebsiteEdit>({
    resolver: yupResolver(websiteSchema),
    defaultValues: {
      handle: currentHandle || '',
    },
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const onSubmitAdminEdit = (data: { handle: string }) => {
    const cleanNewHandle = data.handle.replace(/[|;$%@"<>()+,.]/g, '');
    if (!cleanNewHandle) return;
    setIsLoading(true);
    const media = mediaName.toLowerCase() as 'twitter' | 'forum';
    changeHandle(cleanNewHandle, media).finally(() => setIsLoading(false));
  };

  if (mediaName === 'Website') {
    const onSubmitWebsite = (data: { handle: string }) => {
      const cleanNewHandle = data.handle;
      if (!cleanNewHandle) return;
      setIsLoading(true);
      const media = mediaName.toLowerCase() as 'twitter' | 'forum' | 'website';
      changeHandle(cleanNewHandle, media).finally(() => setIsLoading(false));
    };

    return (
      <form onSubmit={handleSubmitWebsite(onSubmitWebsite)}>
        <FormControl isInvalid={!!errorsWebsite.handle}>
          <Flex flexDir="column" gap="1">
            <Flex flexDir="row" gap="4">
              <Input
                px="4"
                py="2"
                borderWidth="1px"
                borderColor={theme.modal.statement.sidebar.item}
                minW="60"
                maxW="60"
                w="max-content"
                {...registerWebsite('handle')}
              />
              <Button
                type="submit"
                isLoading={isSubmittingWebsite || isLoading}
                isDisabled={!!errorsWebsite.handle || isLoading}
                disabled={!!errorsWebsite.handle || isLoading}
              >
                Save
              </Button>
            </Flex>
            <Text color="red.200">{errorsWebsite.handle?.message}</Text>
          </Flex>
        </FormControl>
      </form>
    );
  }

  if ((isDaoAdmin && isEditing && canAdminEdit) || actionType === 'input')
    return (
      <form onSubmit={handleSubmitSimpleInput(onSubmitAdminEdit)}>
        <FormControl isInvalid={!!errorsSimpleInput.handle}>
          <Flex flexDir="column" gap="1">
            <Flex flexDir="row" gap="4">
              <Input
                px="4"
                py="2"
                borderWidth="1px"
                borderColor={theme.modal.statement.sidebar.item}
                minW="60"
                maxW="60"
                w="max-content"
                {...registerSimpleInput('handle')}
              />
              <Button
                type="submit"
                isLoading={isSubmittingSimpleInput || isLoading}
                isDisabled={!!errorsSimpleInput.handle || isLoading}
                disabled={!!errorsSimpleInput.handle || isLoading}
              >
                Save
              </Button>
            </Flex>
            <Text color="red.200">{errorsSimpleInput.handle?.message}</Text>
          </Flex>
        </FormControl>
      </form>
    );

  if (!currentHandle) {
    if (actionType === 'button')
      return (
        <Tooltip placement="top" hasArrow>
          <Button
            onClick={() => {
              if (disabledCondition) return;
              action?.();
            }}
            bgColor={theme.modal.buttons.navBg}
            color={theme.modal.buttons.navText}
            borderColor={theme.modal.buttons.navText}
            borderWidth="1px"
            borderStyle="solid"
            _hover={{
              opacity: 0.7,
            }}
            _disabled={{
              opacity: 0.4,
              cursor: 'not-allowed',
            }}
            _active={{}}
            _focus={{}}
            _focusVisible={{}}
            _focusWithin={{}}
            isDisabled={disabledCondition}
            disabled={disabledCondition}
          >
            Link your {mediaName} handle
          </Button>
        </Tooltip>
      );

    if (actionType === 'text' && mediaName === 'Discord') {
      return (
        <Flex align="center" h="100%" mt="2">
          <Text>
            To link your Discord, navigate to{' '}
            <ChakraLink
              href={daoInfo.config.DAO_DISCORD_CHANNEL}
              isExternal
              textDecoration="underline"
            >
              this
            </ChakraLink>{' '}
            channel and execute the command as shown{' '}
            <ChakraLink
              href={YOUTUBE_LINKS.DISCORD_LINKING}
              isExternal
              textDecoration="underline"
            >
              here
            </ChakraLink>
            .
          </Text>
        </Flex>
      );
    }
  }

  return (
    <Text
      px="4"
      py="2"
      borderWidth="1px"
      borderColor={theme.modal.statement.sidebar.item}
      minW="60"
      w="max-content"
    >
      {currentHandle}
    </Text>
  );
};

export const Handles: FC = () => {
  const { theme, daoData, daoInfo } = useDAO();
  const {
    twitterIsOpen,
    twitterOnOpen,
    twitterOnToggle,
    forumIsOpen,
    forumOnToggle,
    forumOnOpen,
    twitterOnClose,
    forumOnClose,
  } = useHandles();
  const { profileSelected } = useDelegates();
  // TODO enable when twitter come back

  // const checkProperties = (media: string) => {
  //   const properties =
  //     daoInfo.config.HANDLE_NOT_SHOW_CONDITIONS?.[media]?.requiredProperties;
  //   if (!properties) return false;
  //   const hasAllProperties = properties.find(
  //     property => Boolean(profileSelected[property]) === false
  //   );
  //   return !!hasAllProperties;
  // };

  // const notShowCondition = (media: string) =
  //   daoInfo.config.SHOULD_NOT_SHOW === 'handles' ||
  //     checkProperties(media) ||
  //     lessThanDays(
  //       profileSelected?.userCreatedAt,
  //       daoInfo.config.HANDLE_NOT_SHOW_CONDITIONS?.twitter?.minimalDays || 0
  //     );

  const notShowCondition = daoInfo.config.SHOULD_NOT_SHOW === 'handles';

  const socialMedias = [
    {
      icon: TwitterIcon,
      name: 'Twitter',
      disabledCondition: notShowCondition,
      // TODO TEMPORARY DISABLED
      // actionType: 'button',
      // action: () => {
      //   twitterOnOpen();
      // },
      handle: profileSelected?.twitterHandle
        ? `@${profileSelected?.twitterHandle}`
        : undefined,
      canAdminEdit: true,
      // TODO TEMPORARY DISABLED
      action: undefined,
      actionType: 'text',
      hideCondition: !profileSelected?.twitterHandle,
    },
    {
      icon: ForumIcon,
      name: 'Forum',
      actionType: 'button',
      disabledCondition: notShowCondition,
      hideCondition: !daoData?.forumTopicURL,
      action: () => {
        forumOnOpen();
      },
      handle: profileSelected?.discourseHandle,
      canAdminEdit: true,
    },
    {
      icon: DiscordIcon,
      name: 'Discord',
      action: undefined,
      actionType: 'text',
      hideCondition:
        !profileSelected?.discordUsername &&
        !daoInfo.config.DAO_DISCORD_CHANNEL,
      handle: profileSelected?.discordUsername
        ? `@${profileSelected?.discordUsername}`
        : undefined,
      canAdminEdit: true,
    },
    {
      icon: WebsiteIcon,
      name: 'Website',
      action: undefined,
      actionType: 'input',
      handle: profileSelected?.website ? profileSelected?.website : undefined,
      canAdminEdit: true,
    },
  ];

  return (
    <>
      <Flex
        flexDir="column"
        mb="10"
        boxShadow={`0px 0px 18px 5px ${theme.modal.votingHistory.headline}0D`}
        px="4"
        py="4"
        borderRightRadius="lg"
        borderBottomRadius="lg"
      >
        <Text
          fontSize="2xl"
          fontWeight="medium"
          color={theme.modal.statement.sidebar.section}
        >
          Handles
        </Text>
        <Text
          fontSize="lg"
          fontWeight="normal"
          color={theme.modal.statement.sidebar.item.border}
        >
          Link your social handles to your wallet by clicking the button below.
          Adding social handles adds more authenticity to your profile and helps
          us aggregate your activity on those platforms.
        </Text>
        <Flex flexDir="column" gap="4" py="6">
          {socialMedias.map(
            (media, index) =>
              !media.hideCondition && (
                <Flex
                  flexDir="row"
                  key={+index}
                  gap="2"
                  align="flex-start"
                  color={theme.modal.statement.sidebar.section}
                >
                  <Flex flexDir="row" gap="3" align="center" mt="2">
                    <Icon boxSize="6" as={media.icon} />
                    <Text fontSize="lg" fontWeight="medium" w="20" mr="6">
                      {media.name}
                    </Text>
                  </Flex>
                  <HandleCases
                    currentHandle={media.handle}
                    action={media.action}
                    disabledCondition={media.disabledCondition}
                    mediaName={media.name}
                    canAdminEdit={media.canAdminEdit}
                    actionType={media.actionType}
                  />
                </Flex>
              )
          )}
        </Flex>
      </Flex>
      {/* 
      TODO: TEMPORARY FIX
      <TwitterModal
        open={twitterIsOpen}
        handleModal={twitterOnToggle}
        onClose={twitterOnClose}
      /> */}
      {daoData?.forumTopicURL && (
        <DiscourseModal
          open={forumIsOpen}
          handleModal={forumOnToggle}
          onClose={forumOnClose}
        />
      )}
    </>
  );
};

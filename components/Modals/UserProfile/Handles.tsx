import {
  Flex,
  Text,
  Icon,
  Button,
  Tooltip,
  Input,
  FormControl,
} from '@chakra-ui/react';
import { DiscordIcon, ForumIcon, TwitterIcon } from 'components';
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
import { DiscourseModal, TwitterModal } from '../Linking';

interface IHandleCasesProps {
  currentHandle?: string;
  disabledCondition?: boolean;
  action: () => void;
  mediaName: string;
  canAdminEdit?: boolean;
}

const HandleCases: FC<IHandleCasesProps> = ({
  currentHandle,
  disabledCondition,
  action,
  mediaName,
  canAdminEdit,
}) => {
  const { theme } = useDAO();
  const { isDaoAdmin } = useAuth();
  const { isEditing, changeHandle } = useEditProfile();
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup
    .object({
      handle: yup.string().required('Handle is required'),
    })
    .required();
  type FormData = yup.InferType<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      handle: currentHandle || '',
    },
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const onSubmit = (data: { handle: string }) => {
    const cleanNewHandle = data.handle.replace(/[|;$%@"<>()+,.]/g, '');
    if (!cleanNewHandle) return;
    setIsLoading(true);
    const media = mediaName.toLowerCase() as 'twitter' | 'forum';
    changeHandle(cleanNewHandle, media).finally(() => setIsLoading(false));
  };

  if (isDaoAdmin && isEditing && canAdminEdit)
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={!!errors.handle}>
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
                {...register('handle')}
              />
              <Button
                type="submit"
                isLoading={isSubmitting || isLoading}
                isDisabled={!!errors.handle || isLoading}
                disabled={!!errors.handle || isLoading}
              >
                Save
              </Button>
            </Flex>
            <Text color="red.200">{errors.handle?.message}</Text>
          </Flex>
        </FormControl>
      </form>
    );

  if (!currentHandle)
    return (
      <Tooltip
        label={
          disabledCondition
            ? 'We are validating your address. Please check back in few days to verify your handle.'
            : ''
        }
        placement="top"
        hasArrow
      >
        <Button
          onClick={() => {
            if (disabledCondition) return;
            action();
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

  const notShowCondition =
    daoInfo.config.SHOULD_NOT_SHOW === 'handles' ||
    !profileSelected?.userCreatedAt ||
    (daoInfo.config.DAO_KARMA_ID === 'starknet' &&
      !!profileSelected?.userCreatedAt &&
      lessThanDays(profileSelected?.userCreatedAt, 100));

  const socialMedias = [
    {
      icon: TwitterIcon,
      name: 'Twitter',
      disabledCondition: notShowCondition,
      action: () => {
        twitterOnOpen();
      },
      handle: profileSelected?.twitterHandle
        ? `@${profileSelected?.twitterHandle}`
        : undefined,
      canAdminEdit: true,
    },
    {
      icon: ForumIcon,
      name: 'Forum',
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
      action: () => null,
      hideCondition: !profileSelected?.discordHandle,
      handle: profileSelected?.discordHandle
        ? `@${profileSelected?.discordHandle}`
        : undefined,
      canAdminEdit: false,
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
                  />
                </Flex>
              )
          )}
        </Flex>
      </Flex>
      <TwitterModal
        open={twitterIsOpen}
        handleModal={twitterOnToggle}
        onClose={twitterOnClose}
      />
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

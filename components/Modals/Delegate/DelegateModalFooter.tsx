/* eslint-disable no-nested-ternary */
import { FlexProps, Text, Flex, Button, Skeleton } from '@chakra-ui/react';
import { SubmitEmailInput } from 'components/Inputs/SubmitEmailInput';
import { useDAO, useDelegates } from 'contexts';
import { useToasty } from 'hooks';
import { useEffect, useState } from 'react';
import { IDelegate } from 'types';
import { getEndorsementsFromAddress, truncateAddress } from 'utils';
import { saveLeadEmail } from 'utils/sendLeadEmail';

export const DelegateModalFooter: React.FC<{
  flexProps?: FlexProps;
  delegateInfo?: IDelegate;
  publicAddress?: string;
  handleModal: () => void;
}> = ({ flexProps, delegateInfo, publicAddress, handleModal }) => {
  const [loading, setLoading] = useState(false);
  const [endorsementsNumber, setEndorsementsNumber] = useState(0);
  const { toast } = useToasty();
  const {
    daoInfo: {
      config: { DAO_KARMA_ID, DISABLE_EMAIL_INPUT },
    },
  } = useDAO();
  const { selectProfile } = useDelegates();

  const submit = async (email: string) => {
    if (!publicAddress) return;
    await saveLeadEmail({
      email,
      publicAddress,
      interest: {
        activator: delegateInfo?.address ? 'delegator' : 'rss',
        target: delegateInfo?.address || 'feed',
        daoName: DAO_KARMA_ID,
      },
    });

    toast({
      title: 'Thank you!',
    });
  };

  const getEndorsements = async () => {
    if (!delegateInfo?.address) return;
    setLoading(true);
    try {
      const endorsements = await getEndorsementsFromAddress(
        delegateInfo?.address,
        DAO_KARMA_ID
      );

      setEndorsementsNumber(endorsements.length);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEndorsements();
  }, [delegateInfo?.address]);

  return (
    <Flex bgColor="white" flexDirection="column">
      <Flex px="8" flexDirection="column" gap="2">
        <Skeleton isLoaded={!loading}>
          {endorsementsNumber > 0 ? (
            <Flex alignItems="center" flexDir="row" gap="2" flexWrap="wrap">
              <Text color="black" fontSize="14px">
                {delegateInfo?.realName ||
                  delegateInfo?.ensName ||
                  truncateAddress(delegateInfo?.address || '')}{' '}
                has endorsed these candidates. Consider delegating to one of
                them:{' '}
                <Button
                  p="0"
                  bg="transparent"
                  textDecor="underline"
                  _active={{}}
                  _focus={{}}
                  _focusVisible={{}}
                  _focusWithin={{}}
                  _hover={{ opacity: 0.8 }}
                  color="black"
                  fontSize="14px"
                  onClick={() => {
                    if (delegateInfo) {
                      handleModal();
                      selectProfile(delegateInfo, 'endorsements-given');
                    }
                  }}
                >
                  View candidates
                </Button>
                .
              </Text>
            </Flex>
          ) : null}
        </Skeleton>
      </Flex>
      {!DISABLE_EMAIL_INPUT && (
        <Flex
          bgColor="#EBEDF0"
          color="rgba(0,0,0,0.5)"
          fontSize={12}
          {...flexProps}
          flexDir="column"
          mx="6"
          mb="6"
          borderRadius="12px"
          p="5"
        >
          <Text
            as="p"
            display="flex"
            fontWeight="700"
            gap={2}
            color="#595A5E"
            mb="1"
          >
            Optional
          </Text>
          <SubmitEmailInput
            onSubmit={submit}
            flexProps={{ maxW: ['100%', '100%', '100%'], mb: '3' }}
          />
          <Text as="p">
            Give us your e-mail address and we’ll send you notifications
            regarding this delegate or other updates. We promise not to spam!
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

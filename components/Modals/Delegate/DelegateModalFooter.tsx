import { Box, FlexProps, Text, Icon, Flex } from '@chakra-ui/react';
import { SubmitEmailInput } from 'components/Inputs/SubmitEmailInput';
import { useDAO } from 'contexts';
import { useToasty } from 'hooks';
import { BsExclamationCircleFill } from 'react-icons/bs';
import { saveLeadEmail } from 'utils/sendLeadEmail';

export const DelegateModalFooter: React.FC<{
  flexProps?: FlexProps;
  delegateAddress?: string;
  publicAddress?: string;
}> = ({ flexProps, delegateAddress, publicAddress }) => {
  const { toast } = useToasty();
  const {
    daoInfo: {
      config: { DAO_KARMA_ID },
    },
  } = useDAO();

  const submit = async (email: string) => {
    if (!publicAddress) return;
    await saveLeadEmail({
      email,
      publicAddress,
      interest: {
        activator: delegateAddress ? 'delegator' : 'rss',
        target: delegateAddress || 'feed',
        daoName: DAO_KARMA_ID,
      },
    });

    toast({
      title: 'Thank you!',
    });
  };

  return (
    <Flex bgColor="white">
      <Flex
        bgColor="#EBEDF0"
        color="rgba(0,0,0,0.5)"
        fontSize={12}
        {...flexProps}
        boxRadius="12px"
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
          Give us your e-mail address and we’ll send you notifications regarding
          this delegate or other updates. We promise not to spam!
        </Text>
      </Flex>
    </Flex>
  );
};

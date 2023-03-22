import { Box, FlexProps, Text, Icon } from '@chakra-ui/react';
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
    <Box color="rgba(0,0,0,0.5)" fontSize={12} {...flexProps}>
      <Text as="p" display="flex" gap={2} mb={2}>
        <Icon
          color="rgba(0,0,0,0.15)"
          fontSize="18px"
          as={BsExclamationCircleFill}
        />{' '}
        Optional:
      </Text>

      <Text as="p">
        Give us your e-mail address and we’ll send you notifications regarding
        this delegate or other updates. We promise not to spam!
      </Text>
      <SubmitEmailInput
        onSubmit={submit}
        flexProps={{ maxW: ['100%', '100%', '60%'], mt: 5 }}
      />
    </Box>
  );
};

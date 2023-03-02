import { Flex, IconButton, Text, Icon, FlexProps, Box } from '@chakra-ui/react';
import { IoClose } from 'react-icons/io5';

export const DelegateModalHeader: React.FC<{
  handleModal: () => void;
  flexProps?: FlexProps;
  title?: string;
}> = ({ handleModal, flexProps, title = 'Delegate' }) => (
  <Flex
    gap="100px"
    alignItems="center"
    justifyContent="space-between"
    borderBottom="1px solid #dcdcdc"
    marginBottom={5}
    {...flexProps}
  >
    <Flex padding="16px 32px">
      <Text
        fontStyle="normal"
        fontWeight="700"
        fontSize="20px"
        color="#000000"
        width="100%"
      >
        {title}
      </Text>
    </Flex>
    <IconButton
      bgColor="transparent"
      aria-label="close"
      onClick={() => handleModal?.()}
      color="gray.500"
      mr={3}
    >
      <Icon as={IoClose} boxSize="6" />
    </IconButton>
  </Flex>
);

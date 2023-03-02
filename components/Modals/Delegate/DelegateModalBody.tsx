import { Flex, FlexProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export const DelegateModalBody: React.FC<{
  flexProps?: FlexProps;
  children: ReactNode;
}> = ({ flexProps, children }) => (
  <Flex
    fontWeight="500"
    fontSize="14px"
    color="#687785"
    flexDir="column"
    {...flexProps}
  >
    {children}
  </Flex>
);

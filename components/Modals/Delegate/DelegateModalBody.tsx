import { Flex, FlexProps, Text } from '@chakra-ui/react';
import { ImgWithFallback } from 'components/ImgWithFallback';
import makeBlockie from 'ethereum-blockies-base64';
import { ReactNode } from 'react';
import { IDelegate } from 'types';
import { ModalDelegateButton } from './ModalDelegateButton';
import { VotesToDelegate } from './VotesToDelegate';

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

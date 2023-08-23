import { Flex, Switch, Text, useDisclosure } from '@chakra-ui/react';
import { Proxy } from 'components/Modals/Proxy';
import { useProxy } from 'contexts';
import { FC } from 'react';

export const ProxySwitch: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { hasProxy, handleProxy } = useProxy();

  return (
    <>
      <Flex flexDir="row" gap="2" align="center">
        <Text>Use as Proxy</Text>
        <Switch
          defaultChecked={hasProxy}
          isChecked={hasProxy}
          onChange={() => {
            if (hasProxy) {
              handleProxy('');
            } else {
              onOpen?.();
            }
          }}
        />
      </Flex>
      <Proxy isOpen={isOpen} onClose={onClose} />
    </>
  );
};

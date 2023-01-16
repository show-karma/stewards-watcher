import {
  Button,
  ButtonProps,
  Icon,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { BsFillMoonFill, BsFillSunFill } from 'react-icons/bs';

export const ThemeButton: FC<ButtonProps> = props => {
  const { theme } = useDAO();
  const { toggleColorMode } = useColorMode();
  return (
    <Button
      onClick={toggleColorMode}
      _hover={{ opacity: 0.9 }}
      _active={{}}
      _focus={{}}
      _focusWithin={{}}
      bgColor="transparent"
      color={theme.themeIcon}
      border="1px solid #3E4247"
      px="2"
      py="2"
      borderRadius="4px"
      gap="2"
      {...props}
    >
      <Text display={{ base: 'unset', md: 'none' }}>Theme</Text>
      <Icon as={useColorModeValue(BsFillSunFill, BsFillMoonFill)} w="5" h="5" />
    </Button>
  );
};

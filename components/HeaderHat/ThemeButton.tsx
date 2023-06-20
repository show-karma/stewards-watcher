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
      border="1px solid"
      borderColor={useColorModeValue('#E6E6E6', '#3E4247')}
      px="15.5px"
      py="15.5px"
      borderRadius="4px"
      gap="2"
      minW="52px"
      minH="52px"
      fontSize={{ base: 'sm', lg: 'md' }}
      {...props}
    >
      <Text display={{ base: 'unset', md: 'none' }}>Theme</Text>
      <Icon as={useColorModeValue(BsFillMoonFill, BsFillSunFill)} w="5" h="5" />
    </Button>
  );
};

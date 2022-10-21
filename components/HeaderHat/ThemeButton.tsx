import {
  Button,
  ButtonProps,
  Icon,
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
      {...props}
    >
      <Icon as={useColorModeValue(BsFillMoonFill, BsFillSunFill)} w="5" h="5" />
    </Button>
  );
};

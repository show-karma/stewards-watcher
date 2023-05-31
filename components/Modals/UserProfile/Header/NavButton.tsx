import { Button, ButtonProps } from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC, ReactNode } from 'react';

interface INavButton extends ButtonProps {
  children: ReactNode;
  isActive: boolean;
}

export const NavButton: FC<INavButton> = ({ children, isActive, ...props }) => {
  const { theme } = useDAO();

  return (
    <Button
      bg={
        isActive ? theme.modal.buttons.navBg : `${theme.modal.buttons.navBg}80`
      }
      color={theme.modal.buttons.navText}
      borderBottomWidth="1px"
      borderBottomStyle="solid"
      borderBottomColor={
        isActive ? 'transparent' : `${theme.modal.buttons.navBorder}0D`
      }
      borderRadius="0"
      px="5"
      py="4"
      _hover={{
        bg: theme.modal.buttons.navBg,
        color: theme.modal.buttons.navText,
      }}
      fontSize={{ base: 'sm', lg: '15px' }}
      _focus={{}}
      _focusWithin={{}}
      _active={{}}
      w="max-content"
      minH="52px"
      minW="122px"
      maxW="max-content"
      {...props}
    >
      {children}
    </Button>
  );
};

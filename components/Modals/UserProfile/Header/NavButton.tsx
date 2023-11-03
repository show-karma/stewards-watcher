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
      // bg={
      //   isActive ? theme.modal.buttons.navBg : `${theme.modal.buttons.navBg}80`
      // }
      bg="transparent"
      color={isActive ? theme.branding : `${theme.modal.buttons.navText}40`}
      borderBottomWidth="2px"
      borderBottomStyle="solid"
      borderBottomColor={isActive ? theme.branding : 'transparent'}
      borderRadius="0"
      px="5"
      py="4"
      _hover={{
        color: theme.branding,
        borderBottomColor: theme.branding,
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

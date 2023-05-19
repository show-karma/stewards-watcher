import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC, ReactNode } from 'react';

interface IHeaderBurgerMenuProps {
  onClose: () => void;
  isOpen: boolean;
  children?: ReactNode;
}

export const HeaderBurgerMenu: FC<IHeaderBurgerMenuProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  const { theme } = useDAO();
  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent bg={theme.headerBg} bgSize="cover">
        <DrawerBody>{children}</DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

import {
  Button,
  Divider,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react';
import { DownChevron } from 'components/Icons';
import { useAuth, useDAO, useDelegates } from 'contexts';
import { FC } from 'react';
import { truncateAddress } from 'utils';
import { useAccount } from 'wagmi';

const LoginMenu = () => {
  const { theme } = useDAO();
  const { disconnect } = useAuth();
  const { address } = useAccount();
  const { searchProfileModal } = useDelegates();

  const openProfile = () => address && searchProfileModal(address, 'statement');

  return (
    <Menu isLazy placement="bottom-end">
      <MenuButton
        as={Button}
        rightIcon={
          <DownChevron
            display="flex"
            alignItems="center"
            justifyContent="center"
            boxSize="5"
          />
        }
        background={theme.secondaryButton?.bg || theme.branding}
        color={theme.secondaryButton?.text || theme.buttonText}
        px="5"
        py="3"
        fontWeight="semibold"
        minH={{ base: '52px', lg: 'max-content' }}
        _hover={{
          bgColor: theme.branding,
          opacity: 0.8,
        }}
        _focusVisible={{
          bgColor: theme.branding,
          opacity: 0.8,
        }}
        _focusWithin={{
          bgColor: theme.branding,
          opacity: 0.8,
        }}
        _focus={{
          opacity: 0.8,
        }}
        _active={{
          opacity: 0.8,
        }}
      >
        {truncateAddress(address || '')}
      </MenuButton>
      <MenuList
        bgColor={theme.filters.listBg}
        color={theme.filters.listText}
        w="max-content"
        minW="max-content"
      >
        <MenuItem
          bgColor={theme.filters.bg}
          _hover={{
            bg: theme.filters.activeBg,
            opacity: 0.8,
          }}
          w="full"
          minW="160px"
          onClick={openProfile}
        >
          My profile
        </MenuItem>
        <Divider orientation="horizontal" my="2" />
        <MenuItem
          bgColor={theme.filters.bg}
          _hover={{
            bg: theme.filters.activeBg,
            opacity: 0.8,
          }}
          onClick={disconnect}
          w="full"
          minW="160px"
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

const LoginButton: FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { theme } = useDAO();
  const { isAuthenticated, disconnect } = useAuth();
  const { isConnected } = useAccount();
  return (
    <Button
      background={theme.branding}
      color={theme.buttonText}
      px="5"
      py="3"
      fontWeight="semibold"
      _hover={{
        bgColor: theme.branding,
        opacity: 0.8,
      }}
      _focusVisible={{
        bgColor: theme.branding,
        opacity: 0.8,
      }}
      _focusWithin={{
        bgColor: theme.branding,
        opacity: 0.8,
      }}
      _focus={{
        opacity: 0.8,
      }}
      _active={{
        opacity: 0.8,
      }}
      minH={{ base: '52px', lg: 'max-content' }}
      onClick={() => {
        if (isAuthenticated && isConnected) {
          disconnect();
          return;
        }
        onOpen();
      }}
    >
      Delegate Login
    </Button>
  );
};

export const DelegateLoginButton: FC<{ onOpen: () => void }> = ({ onOpen }) => {
  const { isAuthenticated } = useAuth();
  const { isConnected } = useAccount();
  const { daoInfo } = useDAO();

  if (daoInfo.config.DAO_DEFAULT_SETTINGS?.DISABLE_LOGIN) return null;

  return isAuthenticated && isConnected ? (
    <LoginMenu />
  ) : (
    <LoginButton onOpen={onOpen} />
  );
};

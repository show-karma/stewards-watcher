import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { ChakraLink } from 'components/ChakraLink';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { HiChevronDown } from 'react-icons/hi';

export const ResourcesMenu: FC = () => {
  const { daoInfo, theme } = useDAO();
  const { config } = daoInfo;
  const { DAO_RESOURCES } = config;

  if (!DAO_RESOURCES) return null;

  return (
    <Menu placement="bottom">
      <MenuButton
        as={Button}
        rightIcon={<HiChevronDown />}
        color={theme.hat.text.primary}
        bgColor="transparent"
        px="0"
        py="6"
        fontWeight="semibold"
        _active={{}}
        _focus={{}}
        _hover={{
          color: theme.hat.text.secondary,
        }}
        minH="52px"
      >
        Resources
      </MenuButton>
      <MenuList w="max-content" minW="max-content" bgColor={theme.headerBg}>
        {DAO_RESOURCES.map((resource, index) => (
          <ChakraLink
            href={resource.url}
            key={+index}
            textDecoration="none"
            _hover={{
              textDecoration: 'none',
            }}
          >
            <MenuItem
              color={theme.hat.text.primary}
              bgColor="transparent"
              px="6"
              py="2"
              fontWeight="semibold"
              _focus={{}}
              _hover={{
                color: theme.hat.text.secondary,
                bg: theme.filters.activeBg,
              }}
              _active={{
                bg: theme.filters.activeBg,
              }}
              h="max-content"
              minH="max-content"
            >
              {resource.title}
            </MenuItem>
          </ChakraLink>
        ))}
      </MenuList>
    </Menu>
  );
};

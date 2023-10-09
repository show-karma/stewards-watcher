import {
  Button,
  Icon,
  Img,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC } from 'react';
import { AiOutlineSwap } from 'react-icons/ai';

export const EcosystemDropdown: FC = () => {
  const { theme, daoInfo } = useDAO();

  return (
    <Menu placement="bottom">
      <MenuButton
        as={Button}
        px="1px"
        py="1px"
        color={theme.hat.text.primary}
        bg="transparent"
        _active={{}}
        _focus={{}}
        _hover={{}}
      >
        <Icon p="0" as={AiOutlineSwap} w="4" h="4" />
      </MenuButton>
      <MenuList minW="max-content" bg={theme.headerBg}>
        {daoInfo.config.ECOSYSTEM?.map((item, index) => (
          <MenuItem key={+index} bg="transparent" _hover={{ opacity: 0.8 }}>
            <Link
              isExternal
              href={item.url}
              _hover={{}}
              display="flex"
              gap="2"
              flexDirection="row"
              color={theme.hat.text.primary}
              alignItems="center"
              justifyContent="flex-start"
            >
              <Img
                src={item.icon}
                w="4"
                h="4"
                alt={item.name}
                objectFit="cover"
              />
              {item.name}
            </Link>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

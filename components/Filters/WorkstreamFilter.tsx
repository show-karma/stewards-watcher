import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { IoChevronDownOutline } from 'react-icons/io5';

export const WorkstreamFilter = () => {
  const { workstreams, workstreamsFilter, selectWorkstream } = useDelegates();
  const { theme } = useDAO();

  return (
    <Menu isLazy closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<IoChevronDownOutline />}
        bgColor={theme.filters.bg}
        borderWidth="1px"
        borderColor={theme.filters.border}
        borderStyle="solid"
        boxShadow={theme.filters.shadow}
        color={theme.filters.title}
        borderRadius="sm"
        gap="4"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        w={{ base: 'full', md: 'max-content' }}
        minW="min-content"
      >
        Workstream
      </MenuButton>
      <MenuList
        bgColor={theme.filters.listBg}
        color={theme.filters.listText}
        h={{ base: '64' }}
        overflowY="auto"
      >
        <MenuOptionGroup type="checkbox" value={workstreamsFilter}>
          {workstreams.map((option, index) => (
            <MenuItemOption
              key={+index}
              value={option.id.toString()}
              onClick={() => selectWorkstream(index)}
              bgColor={theme.filters.bg}
              _hover={{
                bg: theme.filters.activeBg,
              }}
            >
              {option.description}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

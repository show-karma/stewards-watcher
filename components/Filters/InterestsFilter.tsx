import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import { DownChevron } from 'components/Icons';
import { useDAO, useDelegates } from 'contexts';
import { IoChevronDownOutline } from 'react-icons/io5';

export const InterestsFilter = () => {
  const { interests, interestFilter, selectInterests } = useDelegates();
  const { theme } = useDAO();

  return (
    <Menu isLazy closeOnSelect={false}>
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
        borderWidth="1px"
        borderStyle="solid"
        bgColor={theme.filters.bg}
        borderColor={theme.filters.border}
        boxShadow={theme.filters.shadow}
        color={theme.filters.title}
        gap="1"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        w={{ base: 'full', md: 'max-content' }}
        _hover={{
          bg: theme.filters.activeBg,
        }}
        _active={{
          bg: theme.filters.activeBg,
        }}
        px="4"
        py="5"
        borderRadius="4px"
        _focus={{}}
        _focusWithin={{}}
      >
        Delegate Interest
      </MenuButton>
      <MenuList
        bgColor={theme.filters.listBg}
        color={theme.filters.listText}
        h={{ base: '64' }}
        overflowY="auto"
      >
        <MenuOptionGroup type="checkbox" value={interestFilter}>
          {interests.map((option, index) => (
            <MenuItemOption
              key={+index}
              value={option}
              onClick={() => selectInterests(index)}
              bgColor={theme.filters.bg}
              _hover={{
                bg: theme.filters.activeBg,
              }}
            >
              {option}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

import {
  Button,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { useMemo } from 'react';
import { IoChevronDownOutline } from 'react-icons/io5';

export const InterestsFilter = () => {
  const { interests, interestFilter, selectInterests } = useDelegates();
  const { theme } = useDAO();

  const buttonText = useMemo(() => {
    if (!interestFilter.length) return 'Delegate interest';
    const text = interestFilter.slice(0, 4).join(', ');
    return text.length > 18 ? `${text.slice(0, 20)}...` : text;
  }, [interestFilter]);

  return (
    <Menu closeOnSelect={false}>
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
        w={{ base: '52' }}
      >
        {buttonText}
      </MenuButton>
      <MenuList
        bgColor={theme.filters.listBg}
        color={theme.filters.listText}
        h={{ base: '64' }}
        overflowY="auto"
      >
        <MenuOptionGroup type="checkbox">
          {interests.map((option, index) => (
            <MenuItemOption
              key={+index}
              value={option}
              onClick={() => selectInterests(index)}
            >
              {option}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

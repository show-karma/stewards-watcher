import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { DownChevron } from 'components/Icons';
import { useDAO, useDelegates } from 'contexts';
import { IoChevronDownOutline } from 'react-icons/io5';

export const StatFilter = () => {
  const { theme } = useDAO();
  const { selectStat, statOptions, stat } = useDelegates();

  const selectedStat = statOptions.find(option => option.stat === stat)?.title;

  return (
    <Menu isLazy id="stat-filter">
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
        bgColor={theme.filters.bg}
        borderWidth="1px"
        borderColor={theme.filters.border}
        borderStyle="solid"
        boxShadow={theme.filters.shadow}
        color={theme.filters.title}
        gap="4"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        w="full"
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
        {selectedStat}
      </MenuButton>
      <MenuList bgColor={theme.filters.listBg} color={theme.filters.listText}>
        {statOptions.map((option, index) => (
          <MenuItem key={+index} onClick={() => selectStat(option.stat)}>
            {option.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

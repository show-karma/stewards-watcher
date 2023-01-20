import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { DownChevron } from 'components/Icons';
import { useDAO, useDelegates } from 'contexts';
import { IoChevronDownOutline } from 'react-icons/io5';

export const StatFilter = () => {
  const { theme } = useDAO();
  const { selectStat, statOptions, stat } = useDelegates();

  const selectedStat = statOptions.find(option => option.id === stat)?.title;

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
        bgColor={theme.card.background}
        boxShadow={theme.filters.shadow}
        color={theme.filters.title}
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        w="full"
        maxW={{ base: 'full', md: 'max-content' }}
        _hover={{
          bg: theme.filters.activeBg,
        }}
        _active={{
          bg: theme.filters.activeBg,
        }}
        px="4"
        py="3"
        borderRadius="4px"
        _focus={{}}
        _focusWithin={{}}
      >
        {selectedStat}
      </MenuButton>
      <MenuList bgColor={theme.filters.listBg} color={theme.filters.listText}>
        {statOptions.map((option, index) => (
          <MenuItem
            key={+index}
            onClick={() => selectStat(option.id)}
            bgColor={theme.filters.bg}
            _hover={{
              bg: theme.filters.activeBg,
            }}
          >
            {option.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { HiChevronDown } from 'react-icons/hi';

export const StatFilter = () => {
  const { daoInfo } = useDAO();
  const { theme } = daoInfo;
  const { selectStat, statOptions, stat } = useDelegates();

  const selectedStat = statOptions.find(option => option.stat === stat)?.title;

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<HiChevronDown />}
        bgColor={theme.background}
        boxShadow={theme.card.shadow}
        color={theme.title}
        gap="4"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        w={{ base: 'full', md: 'max-content' }}
      >
        {selectedStat}
      </MenuButton>
      <MenuList>
        {statOptions.map((option, index) => (
          <MenuItem key={+index} onClick={() => selectStat(option.stat)}>
            {option.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

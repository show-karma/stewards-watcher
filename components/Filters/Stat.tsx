import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { DownChevron } from 'components/Icons';
import { useDAO, useDelegates } from 'contexts';
import { IStatOptions } from 'types';

export const StatFilter = () => {
  const {
    theme,
    daoInfo: { config },
  } = useDAO();
  const { selectStat, statOptions, stat, setupFilteringUrl } = useDelegates();

  const selectedStat = statOptions.find(option => option.id === stat)?.title;

  const handleSelectStat = async (option: IStatOptions) => {
    selectStat(option.id);
    setupFilteringUrl('sortby', option.stat);
  };

  const defaultState =
    stat === (config.DAO_DEFAULT_SETTINGS?.SORT || statOptions[0].id);

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
        bg={defaultState ? theme.filters.bg : theme.branding}
        color={defaultState ? theme.filters.title : theme.buttonText}
        _hover={{
          opacity: 0.8,
        }}
        _active={{
          opacity: 0.8,
        }}
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        w="full"
        maxW={{ base: 'full', md: 'max-content' }}
        px="4"
        py="3"
        borderRadius="4px"
        _focus={{}}
        _focusWithin={{}}
      >
        {selectedStat}
      </MenuButton>
      <MenuList
        bgColor={theme.filters.listBg}
        color={theme.filters.listText}
        h={{ base: 'max-content' }}
        maxH={{ base: '64' }}
        overflowY="auto"
        sx={{
          '&::-webkit-scrollbar': {
            width: '8px',
            marginX: '4px',
            borderRadius: '8px',
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: '8px',
            bgColor: theme.filters.activeBg,
          },
        }}
      >
        {statOptions.map((option, index) => (
          <MenuItem
            key={+index}
            onClick={() => handleSelectStat(option)}
            bgColor="transparent"
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

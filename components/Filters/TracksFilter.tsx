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

export const TracksFilter = () => {
  const { tracks, tracksFilter, selectTracks } = useDelegates();
  const { theme } = useDAO();

  return (
    <Menu isLazy closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<IoChevronDownOutline />}
        borderWidth="1px"
        borderStyle="solid"
        bgColor={theme.filters.bg}
        borderColor={theme.filters.border}
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
        Track
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
        <MenuOptionGroup type="checkbox" value={tracksFilter}>
          {tracks.map((option, index) => (
            <MenuItemOption
              key={+index}
              value={option.id.toString()}
              onClick={() => selectTracks(index)}
              bgColor="transparent"
              _hover={{
                bg: theme.filters.activeBg,
              }}
            >
              {option.displayName}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

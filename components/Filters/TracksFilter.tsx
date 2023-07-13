import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { IoChevronDownOutline } from 'react-icons/io5';

export const TracksFilter = () => {
  const { tracks, tracksFilter, selectTracks } = useDelegates();
  const { theme, daoInfo } = useDAO();

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
              <Tooltip
                label={
                  daoInfo.config.TRACKS_DICTIONARY &&
                  daoInfo.config.TRACKS_DICTIONARY[option.displayName]
                    ? daoInfo.config.TRACKS_DICTIONARY[option.displayName]
                        .description
                    : undefined
                }
                bg={theme.collapse.bg || theme.card.background}
                color={theme.collapse.text}
              >
                <Flex flexDir="row" align="center" gap="2">
                  <Text fontSize="xs">
                    {daoInfo.config.TRACKS_DICTIONARY &&
                    daoInfo.config.TRACKS_DICTIONARY[option.displayName]
                      ? daoInfo.config.TRACKS_DICTIONARY[option.displayName]
                          .emoji
                      : undefined}
                  </Text>
                  <Text fontSize="md">{option.displayName}</Text>
                </Flex>
              </Tooltip>
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

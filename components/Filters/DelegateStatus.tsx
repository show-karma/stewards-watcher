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

export const DelegateStatusFilter = () => {
  const { selectStatus, statuses, statusesOptions, setupFilteringUrl } =
    useDelegates();
  const {
    theme,
    daoInfo: { config },
  } = useDAO();

  const handleDelegateStatus = (index: number) => {
    if (!statusesOptions[index]) return;

    // search for the index in the statuses array
    const filterIdx = statuses.findIndex(
      filter => filter === statusesOptions[index]
    );

    // clone the statuses array
    const items = [...statuses];

    // if the status is already in the statusesOptions array, remove it
    if (filterIdx >= 0) {
      items.splice(filterIdx, 1);
    } else {
      items.push(statusesOptions[index]);
    }

    // set the new statuses array
    selectStatus(items);
    setupFilteringUrl('statuses', items.join(','));
  };

  const defaultState =
    statuses ===
    (config.DAO_DEFAULT_SETTINGS?.STATUS_FILTER?.DEFAULT_STATUS_SELECTED ||
      statusesOptions);

  return (
    <Menu isLazy closeOnSelect={false} id="delegate-status-filter">
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
        borderWidth="1px"
        borderColor={theme.filters.border}
        borderStyle="solid"
        boxShadow={theme.filters.shadow}
        gap="4"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        w={{ base: 'full', md: 'max-content' }}
        maxW="full"
        _hover={{
          opacity: 0.8,
        }}
        _active={{
          opacity: 0.8,
        }}
        px="4"
        py="5"
        borderRadius="4px"
        _focus={{}}
        _focusWithin={{}}
      >
        Status
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
        <MenuOptionGroup type="checkbox" value={statuses}>
          {statusesOptions.map((option, index) => (
            <MenuItemOption
              key={+index}
              value={option}
              onClick={() => handleDelegateStatus(index)}
              bgColor="transparent"
              _hover={{
                bg: theme.filters.activeBg,
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </MenuItemOption>
          ))}
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

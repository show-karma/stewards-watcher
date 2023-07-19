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

export const InterestsFilter = () => {
  const { interests, interestFilter, selectInterests } = useDelegates();
  const { theme } = useDAO();

  const defaultState = interestFilter.length === 0;

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
        bg={defaultState ? theme.filters.bg : theme.branding}
        color={defaultState ? theme.filters.title : theme.buttonText}
        borderColor={theme.filters.border}
        boxShadow={theme.filters.shadow}
        gap="1"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        w={{ base: 'full', md: 'max-content' }}
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
        Delegate Interest
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
        <MenuOptionGroup type="checkbox" value={interestFilter}>
          {interests.map((option, index) => (
            <MenuItemOption
              key={+index}
              value={option}
              onClick={() => selectInterests(index)}
              bgColor="transparent"
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

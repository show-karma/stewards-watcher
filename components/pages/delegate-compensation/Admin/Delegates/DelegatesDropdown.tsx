import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
} from '@chakra-ui/react';
import { DownChevron } from 'components/Icons';
import { useDAO } from 'contexts';
import { useDelegateCompensation } from 'contexts/delegateCompensation';
import { useMemo } from 'react';
import { getDelegateInfo } from 'utils/delegate-compensation/getDelegateInfo';
import { useQuery } from 'wagmi';

export const DelegatesDropdown = () => {
  const { theme, daoInfo } = useDAO();
  const { changeDelegateAddress, selectedDate, delegateInfo, delegateAddress } =
    useDelegateCompensation();

  const {
    data: allDelegates,
    isLoading,
    isFetching,
  } = useQuery(
    [
      'delegate-compensation-delegates-info',
      selectedDate?.value.month,
      selectedDate?.value.year,
    ],
    () =>
      getDelegateInfo(
        daoInfo.config.DAO_KARMA_ID,
        selectedDate?.value.month,
        selectedDate?.value.year
      ),
    {
      enabled: !!selectedDate?.value.month && !!selectedDate?.value.year,
    }
  );

  useMemo(() => {
    if (!delegateAddress && !isLoading && !isFetching) {
      const firstAddress = allDelegates?.[0]?.publicAddress;
      if (!firstAddress) return;
      changeDelegateAddress(firstAddress as string);
    }
  }, [delegateAddress, isLoading, isFetching]);

  if (isLoading || isFetching) {
    return (
      <Flex w="full" justify="center" align="center">
        <Spinner size="md" />
      </Flex>
    );
  }

  return (
    <Menu isLazy id="order-filter">
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
        bg={theme.filters.bg}
        color={theme.filters.title}
        _hover={{
          opacity: 0.8,
        }}
        _active={{
          opacity: 0.8,
        }}
        gap="1"
        fontFamily="heading"
        fontWeight="normal"
        textAlign="left"
        fontSize="md"
        minW="min-content"
        w="full"
        maxW={{ base: 'full', md: 'max-content' }}
        px="4"
        py="3"
        borderRadius="4px"
        _focus={{}}
        _focusWithin={{}}
      >
        {delegateInfo?.name ||
          delegateInfo?.ensName ||
          delegateInfo?.publicAddress ||
          'Select a Delegate'}
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
        {allDelegates?.map((option, index) => (
          <MenuItem
            key={+index}
            onClick={() => changeDelegateAddress(option.publicAddress)}
            bgColor="transparent"
            _hover={{
              bg: theme.filters.activeBg,
            }}
          >
            {option.name || option.ensName || option.publicAddress}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useDAO, useVotes } from 'contexts';
import { Button, Flex, Icon, Text } from '@chakra-ui/react';
import { FC, ReactNode } from 'react';
import { IChainRow } from 'types';

const navigationIconStyle = {
  width: '1.5rem',
  height: '1.5rem',
  cursor: 'pointer',
};

interface INavigationButton {
  onClick: () => void;
  children: ReactNode;
  isSelected: boolean;
}

const NavigationButton: FC<INavigationButton> = ({
  onClick,
  children,
  isSelected,
}) => {
  const { theme } = useDAO();
  return (
    <Button
      bgColor={
        isSelected
          ? theme.modal.votingHistory.navigation.buttons.selectedBg
          : theme.modal.votingHistory.navigation.buttons.unSelectedBg
      }
      color={
        isSelected
          ? theme.modal.votingHistory.navigation.buttons.selectedText
          : theme.modal.votingHistory.navigation.buttons.unSelectedText
      }
      px="0"
      py="0"
      w="36px"
      h="36px"
      minW="max-content"
      borderRadius="full"
      _hover={{
        bgColor: theme.modal.votingHistory.navigation.buttons.selectedBg,
        color: theme.modal.votingHistory.navigation.buttons.selectedText,
      }}
      _active={{}}
      _focus={{}}
      _focusWithin={{}}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export const Navigation: FC = () => {
  const { theme } = useDAO();
  const { allVotes, offset, limit, changeOffset } = useVotes();
  const proposalsSize = allVotes.length;
  const maxPagesPerView = 3;
  const activePage = offset + 1;

  const totalPages = Array.from(
    { length: Math.ceil(proposalsSize / limit) },
    (_, index) => index + 1
  );

  const pagesToDisplay = totalPages.slice(
    offset + maxPagesPerView >= totalPages.length
      ? totalPages.length - maxPagesPerView
      : offset,
    offset + maxPagesPerView >= totalPages.length
      ? totalPages.length
      : offset + maxPagesPerView
  );

  const isSelected = (page: number) => activePage === page;

  const previousPage = () => {
    if (offset <= 0) return;
    changeOffset(offset - 1);
  };
  const nextPage = () => {
    if (activePage >= totalPages.length) return;
    changeOffset(offset + 1);
  };

  const selectPage = (selected: number) =>
    selected + 1 !== activePage && changeOffset(selected);

  return proposalsSize > 0 ? (
    <Flex flexDir="row" gap="3" align="center">
      <Button
        w="36px"
        h="36px"
        minW="max-content"
        bgColor="transparent"
        px="0"
        py="0"
        borderRadius="full"
        onClick={() => previousPage()}
        disabled={activePage <= 1}
      >
        <Icon
          color={theme.modal.votingHistory.navigation.color}
          as={MdChevronLeft}
          {...navigationIconStyle}
        />
      </Button>

      {!pagesToDisplay.includes(1) && totalPages.length > 0 && (
        <>
          <NavigationButton
            isSelected={isSelected(1)}
            onClick={() => selectPage(0)}
          >
            1
          </NavigationButton>
          <Text
            color={theme.modal.votingHistory.navigation.buttons.unSelectedText}
          >
            ...
          </Text>
        </>
      )}
      {pagesToDisplay.map((page, index) => (
        <NavigationButton
          key={+index}
          isSelected={isSelected(page)}
          onClick={() => selectPage(page - 1)}
        >
          {page}
        </NavigationButton>
      ))}
      {!pagesToDisplay.includes(totalPages.length) && totalPages.length > 0 && (
        <>
          <Text
            color={theme.modal.votingHistory.navigation.buttons.unSelectedText}
          >
            ...
          </Text>
          <NavigationButton
            isSelected={isSelected(totalPages.length)}
            onClick={() => selectPage(totalPages.length - 1)}
          >
            {totalPages.length}
          </NavigationButton>
        </>
      )}
      <Button
        w="36px"
        h="36px"
        minW="max-content"
        bgColor="transparent"
        px="0"
        py="0"
        borderRadius="full"
        onClick={() => nextPage()}
        disabled={activePage >= totalPages.length}
      >
        <Icon
          color={theme.modal.votingHistory.navigation.color}
          as={MdChevronRight}
          {...navigationIconStyle}
        />
      </Button>
    </Flex>
  ) : null;
};

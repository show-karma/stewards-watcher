import {
  Button,
  Divider,
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { LeftCircleArrowIcon, RightCircleArrowIcon } from 'components/Icons';
import { useDAO } from 'contexts';
import { FC, useEffect } from 'react';
import { ICardStat } from 'types';

interface IStatPopoverProps {
  stats: ICardStat[];
}

export const StatPopover: FC<IStatPopoverProps> = ({ stats }) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { theme } = useDAO();

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="right">
      <PopoverTrigger>
        <IconButton
          aria-label="Stat extension showing"
          icon={
            isOpen ? (
              <RightCircleArrowIcon boxSize="4" />
            ) : (
              <LeftCircleArrowIcon boxSize="4" />
            )
          }
          position="absolute"
          right="-16px"
          px="2"
          py="0"
          minWidth="max-content"
          minHeight="max-content"
          background="transparent"
          _hover={{}}
          _active={{}}
          _focus={{}}
          _focusWithin={{}}
          _focusVisible={{}}
          onClick={onToggle}
          color={theme.card.statBg}
        />
      </PopoverTrigger>
      <PopoverContent
        marginLeft="-12px"
        w="max-content"
        bgColor={theme.card.background}
        border="none"
        borderRadius="5px"
      >
        <PopoverBody
          px="0"
          py="0"
          bgColor={theme.card.statBg}
          border="1px"
          borderStyle="solid"
          borderColor={theme.card.border}
          borderRadius="5px"
        >
          {stats.map((stat, index) => (
            <Flex key={+index} flexDir="column">
              <Flex px="3" py="1.5" gap="2" flexDirection="row" align="center">
                <Text
                  minW="6"
                  fontFamily="heading"
                  fontStyle="normal"
                  fontWeight="700"
                  fontSize="14px"
                  color={theme.card.text.primary}
                >
                  {stat.value}
                </Text>
                <Text
                  fontFamily="heading"
                  fontStyle="normal"
                  fontWeight="400"
                  fontSize="12px"
                  color={theme.card.text.primary}
                >
                  {stat.title}
                </Text>
              </Flex>
              {stats.length !== index + 1 && stats.length > 1 && (
                <Divider bgColor={theme.card.border} h="1px" />
              )}
            </Flex>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

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
import { motion, useAnimationControls } from 'framer-motion';
import { FC, SetStateAction, useEffect, useState } from 'react';
import { ICardStat, IDelegate } from 'types';

interface IStatPopoverProps {
  stats: ICardStat[];
  openScoreBreakdown: () => void;
  setScoreType: (
    value: SetStateAction<
      'forumScore' | 'gitcoinHealthScore' | 'karmaScore' | undefined
    >
  ) => void;
  data?: IDelegate;
}

export const StatPopover: FC<IStatPopoverProps> = ({
  stats,
  openScoreBreakdown,
  setScoreType,
  data,
}) => {
  const { isOpen, onToggle, onClose } = useDisclosure();
  const { theme, daoData, daoInfo } = useDAO();
  const { config } = daoInfo;

  const MotionIconButton = motion(IconButton);

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="right">
      <PopoverTrigger>
        <MotionIconButton
          aria-label="Stat extension showing"
          icon={<LeftCircleArrowIcon boxSize="4" />}
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
          initial={{ rotate: isOpen ? 0 : 180 }}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
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
          borderColor={theme.card.divider}
          borderRadius="5px"
        >
          {stats.map((stat, index) => {
            const shouldOpenScoreBreakdown =
              stat.id === 'forumScore' &&
              data?.discourseHandle &&
              daoData?.socialLinks.forum &&
              config.DAO_FORUM_TYPE;
            return (
              <Flex
                key={+index}
                flexDir="column"
                onClick={() => {
                  if (shouldOpenScoreBreakdown) {
                    setScoreType('forumScore');
                    openScoreBreakdown();
                  }
                }}
                cursor={shouldOpenScoreBreakdown ? 'pointer' : 'default'}
              >
                <Flex
                  px="3"
                  py="1.5"
                  gap="2"
                  flexDirection="row"
                  align="center"
                >
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
            );
          })}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

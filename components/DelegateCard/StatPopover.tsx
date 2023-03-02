import {
  Divider,
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { LeftCircleArrowIcon } from 'components/Icons';
import { useDAO } from 'contexts';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, SetStateAction } from 'react';
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
  const MotionPopoverContent = motion(PopoverContent);

  return (
    <Popover isOpen={isOpen} onClose={onClose} placement="right">
      <PopoverTrigger>
        <Flex position="absolute" right="-16px">
          <Tooltip
            label={!isOpen && 'More info'}
            hasArrow
            bgColor="black"
            color="white"
            fontWeight="normal"
            fontSize="sm"
          >
            <MotionIconButton
              aria-label="Stat extension showing"
              icon={<LeftCircleArrowIcon boxSize="4" />}
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
              h="max-content"
            />
          </Tooltip>
        </Flex>
      </PopoverTrigger>
      <AnimatePresence>
        {isOpen && (
          <MotionPopoverContent
            marginLeft="-8px"
            w="max-content"
            bgColor={theme.card.background}
            border="none"
            borderRadius="5px"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.5, scale: 0.5 }}
            transition={{ duration: 0.6 }}
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
          </MotionPopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
};

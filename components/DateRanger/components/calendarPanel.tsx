import {
  HStack,
  VStack,
  Heading,
  Divider,
  SimpleGrid,
  Box,
  Flex,
} from '@chakra-ui/react';
import { useDayzed, Props as DayzedHookProps } from 'dayzed';
import React, { useCallback, useMemo } from 'react';
import { CalendarConfigs, DatepickerProps } from '../utils/commonTypes';
import { DatepickerBackBtns, DatepickerForwardBtns } from './dateNavBtns';
import { DayOfMonth } from './dayOfMonth';

interface CalendarPanelProps extends DatepickerProps {
  dayzedHookProps: Omit<DayzedHookProps, 'children' | 'render'>;
  configs: CalendarConfigs;
  onMouseEnterHighlight?: (date: Date) => void;
  isInRange?: (date: Date) => boolean | null;
}

export const CalendarPanel: React.FC<CalendarPanelProps> = ({
  dayzedHookProps,
  configs,
  propsConfigs,
  onMouseEnterHighlight,
  isInRange,
}) => {
  const renderProps = useDayzed(dayzedHookProps);
  const { calendars, getBackProps, getForwardProps } = renderProps;

  const weekdayNames = useMemo(() => {
    const { firstDayOfWeek } = configs;
    const { dayNames } = configs;
    if (firstDayOfWeek && firstDayOfWeek > 0) {
      return configs.dayNames
        .slice(firstDayOfWeek, dayNames.length)
        .concat(dayNames.slice(0, firstDayOfWeek));
    }
    return dayNames;
  }, [configs.firstDayOfWeek, configs.dayNames]);

  if (calendars.length <= 0) {
    return null;
  }

  return (
    <Flex
      className="datepicker-calendar"
      flexDir={['column', 'column', 'row']}
      borderRadius="xl"
      align="center"
      bg="white"
    >
      <VStack key={0} height="100%" px="3" py="4" borderRadius="10px">
        <Flex
          flexDir="row"
          align="center"
          justifyContent="flex-start"
          w="100%"
          gap="8"
        >
          <DatepickerBackBtns
            calendars={calendars}
            getBackProps={getBackProps}
            propsConfigs={propsConfigs}
          />
          <Heading
            size="sm"
            minWidth="5rem"
            textAlign="center"
            color="black"
            fontFamily="body"
            fontSize="15px"
            fontWeight="semibold"
          >
            {configs.monthNames[calendars[0].month]} {calendars[0].year}
          </Heading>
        </Flex>
        <SimpleGrid
          columns={7}
          spacingY={1}
          spacing={0}
          textAlign="center"
          fontFamily="heading"
        >
          {weekdayNames.map((day, dayIdx) => (
            <Box
              fontSize="10px"
              fontWeight="600"
              key={dayIdx}
              color="gray.600"
              mb="1"
            >
              {day}
            </Box>
          ))}
          {calendars[0].weeks.map((week, weekIdx) =>
            week.map((dateObj, index) => {
              const key = `${calendars[0].month}-${calendars[0].year}-${weekIdx}-${index}`;
              if (!dateObj) return <Box key={key} />;
              const { date } = dateObj;
              return (
                <DayOfMonth
                  key={key}
                  dateObj={dateObj}
                  propsConfigs={propsConfigs}
                  renderProps={renderProps}
                  isInRange={isInRange && isInRange(date)}
                  onMouseEnter={() => {
                    if (onMouseEnterHighlight) onMouseEnterHighlight(date);
                  }}
                />
              );
            })
          )}
        </SimpleGrid>
      </VStack>
      <Divider orientation="vertical" h="calc(100% - 64px)" bg="gray.300" />
      <VStack key={1} height="100%" px="3" py="4" borderRadius="10px">
        <Flex
          flexDir="row"
          align="center"
          justifyContent="flex-end"
          w="100%"
          gap="8"
          bg="white"
        >
          <Heading
            size="sm"
            minWidth="5rem"
            textAlign="center"
            color="black"
            fontFamily="body"
            fontSize="15px"
            fontWeight="semibold"
          >
            {configs.monthNames[calendars[1].month]} {calendars[1].year}
          </Heading>
          <DatepickerForwardBtns
            calendars={calendars}
            getForwardProps={getForwardProps}
            propsConfigs={propsConfigs}
          />
        </Flex>
        <SimpleGrid columns={7} spacingY={1} spacing={0} textAlign="center">
          {weekdayNames.map((day, dayIdx) => (
            <Box
              fontSize="10px"
              fontWeight="600"
              key={dayIdx}
              color="gray.600"
              mb="1"
              fontFamily="heading"
            >
              {day}
            </Box>
          ))}
          {calendars[1].weeks.map((week, weekIdx) =>
            week.map((dateObj, index) => {
              const key = `${calendars[1].month}-${calendars[1].year}-${weekIdx}-${index}`;
              if (!dateObj) return <Box key={key} />;
              const { date } = dateObj;
              return (
                <DayOfMonth
                  key={key}
                  dateObj={dateObj}
                  propsConfigs={propsConfigs}
                  renderProps={renderProps}
                  isInRange={isInRange && isInRange(date)}
                  onMouseEnter={() => {
                    if (onMouseEnterHighlight) onMouseEnterHighlight(date);
                  }}
                />
              );
            })
          )}
        </SimpleGrid>
      </VStack>
    </Flex>
  );
};

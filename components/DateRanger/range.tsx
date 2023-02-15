import React, { useState } from 'react';
import { Props as DayzedHookProps } from 'dayzed';
import {
  Flex,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useDisclosure,
} from '@chakra-ui/react';
import { format } from 'date-fns';
import {
  MONTH_NAMES_FULL,
  MONTH_NAMES_SHORT,
  WEEKDAY_NAMES_SHORT,
} from './utils/calendarUtils';
import { CalendarPanel } from './components/calendarPanel';
import {
  CalendarConfigs,
  DatepickerConfigs,
  DatepickerProps,
  OnDateSelected,
  PropsConfigs,
} from './utils/commonTypes';

interface RangeCalendarPanelProps {
  dayzedHookProps: DayzedHookProps;
  configs: CalendarConfigs;
  propsConfigs?: PropsConfigs;
  selected?: Date | Date[];
}

const RangeCalendarPanel: React.FC<RangeCalendarPanelProps> = ({
  dayzedHookProps,
  configs,
  propsConfigs,
  selected,
}) => {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  // Calendar level
  const onMouseLeave = () => {
    setHoveredDate(null);
  };

  // Date level
  const onMouseEnterHighlight = (date: Date) => {
    if (!Array.isArray(selected) || !selected?.length) {
      return;
    }
    setHoveredDate(date);
  };

  const isInRange = (date: Date) => {
    if (!Array.isArray(selected) || !selected?.length) {
      return false;
    }
    const firstSelected = selected[0];
    if (selected.length === 2) {
      const secondSelected = selected[1];
      return firstSelected < date && secondSelected > date;
    }
    return (
      hoveredDate &&
      ((firstSelected < date && hoveredDate >= date) ||
        (date < firstSelected && date >= hoveredDate))
    );
  };

  return (
    <Flex onMouseLeave={onMouseLeave} borderRadius="2xl">
      <CalendarPanel
        dayzedHookProps={dayzedHookProps}
        configs={configs}
        propsConfigs={propsConfigs}
        isInRange={isInRange}
        onMouseEnterHighlight={onMouseEnterHighlight}
      />
    </Flex>
  );
};

export interface RangeDatepickerProps extends DatepickerProps {
  selectedDates: Date[];
  configs?: DatepickerConfigs;
  disabled?: boolean;
  defaultIsOpen?: boolean;
  closeOnSelect?: boolean;
  onDateChange: (date: Date[]) => void;
  id?: string;
  name?: string;
  usePortal?: boolean;
  isDirty?: boolean;
}

const DefaultConfigs: CalendarConfigs = {
  dateFormat: 'MM/dd/yyyy',
  monthNames: MONTH_NAMES_FULL,
  dayNames: WEEKDAY_NAMES_SHORT,
  firstDayOfWeek: 0,
};

export const RangeDatepicker: React.FC<RangeDatepickerProps> = ({
  configs,
  propsConfigs = {},
  id,
  name,
  usePortal,
  defaultIsOpen = false,
  closeOnSelect = true,
  isDirty = false,
  ...props
}) => {
  const { selectedDates, minDate, maxDate, onDateChange, disabled } = props;

  // chakra popover utils
  const [dateInView, setDateInView] = useState(selectedDates[0] || new Date());
  const [offset, setOffset] = useState(0);
  const { onOpen, onClose, isOpen } = useDisclosure({ defaultIsOpen });

  const calendarConfigs: CalendarConfigs = {
    ...DefaultConfigs,
    ...configs,
  };

  const onPopoverClose = () => {
    onClose();
    setDateInView(selectedDates[0] || new Date());
    setOffset(0);
  };

  const handleOnDateSelected: OnDateSelected = ({ selectable, date }) => {
    if (!selectable) {
      return;
    }
    const newDates = [...selectedDates];
    if (selectedDates.length) {
      if (selectedDates.length === 1) {
        const firstTime = selectedDates[0];
        if (firstTime < date) {
          newDates.push(date);
        } else {
          newDates.unshift(date);
        }
        onDateChange(newDates);

        if (closeOnSelect) onClose();
        return;
      }

      if (newDates.length === 2) {
        onDateChange([date]);
      }
    } else {
      newDates.push(date);
      onDateChange(newDates);
    }
  };

  // eventually we want to allow user to freely type their own input and parse the input
  let intVal = selectedDates[0]
    ? `${format(selectedDates[0], calendarConfigs.dateFormat)}`
    : 'to';
  intVal += selectedDates[1]
    ? ` to ${format(selectedDates[1], calendarConfigs.dateFormat)}`
    : '';

  const PopoverContentWrapper = usePortal ? Portal : React.Fragment;

  return (
    <Popover
      placement="bottom-start"
      variant="responsive"
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onPopoverClose}
      isLazy
    >
      <PopoverTrigger>
        <Input
          onKeyPress={event => {
            if (event.key === ' ' && !isOpen) {
              event.preventDefault();
              onOpen();
            }
          }}
          id={id}
          autoComplete="off"
          isDisabled={disabled}
          name={name}
          value={isDirty ? intVal : undefined}
          onChange={event => event.target.value}
          placeholder="Select timeframe"
          border="1px"
          borderStyle="solid"
          borderColor="gray.100"
          w="max-content"
          _placeholder={{
            color: 'gray.100',
          }}
          _hover={{}}
          _focus={{}}
          _active={{}}
          _focusWithin={{}}
          _focusVisible={{}}
          {...propsConfigs.inputProps}
        />
      </PopoverTrigger>
      <PopoverContentWrapper>
        <PopoverContent
          width="100%"
          borderRadius="10px"
          px="0"
          border="none"
          {...propsConfigs?.popoverCompProps?.popoverContentProps}
        >
          <PopoverBody
            px="0"
            py="0"
            border="none"
            {...propsConfigs.popoverCompProps?.popoverBodyProps}
          >
            <RangeCalendarPanel
              dayzedHookProps={{
                onDateSelected: handleOnDateSelected,
                selected: selectedDates,
                monthsToDisplay: 2,
                date: dateInView,
                minDate,
                maxDate,
                offset,
                onOffsetChanged: setOffset,
                firstDayOfWeek: calendarConfigs.firstDayOfWeek,
              }}
              configs={calendarConfigs}
              propsConfigs={propsConfigs}
              selected={selectedDates}
            />
          </PopoverBody>
        </PopoverContent>
      </PopoverContentWrapper>
    </Popover>
  );
};

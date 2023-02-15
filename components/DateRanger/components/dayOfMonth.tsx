/* eslint-disable no-underscore-dangle */
import { Button } from '@chakra-ui/react';
import { DateObj, RenderProps } from 'dayzed';
import React, { useMemo } from 'react';
import { DatepickerProps, DayOfMonthBtnStyleProps } from '../utils/commonTypes';

interface DayOfMonthProps extends DatepickerProps {
  renderProps: RenderProps;
  isInRange?: boolean | null;
  dateObj: DateObj;
  onMouseEnter?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const halfGap = 0.125;

export const DayOfMonth: React.FC<DayOfMonthProps> = ({
  dateObj,
  propsConfigs,
  isInRange,
  renderProps,
  onMouseEnter,
}) => {
  const { date, selected, selectable, today } = dateObj;
  const { getDateProps } = renderProps;
  const {
    defaultBtnProps,
    isInRangeBtnProps,
    selectedBtnProps,
    todayBtnProps,
  } = propsConfigs?.dayOfMonthBtnProps || {};

  const styleBtnProps: DayOfMonthBtnStyleProps = useMemo(
    () => ({
      defaultBtnProps: {
        width: '32px',
        height: '32px',
        minHeight: '32px',
        minWidth: '32px',
        maxHeight: '32px',
        maxWidth: '32px',
        borderRadius: 'none',
        variant: 'outline',
        fontWeight: 400,
        fontSize: '12px',
        background: 'transparent',
        borderColor: 'transparent',
        color: 'black',
        zIndex: '2',
        // this intends to fill the visual gap from Grid to improve the UX
        // so the button active area is actually larger than what it's seen
        _after: {
          content: "''",
          position: 'absolute',
          top: `-${halfGap}rem`,
          left: `-${halfGap}rem`,
          bottom: `-${halfGap}rem`,
          right: `-${halfGap}rem`,
          borderWidth: `${halfGap}rem`,
          borderColor: 'transparent',
        },
        ...defaultBtnProps,
        _hover: selectable
          ? {
              bg: 'red.600',
              color: 'white',
              ...defaultBtnProps?._hover,
            }
          : undefined,
      },
      isInRangeBtnProps: {
        background: 'red.100',
        borderRadius: 'none',
        ...isInRangeBtnProps,
      },
      selectedBtnProps: {
        background: 'red.600',
        color: 'white',
        ...selectedBtnProps,
      },
      todayBtnProps: {
        bg: 'red.400',
        color: 'white',
        ...todayBtnProps,
      },
    }),
    [
      defaultBtnProps,
      isInRangeBtnProps,
      selectedBtnProps,
      todayBtnProps,
      selectable,
    ]
  );

  return (
    <Button
      {...getDateProps({
        dateObj,
        disabled: !selectable,
        onMouseEnter,
      })}
      isDisabled={!selectable}
      {...styleBtnProps.defaultBtnProps}
      {...(isInRange && selectable && styleBtnProps.isInRangeBtnProps)}
      {...(selected && selectable && styleBtnProps.selectedBtnProps)}
      {...(today && styleBtnProps.todayBtnProps)}
    >
      {date.getDate()}
    </Button>
  );
};

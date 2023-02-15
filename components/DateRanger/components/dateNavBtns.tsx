import { Button, ButtonProps } from '@chakra-ui/react';
import { Calendar, GetBackForwardPropsOptions } from 'dayzed';
import React, { Fragment } from 'react';
import { DatepickerProps } from '../utils/commonTypes';

export interface DatepickerBackBtnsProps extends DatepickerProps {
  calendars: Calendar[];
  getBackProps: (data: GetBackForwardPropsOptions) => Record<string, any>;
}

const DefaultBtnStyle: ButtonProps = {
  variant: 'ghost',
  size: 'sm',
};

export const DatepickerBackBtns: React.FC<DatepickerBackBtnsProps> = props => {
  const { calendars, getBackProps } = props;
  const { propsConfigs } = props;
  const customBtnProps = propsConfigs?.dateNavBtnProps;
  return (
    <Button
      color="black"
      {...getBackProps({ calendars })}
      {...DefaultBtnStyle}
      {...customBtnProps}
    >
      {'<'}
    </Button>
  );
};

export interface DatepickerForwardBtnsProps extends DatepickerProps {
  calendars: Calendar[];
  getForwardProps: (data: GetBackForwardPropsOptions) => Record<string, any>;
}

export const DatepickerForwardBtns: React.FC<
  DatepickerForwardBtnsProps
> = props => {
  const { calendars, getForwardProps } = props;
  const { propsConfigs } = props;
  const customBtnProps = propsConfigs?.dateNavBtnProps;
  return (
    <Button
      color="black"
      {...getForwardProps({ calendars })}
      {...DefaultBtnStyle}
      {...customBtnProps}
    >
      {'>'}
    </Button>
  );
};

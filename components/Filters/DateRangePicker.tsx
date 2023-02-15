import { Input } from '@chakra-ui/react';
import { FC, useRef } from 'react';

export const DateRangePicker: FC = () => {
  const ref = useRef(null);
  const openCalendar = () => {
    console.log('open calendar');
    console.log(ref);
  };
  return (
    <Input
      type="text"
      name="daterange"
      value="01/01/2018 - 01/15/2018"
      onClick={openCalendar}
      ref={ref}
    />
  );
};

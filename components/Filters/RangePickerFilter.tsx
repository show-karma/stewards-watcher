import { RangeDatepicker } from 'components/DateRanger';
import { useDelegates } from 'contexts';
import { useState } from 'react';

export const RangePickerFilter = () => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([
    new Date(),
    new Date(),
  ]);
  const { filterByCustomDate } = useDelegates();

  const [isDatePickerDirty, setIsDatePickerDirty] = useState(false);

  const handleDateChange = (dates: Date[]) => {
    setSelectedDates(dates);
    setIsDatePickerDirty(true);
    if (dates.length === 2) filterByCustomDate(dates);
  };

  return (
    <RangeDatepicker
      selectedDates={selectedDates}
      onDateChange={handleDateChange}
      maxDate={new Date()}
      isDirty={isDatePickerDirty}
    />
  );
};

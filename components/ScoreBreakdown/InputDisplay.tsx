import { Input, Td, Tr } from '@chakra-ui/react';
import { ScoreBreakdownCalcItem } from 'karma-score';
import { useState } from 'react';

export const InputDisplay: React.FC<{
  item: ScoreBreakdownCalcItem;
  onChange: (index: number, weight: number) => void;
  index: number;
}> = ({ item, onChange, index }) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <Tr fontSize={14}>
      <Td>{item.label}</Td>
      <Td>{item.value}</Td>
      <Td>
        <Input
          type="number"
          width="10ch"
          defaultValue={item.weight}
          step="0.1"
          sx={{
            appearance: isSelected && 'initial !important',
            border: 'none',
          }}
          cursor={isSelected ? 'text' : 'pointer'}
          onFocus={() => {
            setIsSelected(true);
          }}
          onBlur={() => {
            setIsSelected(false);
          }}
          onChange={ev => onChange(index, +ev.target.value)}
        />
      </Td>
    </Tr>
  );
};

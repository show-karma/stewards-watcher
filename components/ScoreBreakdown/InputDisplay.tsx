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
      <Td px={{ base: '3', md: '6' }}>{item.label}</Td>
      <Td px={{ base: '2', md: '6' }}>{item.value}</Td>
      <Td px={{ base: '3', md: '6' }}>
        <Input
          type="number"
          width="10ch"
          defaultValue={item.weight}
          step="0.1"
          px={{ base: '2', md: '2' }}
          sx={{
            appearance: isSelected && 'initial !important',
            border: 'rgba(255,255,255,0.05) 1px solid',
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

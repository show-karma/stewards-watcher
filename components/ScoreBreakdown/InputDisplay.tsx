import { Input, Td, Tr } from '@chakra-ui/react';
import { ScoreBreakdownCalcItem } from 'karma-score';

export const InputDisplay: React.FC<{
  item: ScoreBreakdownCalcItem;
  onChange: (index: number, weight: number) => void;
  index: number;
}> = ({ item, onChange, index }) => (
  <Tr>
    <Td>{item.label}</Td>
    <Td>{item.value}</Td>
    <Td>
      {/* {item.weight} */}
      <Input
        type="number"
        width="13ch"
        defaultValue={item.weight}
        step="0.1"
        sx={{
          appearance: 'initial !important',
        }}
        onChange={ev => onChange(index, +ev.target.value)}
      />
    </Td>
  </Tr>
);

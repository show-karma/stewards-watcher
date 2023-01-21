/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Flex, Input } from '@chakra-ui/react';
import { ScoreBreakdownCalc, ScoreBreakdownChildren } from 'karma-score';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface Props {
  breakdown: ScoreBreakdownCalc;
  child?: ScoreBreakdownChildren;
  setItem?: Dispatch<SetStateAction<ScoreBreakdownCalc>>;
  index?: number;
}

export const InputTree: React.FC<Props> = ({
  breakdown,
  setItem,
  child,
  index,
}) => {
  const [cur, setCur] = useState<ScoreBreakdownCalc | ScoreBreakdownChildren>(
    child || breakdown
  );
  const [hasChanged, setHasChanged] = useState<boolean>(false);

  const onChange = (idx: number, weight: number) => {
    const bd = [...cur];
    bd[idx].weight = weight;
    console.log('changing', idx, weight);
    setCur(bd);
    setHasChanged(true);
  };

  useEffect(() => {
    console.log('haschanged', hasChanged, index);
    if (hasChanged && typeof index === 'number') {
      console.log('changed');
      const bd = [...breakdown];
      if (bd[index]) bd[index].children = cur as ScoreBreakdownChildren;
      setItem?.(bd);
    }
  }, [cur]);

  useEffect(() => {
    setCur(child || breakdown);
  }, [child, breakdown]);

  return (
    <Flex flexDir="column" flex="1">
      {cur.map((item, idx) => (
        <>
          <Flex key={+idx + item.label} flexDir="column" flex="1">
            <label>
              Weight for {item.label} <br />
              <Input
                type="number"
                width="10ch"
                defaultValue={item.weight}
                step="0.1"
                appearance="initial !important"
                onChange={ev => onChange(idx, +ev.target.value)}
              />{' '}
              * {item.value}
            </label>
          </Flex>
          {item.children ? (
            <InputTree
              breakdown={breakdown}
              child={item.children}
              setItem={setCur}
              index={idx}
            />
          ) : null}
        </>
      ))}
    </Flex>
  );
};

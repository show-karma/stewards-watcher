/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Flex, Input } from '@chakra-ui/react';
import { IBreakdownProps, useScoreBreakdown } from 'contexts/scoreBreakdown';
import { ScoreBreakdownCalc } from 'karma-score';

interface Props extends IBreakdownProps {
  child?: ScoreBreakdownCalc;
  index?: number;
  onUpdate?: (child: ScoreBreakdownCalc, index: number) => void;
}

export const InputTree: React.FC<Props> = ({
  child,
  address,
  index,
  onUpdate,
}) => {
  const { breakdown, setBreakdown } = useScoreBreakdown();

  const onChange = (curIndex: number, weight: number) => {
    if (!onUpdate) {
      const bd = [...breakdown];
      bd[curIndex].weight = weight;
      setBreakdown(bd);
    } else if (typeof index !== 'undefined' && index >= 0 && child) {
      const cbd = [...child];
      cbd[curIndex].weight = weight;
      onUpdate(cbd, index);
    }
  };

  const onUpdateChild = (curChild: ScoreBreakdownCalc, childIndex: number) => {
    if (!onUpdate) {
      const bd = [...breakdown];
      bd[childIndex].children = curChild;
      setBreakdown(bd);
    } else if (typeof index !== 'undefined' && index >= 0 && child) {
      const cbd = [...child];
      cbd[childIndex].children = curChild;
      onUpdate(cbd, index);
    }
  };

  return (
    <Flex flexDir="column" flex="1">
      {child ? (
        <>
          {child.map((item, idx) => (
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
                  child={item.children}
                  index={idx}
                  address={address}
                  onUpdate={onUpdateChild}
                />
              ) : null}
            </>
          ))}
        </>
      ) : (
        <>
          {breakdown.map((item, idx) => (
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
                  child={item.children}
                  index={idx}
                  address={address}
                  onUpdate={onUpdateChild}
                />
              ) : null}
            </>
          ))}
        </>
      )}
    </Flex>
  );
};

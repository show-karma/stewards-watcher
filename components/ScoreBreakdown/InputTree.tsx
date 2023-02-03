/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { Flex, Input } from '@chakra-ui/react';
import { IBreakdownProps, useScoreBreakdown } from 'contexts/scoreBreakdown';
import { ScoreBreakdownCalc } from 'karma-score';

interface Props extends IBreakdownProps {
  child?: ScoreBreakdownCalc;
  index?: number;
}

export const InputTree: React.FC<Props> = ({ child, address }) => {
  const { breakdown, setBreakdown } = useScoreBreakdown();

  const onChange = (index: number, value: number) => {
    const bd = [...breakdown];
    bd[index].weight = value;
    setBreakdown(bd);
  };

  const onChangeChild = (index: number, value: number) => {
    //
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
                />
              ) : null}
            </>
          ))}
        </>
      )}
    </Flex>
  );
};

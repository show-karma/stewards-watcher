/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { IBreakdownProps, useScoreBreakdown } from 'contexts/scoreBreakdown';
import { ScoreBreakdownCalc } from 'karma-score';
import { InputDisplay } from './InputDisplay';

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

  return child ? (
    <>
      {child.map((item, idx) => (
        <>
          {typeof item.weight !== 'undefined' && (
            <InputDisplay item={item} index={idx} onChange={onChange} />
          )}
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
          {typeof item.weight !== 'undefined' && (
            <InputDisplay item={item} index={idx} onChange={onChange} />
          )}
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
  );
};

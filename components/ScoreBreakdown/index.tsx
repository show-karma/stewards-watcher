import { Flex } from '@chakra-ui/react';
import { useScoreBreakdown } from 'contexts/scoreBreakdown';
import { ScoreCalculator } from 'karma-score';
import { InputTree } from './InputTree';

export const ScoreBreakdown: React.FC = () => {
  const { score, address, period, breakdown } = useScoreBreakdown();

  return (
    <>
      <Flex width="100px">
        Address: {address}
        <br />
        Period: {period}
        <br />
        Score: {score}
        <br />
        Math:
        {ScoreCalculator.breakdownToString(breakdown, true)}
      </Flex>
      <Flex flex="1">
        <InputTree address={address} />
      </Flex>
    </>
  );
};

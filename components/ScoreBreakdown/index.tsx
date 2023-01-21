import { Flex } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useDAO } from 'contexts';
import { ScoreBreakdownCalc, ScoreCalculator } from 'karma-score';
import { useEffect, useState } from 'react';
import { fetchScoreBreakdown } from 'utils/fetchScoreBreakdown';
import { InputTree } from './InputTree';

interface Props {
  address: string;
  period: 'lifetime' | '180d' | '30d';
  type: 'gitcoinHealthScore' | 'forumScore' | 'karmaScore';
}

export const ScoreBreakdown: React.FC<Props> = ({ address, period, type }) => {
  const {
    daoInfo: { config },
  } = useDAO();

  const [breakdown, setBreakdown] = useState<ScoreBreakdownCalc>([]);

  const [score, setScore] = useState<number>(0);

  const { data } = useQuery({
    queryKey: ['userbreakdown'],
    queryFn: () =>
      fetchScoreBreakdown(address, config.DAO_KARMA_ID, type, period),
    onSuccess: result => {
      setBreakdown(result.breakdown);
    },
  });

  useEffect(() => {
    setScore(ScoreCalculator.calculate(breakdown));
  }, [breakdown]);

  return (
    <>
      <Flex width="100px">
        Address: {address}
        <br />
        Period: {period}
        <br />
        Score: {score}
      </Flex>
      <Flex flex="1">
        <InputTree breakdown={breakdown} setItem={setBreakdown} />
      </Flex>
    </>
  );
};

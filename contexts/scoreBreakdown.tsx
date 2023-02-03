import { useDAO } from 'contexts';
import { ScoreBreakdownCalc, ScoreCalculator } from 'karma-score';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { fetchScoreBreakdown } from 'utils/fetchScoreBreakdown';

export interface IBreakdownProps {
  address: string;
  period?: 'lifetime' | '180d' | '30d';
  type?: 'gitcoinHealthScore' | 'forumScore' | 'karmaScore';
}

interface IScoreBreakdownContext extends IBreakdownProps {
  breakdown: ScoreBreakdownCalc;
  setBreakdown: (value: ScoreBreakdownCalc) => void;
  score: number;
}

export const ScoreBreakdownContext = createContext(
  {} as IScoreBreakdownContext
);

export const ScoreBreakdownProvider: React.FC<
  IBreakdownProps & { children: React.ReactNode }
> = ({ address, period, type, children }) => {
  const [breakdown, setScoreBreakdown] = useState<ScoreBreakdownCalc>([]);
  const [score, setScore] = useState(0);

  const setBreakdown = (value: ScoreBreakdownCalc) => {
    setScoreBreakdown(value);
    const newScore = ScoreCalculator.calculate(value);
    setScore(newScore);
  };

  const {
    daoInfo: { config },
  } = useDAO();

  const fetchBreakdown = async () => {
    const result = await fetchScoreBreakdown(
      address,
      config.DAO_KARMA_ID,
      type,
      period
    );
    setBreakdown(result.breakdown);
  };

  useEffect(() => {
    fetchBreakdown();
  }, [address]);

  const values = useMemo(
    () => ({ breakdown, setBreakdown, score, address, period, type }),
    [address, score, breakdown]
  );

  return (
    <ScoreBreakdownContext.Provider value={values}>
      {children}
    </ScoreBreakdownContext.Provider>
  );
};

export const useScoreBreakdown = () => useContext(ScoreBreakdownContext);

import { Box, Flex, Table, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { useScoreBreakdown } from 'contexts/scoreBreakdown';
import { ScoreCalculator } from 'karma-score';
import { useEffect, useMemo } from 'react';
import { InputTree } from './InputTree';

export const ScoreBreakdown: React.FC = () => {
  const { score, address, period, breakdown } = useScoreBreakdown();
  const [formulaWithLabels, formula] = useMemo(
    () => [
      ScoreCalculator.breakdownToString(breakdown, true),
      ScoreCalculator.breakdownToString(breakdown),
    ],
    [score]
  );
  useEffect(() => {
    console.log(ScoreCalculator.breakdownToString(breakdown, true));
  }, [breakdown]);
  return (
    <Box>
      <Flex flex="1">
        <Table>
          <Thead>
            <Th>Metric</Th>
            <Th>Value</Th>
            <Th>Weight</Th>
          </Thead>
          <InputTree address={address} />
          <Tr>
            <Td colSpan={2}>Total</Td>
            <Td>
              <Text fontSize="2em">{score}</Text>
            </Td>
          </Tr>
        </Table>
      </Flex>
      <Table mt="14">
        <Tr>
          <Td>Period</Td>
          <Td>{period}</Td>
        </Tr>
        <Tr>
          <Td>Scoring Formula</Td>
          <Td>
            <code>{formulaWithLabels}</code>
          </Td>
        </Tr>
        <Tr>
          <Td>Score:</Td>
          <Td>
            <pre>{formula}</pre>
            <br />= {score}
          </Td>
        </Tr>
      </Table>
    </Box>
  );
};

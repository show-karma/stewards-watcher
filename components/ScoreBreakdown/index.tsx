import {
  Box,
  Flex,
  SkeletonText,
  Table,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useScoreBreakdown } from 'contexts/scoreBreakdown';
import { ScoreCalculator } from 'karma-score';
import { useMemo } from 'react';
import { InputTree } from './InputTree';

export const ScoreBreakdown: React.FC = () => {
  const { score, address, period, breakdown, loading } = useScoreBreakdown();
  const [formulaWithLabels, formula] = useMemo(
    () => [
      ScoreCalculator.breakdownToString(breakdown, true),
      ScoreCalculator.breakdownToString(breakdown),
    ],
    [score]
  );

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
              <SkeletonText isLoaded={!loading}>
                <Text fontSize="2em">{Math.floor(score)}</Text>
              </SkeletonText>
            </Td>
          </Tr>
        </Table>
      </Flex>
      <Table mt="14">
        <Tr>
          <Td>Period</Td>
          <Td>
            <SkeletonText isLoaded={!loading}>{period}</SkeletonText>
          </Td>
        </Tr>
        <Tr>
          <Td>Scoring Formula</Td>
          <Td>
            <SkeletonText isLoaded={!loading}>
              <code>{formulaWithLabels}</code>
            </SkeletonText>
          </Td>
        </Tr>
        <Tr>
          <Td>Score:</Td>
          <Td>
            <SkeletonText isLoaded={!loading}>
              <pre>{formula}</pre>
              <br />= Floor({score}) = {Math.floor(score)}
            </SkeletonText>
          </Td>
        </Tr>
      </Table>
    </Box>
  );
};

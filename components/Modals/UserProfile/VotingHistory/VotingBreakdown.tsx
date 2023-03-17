import { Flex, Spinner, Text } from '@chakra-ui/react';
import { useDAO, useDelegates, useVotes } from 'contexts';
import { FC, useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  ArcElement,
} from 'chart.js';
import axios from 'axios';
import { formatNumber, formatNumberPercentage } from 'utils';
import dayjs from 'dayjs';
import { InfoIcon } from 'components/Icons';

ChartJS.register(ArcElement, Tooltip, Legend);

interface IDoughnutComponentProps {
  isLoading: boolean;
  options: ChartOptions<'doughnut'>;
  data: ChartData<'doughnut'>;
  hasError: boolean;
  doughnutLabelsLine: {
    id: string;
    beforeDraw(chart: {
      data: any;
      getDatasetMeta?: any;
      ctx?: any;
      chartArea?: any;
    }): void;
  };
}

const ChartComponent: FC<IDoughnutComponentProps> = ({
  data,
  isLoading,
  options,
  hasError,
  doughnutLabelsLine,
}) => {
  const { theme } = useDAO();
  if (isLoading) {
    return (
      <Flex
        w={{ base: 'full', sm: '400px' }}
        h="300px"
        align="center"
        justify="center"
        position="relative"
        zIndex="1"
      >
        <Flex
          top="0"
          right="0"
          position="absolute"
          w="100%"
          h="100%"
          align="center"
          justify="center"
        >
          <Spinner
            position="absolute"
            zIndex="10000"
            color={theme.modal.votingHistory.headline}
          />
          <Flex
            bg="rgba(217, 217, 217, 0.05)"
            w="100%"
            h="100%"
            backdropFilter="blur(15px)"
            position="absolute"
          />
        </Flex>
        <Doughnut options={options} data={data} />
      </Flex>
    );
  }

  if (hasError) {
    return (
      <Flex
        w={{ base: 'full', sm: '400px' }}
        h="300px"
        align="center"
        justify="center"
        position="relative"
        zIndex="2"
      >
        <Flex
          top="0"
          right="0"
          position="absolute"
          w="100%"
          h="100%"
          align="center"
          justify="center"
          flexDir="column"
        >
          <Flex
            zIndex="10000"
            align="center"
            justify="center"
            flexDir="column"
            color={theme.modal.votingHistory.headline}
          >
            <InfoIcon w="10" h="10" />
            <Text
              textAlign="center"
              fontWeight="400"
              fontSize="14px"
              maxW="270px"
            >
              There is no delegation activity for this contributor yet.
            </Text>
          </Flex>
          <Flex
            bg="rgba(217, 217, 217, 0.05)"
            w="100%"
            h="100%"
            backdropFilter="blur(15px)"
            position="absolute"
          />
        </Flex>
        <Doughnut options={options} data={data} />
      </Flex>
    );
  }

  return (
    <Flex w="full" px="4" py="2" height="300px" width="400px" zIndex="3">
      <Doughnut
        options={options}
        data={data}
        plugins={[doughnutLabelsLine]}
        height="300px"
        width="400px"
      />
    </Flex>
  );
};

const defaultLabels = ['Yes', 'No', 'Abstain', 'Multiple', 'Other'];
const defaultData = [1, 4, 2, 8, 6];
const defaultBgColors = ['#02E2AC', '#CA4444', '#DFDFDF', '#2980b9', '#FFF7AE'];

export const VotingBreakdown: FC = () => {
  const { theme } = useDAO();
  const [labels, setLabels] = useState<string[]>(defaultLabels);
  const [dataset, setDataset] = useState<number[]>(defaultData);
  const [backgroundColor, setBackgroundColor] =
    useState<string[]>(defaultBgColors);
  const {
    voteBreakdown,
    isVoteBreakdownLoading: isLoading,
    isVoteBreakdownError: hasError,
  } = useVotes();

  const data: ChartData<'doughnut'> = {
    labels,
    datasets: [
      {
        label: 'Votes',
        data: dataset,
        backgroundColor,
        borderColor: backgroundColor,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    maintainAspectRatio: false,
    interaction: {},
    cutout: '70%',
    animation: { duration: isLoading || hasError ? 0 : 1000 },
    layout: {
      padding: 70,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        display: false,
      },
      title: {
        display: false,
        text: '',
      },
    },
  };

  const doughnutLabelsLine = {
    id: 'doughnutLabelsLine',
    beforeDraw(chart: {
      data: any;
      getDatasetMeta?: any;
      ctx?: any;
      chartArea?: any;
    }) {
      const {
        ctx,
        data: currentData,
        chartArea: { width, height, top, left },
      } = chart;
      ctx.save();
      const halfWidth = width / 2 + left;
      const halfHeight = height / 2 + top;
      chart.data.datasets.forEach(
        // eslint-disable-next-line id-length
        (currentDataset: { data: any[]; backgroundColor: any }, i: any) => {
          const totalPercentage = currentDataset.data.reduce(
            (itemA: any, itemB: any) => itemA + itemB,
            0
          );
          chart
            .getDatasetMeta(i)
            .data.forEach((datapoint: any, index: number) => {
              const { x: xAxis, y: yAxis } = chart
                .getDatasetMeta(0)
                .data[index].tooltipPosition();
              ctx.font = 'bold 12px sans-serif';
              ctx.fillStyle = currentData.datasets[0].borderColor[index];
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';

              if (datapoint >= 3) {
                ctx.fillText(
                  `${currentDataset.data[index]}%(${currentDataset.data[index]})`,
                  xAxis,
                  yAxis
                );
              } else {
                const xLine = xAxis >= halfWidth ? xAxis + 15 : xAxis - 15;
                const yLine = yAxis >= halfHeight ? yAxis + 25 : yAxis - 25;
                const extraLine = xAxis >= halfWidth ? 15 : -15;

                ctx.strokeStyle = currentData.datasets[0].borderColor[index];
                ctx.beginPath();
                ctx.moveTo(xAxis, yAxis);
                ctx.lineTo(xLine, yLine);
                ctx.lineTo(xLine + extraLine, yLine);
                ctx.stroke();
                const percentageCalculated =
                  (currentDataset.data[index] / totalPercentage) * 100;
                const percent = `${formatNumberPercentage(
                  percentageCalculated
                )}`;
                const label = chart.data.labels[index];
                const votes = `(${formatNumber(
                  currentDataset.data[index]
                )} votes)`;
                const textAlignPos = xAxis >= halfWidth ? 'left' : 'right';
                ctx.font = '600 14px Poppins';
                ctx.color = currentDataset.backgroundColor;
                ctx.textBaseline = 'bottom';
                ctx.fillStyle = currentDataset.backgroundColor;
                ctx.textAlign = textAlignPos;
                ctx.fillText(percent, xLine + extraLine, yLine + 10);
                ctx.fillText(label, xLine + extraLine, yLine - 3);
                ctx.fillText(votes, xLine + extraLine, yLine + 24);
              }
            });
        }
      );
    },
  };

  const setupDataset = () => {
    if (!voteBreakdown) {
      setLabels(defaultLabels);
      setDataset(defaultData);
      return;
    }
    const { positiveCount, negativeCount, abstainCount, multiple, other } =
      voteBreakdown;

    const labelsDictionary: {
      [key: string]: number;
    } = {
      Yes: positiveCount,
      No: negativeCount,
      Abstain: abstainCount,
      Multiple: multiple,
      Other: other,
    };

    // const defaultLabels = ['Yes', 'No', 'Abstain', 'Multiple', 'Other'];
    const newDataset: number[] = [];
    const newLabels: string[] = [];
    const newBgColors: string[] = [];
    defaultLabels.forEach((label, index) => {
      if (labelsDictionary[label] !== 0) {
        newLabels.push(label);
        newDataset.push(labelsDictionary[label]);
        newBgColors.push(defaultBgColors[index]);
      }
    });

    setLabels(newLabels);
    setBackgroundColor(newBgColors);
    setDataset(newDataset);
  };

  useEffect(() => {
    setupDataset();
  }, [voteBreakdown]);

  return (
    <Flex borderRadius="md" flexDir="column" w="full">
      <Flex
        align="center"
        gap="20"
        bg={theme.modal.votingHistory.proposal.bg}
        px="6"
        py="4"
        borderTopRadius="md"
      >
        <Text
          color={theme.modal.votingHistory.proposal.title}
          fontWeight="semibold"
          fontSize="md"
        >
          Voting Breakdown
        </Text>
      </Flex>
      <Flex
        bg={`${theme.modal.votingHistory.proposal.bg}40`}
        borderBottomRadius="md"
        px="1.5"
        py="1"
        position="relative"
      >
        <ChartComponent
          data={data}
          options={options}
          isLoading={isLoading}
          hasError={hasError}
          doughnutLabelsLine={doughnutLabelsLine}
        />
        <Flex
          position="absolute"
          alignItems="center"
          justifyContent="center"
          zIndex="0"
          width="full"
          height="full"
          flexDir="column"
          fontFamily="Poppins"
          fontWeight="600"
          fontSize="sm"
          textAlign="center"
        >
          <Text>Total Votes</Text>
          {voteBreakdown && (
            <Text>{formatNumber(voteBreakdown.totalVotes)}</Text>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

import { Flex, Grid, Icon, IconProps, Spinner, Text } from '@chakra-ui/react';
import { useDAO, useTokenHolders } from 'contexts';
import { FC, useState, useMemo, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ScriptableContext,
  ChartOptions,
  ChartData,
  TimeScale,
} from 'chart.js';
import { formatNumber, truncateAddress } from 'utils';
import dayjs from 'dayjs';
import { InfoIcon } from 'components/Icons';
import utc from 'dayjs/plugin/utc';
import 'chartjs-adapter-moment';
import { IDelegatingHistories } from 'types';
import annotationPlugin from 'chartjs-plugin-annotation';

dayjs.extend(utc);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  TimeScale,
  annotationPlugin
);

interface ISinceDelegationProps {
  delegateHistory: IDelegatingHistories[];
  selectedDelegation: IDelegatingHistories;
}

const defaultLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

const defaultData = [1, 4, 2, 8];

interface IChartComponentProps {
  isLoading: boolean;
  options: ChartOptions<'line'>;
  data: ChartData<'line'>;
  hasError: boolean;
}

const ChartComponent: FC<IChartComponentProps> = ({
  data,
  isLoading,
  options,
  hasError,
}) => {
  const { theme } = useDAO();
  const lineRef = useRef();
  if (isLoading) {
    return (
      <Flex
        w={{ base: 'full', sm: '400px' }}
        h="200px"
        align="center"
        justify="center"
        position="relative"
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
        <Line options={options} data={data} />
      </Flex>
    );
  }

  if (hasError) {
    return (
      <Flex
        w={{ base: 'full', sm: '400px' }}
        h="200px"
        align="center"
        justify="center"
        position="relative"
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
        <Line options={options} data={data} />
      </Flex>
    );
  }

  return <Line options={options} data={data} ref={lineRef} />;
};

export const DelegationHistory: FC<ISinceDelegationProps> = ({
  delegateHistory,
  selectedDelegation,
}) => {
  const { theme } = useDAO();
  const [labels, setLabels] = useState<string[]>(defaultLabels);
  const [dataset, setDataset] = useState<number[]>(defaultData);
  const {
    isLoadingSelectedAddresses: isLoading,
    isFetchingSelectedAddresses: isFetching,
    errorSelectedAddresses,
    selectedAddressesData: fetchedData,
  } = useTokenHolders();

  const hasError = !!errorSelectedAddresses;

  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Total',
        data: dataset,
        borderColor: 'transparent',
        pointBorderColor: theme.tokenHolders.delegations.chart.point,
        pointBackgroundColor: theme.tokenHolders.delegations.chart.point,
        backgroundColor: theme.tokenHolders.delegations.chart.datasetColor,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    animation: { duration: isLoading || hasError ? 0 : 1000 },
    elements: {
      point: {
        radius: 5,
        hoverRadius: 4,
      },
    },
    scales: {
      // eslint-disable-next-line id-length
      y: {
        min: 0,
        max: 2,
        grid: {
          display: true,
          color: `${theme.tokenHolders.delegations.text.primary}40`,
        },
        display: true,
        border: {
          dash: [20, 12],
          display: true,
        },
        ticks: {
          callback: () => '',
        },
      },
      // eslint-disable-next-line id-length
      x: {
        type: 'time',

        grid: {
          display: false,
          color: theme.modal.votingHistory.proposal.divider,
        },
        time: {
          parser: 'MM-DD-YY',
          unit: 'day',
          displayFormats: {
            day: 'MMM, YY',
          },
        },
        ticks: {
          color: `${theme.tokenHolders.delegations.text.primary}BF`,
          font: {
            family: 'Poppins',
          },
          autoSkip: true,
          callback: label => {
            if (
              dayjs.unix(selectedDelegation.timestamp).format('MM-DD-YY') ===
              dayjs(label as string).format('MM-DD-YY')
            ) {
              return dayjs(label as string).format('DD MMM, YY');
            }
            return '';
          },
        },
      },
    },
    interaction: {},
    plugins: {
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            xMin: dayjs.unix(selectedDelegation.timestamp).format('MM-DD-YY'),
            xMax: dayjs.unix(selectedDelegation.timestamp).format('MM-DD-YY'),
            yMin: 0,
            yMax: 1 * 0.95,
            borderColor: `${theme.tokenHolders.delegations.text.primary}40`,
            borderWidth: 2,
            shadowBlur: 5,
            borderShadowColor: theme.tokenHolders.delegations.text.primary,
          },
        },
      },
      legend: {
        position: 'bottom' as const,
        display: false,
      },
      tooltip: {
        callbacks: {
          title(tooltipItems) {
            // return dayjs(tooltipItems[0].label).format('MMMM DD, YYYY');
            return 'Delegated to';
          },
          label(item) {
            return truncateAddress(delegateHistory[item.dataIndex].toDelegate);
          },
        },
        titleFont: {
          size: 16,
          weight: 'normal',
        },
        backgroundColor: '#fff',
        titleColor: 'black',
        bodyFont: {
          size: 16,
          weight: 'semibold',
        },
        bodyColor: '#000',
        displayColors: false,
      },
      title: {
        display: false,
        text: '',
      },
    },
  };

  const setupDataset = () => {
    if (!delegateHistory.length) {
      setLabels([]);
      setDataset([]);
      return;
    }

    const formattedDays: string[] = [];
    delegateHistory.forEach(item => {
      formattedDays.push(
        dayjs(item.timestamp * 1000)
          .utc()
          .format('MM-DD-YY')
      );
    });

    setLabels(formattedDays);

    const orderedBalances: number[] = [];
    delegateHistory.forEach(item => {
      const formattedNumber = item.amount
        ? Math.floor(item.amount / 10 ** 18)
        : 1;
      orderedBalances.push(formattedNumber);
    });

    setDataset(orderedBalances);
  };

  useMemo(() => {
    setupDataset();
  }, [delegateHistory]);

  return (
    <Flex
      flexDir="row"
      w={{ base: 'full' }}
      minW="max-content"
      maxW={{ base: '100%', lg: '50%' }}
      align="center"
      h="full"
      minH="360px"
      maxH="360px"
    >
      <Text
        w="max-content"
        fontFamily="Poppins"
        fontWeight="400"
        fontSize="14px"
        color={theme.tokenHolders.delegations.text.primary}
        sx={{
          writingMode: 'vertical-lr',
          transform: 'rotate(180deg)',
        }}
      >{`Tokens Delegated ->`}</Text>
      <Flex
        flexDir="column"
        align="center"
        w="full"
        h="full"
        minH="360px"
        maxH="360px"
      >
        <Flex
          flexDir="column"
          w="full"
          h="full"
          minH={{ base: '300px', lg: '360px' }}
          maxH={{ base: '300px', lg: '360px' }}
          align="center"
          bg={theme.tokenHolders.delegations.bg.primary}
          borderRadius="md"
          borderBottomRadius="none"
        >
          <Flex
            bg={theme.tokenHolders.delegations.bg.secondary}
            align="center"
            py="5"
            px="4"
            borderRadius="md"
            borderBottomRadius="none"
            gap="1"
            w="full"
          >
            <Text
              fontSize="md"
              color={theme.tokenHolders.delegations.text.primary}
              fontWeight="semibold"
            >
              Delegation History
            </Text>
          </Flex>

          <Flex w="full" h="full" maxH="full" py="2" px="2">
            <ChartComponent
              data={data}
              options={options}
              isLoading={isLoading && isFetching}
              hasError={hasError}
            />
          </Flex>
        </Flex>
        <Text
          fontFamily="Poppins"
          fontWeight="400"
          fontSize="14px"
          color={theme.tokenHolders.delegations.text.primary}
        >{`Date ->`}</Text>
      </Flex>
    </Flex>
  );
};

import { Flex, Spinner, Text } from '@chakra-ui/react';
import { useDAO, useDelegates } from 'contexts';
import { FC, useEffect, useState } from 'react';
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
import axios from 'axios';
import { formatNumber } from 'utils';
import dayjs from 'dayjs';
import { monthDictionary } from 'helpers';
import { InfoIcon } from 'components/Icons';
import 'chartjs-adapter-moment';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  TimeScale
);

interface IAPIData {
  balance: number;
  timestamp: number;
}

const menuOptions = [
  {
    label: 'Monthly',
    value: 1,
  },
  {
    label: 'Half yearly',
    value: 6,
  },
  {
    label: 'Yearly',
    value: 12,
  },
];

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
  if (isLoading) {
    return (
      <Flex
        w="400px"
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
        w="400px"
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

  return <Line options={options} data={data} width="400px" height="200px" />;
};

export const DelegatedVotesChanges: FC = () => {
  const { theme, daoInfo } = useDAO();
  const { profileSelected } = useDelegates();
  const [selectedInterval, setInterval] = useState(menuOptions[2]);
  // const [data, setData] = useState<IAPIData[]>([]);
  const [labels, setLabels] = useState<string[]>(defaultLabels);
  const [dataset, setDataset] = useState<number[]>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const data: ChartData<'line'> = {
    labels,
    datasets: [
      {
        fill: true,
        label: 'Total',
        data: dataset,
        borderColor: 'transparent',
        pointBorderColor: theme.modal.votingHistory.modules?.chart.point,
        pointBackgroundColor: theme.modal.votingHistory.modules?.chart.point,
        backgroundColor: (context: ScriptableContext<'line'>) => {
          const { ctx } = context.chart;
          const gradient = ctx.createLinearGradient(0, 0, 0, 200);
          gradient.addColorStop(
            0,
            `${theme.modal.votingHistory.modules?.chart.openGradient}`
          );
          gradient.addColorStop(
            1,
            `${theme.modal.votingHistory.modules?.chart.endGradient}`
          );
          return gradient;
        },
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      // eslint-disable-next-line id-length
      y: {
        grid: {
          display: true,
          color: theme.modal.votingHistory.proposal.divider,
        },
        display: true,
        ticks: {
          callback: label => formatNumber(label as number),
        },
      },
      // eslint-disable-next-line id-length
      x: {
        type: 'time',
        grid: {
          display: true,
          color: theme.modal.votingHistory.proposal.divider,
        },
        time: {
          parser: 'MMM DD YY',
          unit: 'day',
          displayFormats: {
            day: 'MMM DD, YY',
          },
        },
        ticks: {
          autoSkip: true,
          autoSkipPadding: 10,
        },
      },
    },
    interaction: {},
    plugins: {
      legend: {
        position: 'bottom' as const,
        display: false,
      },
      tooltip: {
        callbacks: {
          title(tooltipItems) {
            return dayjs(tooltipItems[0].label).format('MMMM DD, YYYY');
          },
        },
      },
      title: {
        display: false,
        text: '',
      },
    },
  };

  const setupDataset = (fetchedData: IAPIData[], interval: number) => {
    if (!fetchedData.length) {
      setLabels([]);
      setDataset([]);
      return;
    }
    // const getTimestamp = new Date().getTime() / 1000;

    // const getDays = fetchedData.filter(
    //   item => item.timestamp >= getTimestamp - 2592000 * interval
    // );
    const formatDays = fetchedData.map(item =>
      dayjs(item.timestamp * 1000).format('MMM DD YY')
    );
    setLabels(formatDays);
    const formatBalances = fetchedData.map(item => {
      const formattedNumber = Math.floor(item.balance / 10 ** 18);
      return formattedNumber;
    });
    setDataset(formatBalances);
  };

  const fetchData = async () => {
    try {
      setHasError(false);
      setIsLoading(true);
      const { data: fetchedData } = (
        await axios.get(
          `${process.env.NEXT_PUBLIC_KARMA_API}/dao/${daoInfo.config.DAO_KARMA_ID}/delegates/${profileSelected?.address}/voting-power-timeline`
        )
      ).data;
      const { timeline } = fetchedData;

      setupDataset(timeline, selectedInterval.value);
    } catch (error: any) {
      console.error(error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // const handleIntervalChange = (option: { label: string; value: number }) => {
  //   setInterval(option);
  //   setupDataset(data, option.value);
  // };

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
          Delegated Votes
        </Text>
        {/* <Menu placement="bottom-end">
          <MenuButton
            as={Button}
            rightIcon={<HiChevronDown />}
            bg="transparent"
            py="0"
            gap="0"
            _hover={{}}
            _active={{}}
          >
            {selectedInterval.label}
          </MenuButton>
          <MenuList
            bg={`${theme.modal.votingHistory.proposal.bg}`}
            width="max-content"
            maxW="max-content"
            minW="max-content"
          >
            {menuOptions.map((option, index) => (
              <MenuItem
                key={+index}
                onClick={() => handleIntervalChange(option)}
                bg={`${theme.modal.votingHistory.proposal.bg}40`}
                _hover={{
                  opacity: 0.8,
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu> */}
      </Flex>
      <Flex
        bg={`${theme.modal.votingHistory.proposal.bg}40`}
        borderBottomRadius="md"
        px="1.5"
        py="1"
      >
        <ChartComponent
          data={data}
          options={options}
          isLoading={isLoading}
          hasError={hasError}
        />
      </Flex>
    </Flex>
  );
};

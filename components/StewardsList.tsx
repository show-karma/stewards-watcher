import { Flex, Spinner } from '@chakra-ui/react';
import { THEME } from 'configs';
import { useStewards } from 'contexts';
import { FC } from 'react';
import { StewardCard } from './StewardCard';

const loadingArray = Array(5).fill(undefined);

export const StewardsList: FC = () => {
  const { stewards, isLoading } = useStewards();

  return (
    <Flex
      flexWrap="wrap"
      gap="8"
      w="full"
      align="center"
      justify="center"
      my="8"
      px={{ base: '4', lg: '8' }}
    >
      {isLoading
        ? loadingArray.map((_, index) => <StewardCard key={+index} />)
        : stewards.map((item, index) => (
            <StewardCard key={+index} data={item} />
          ))}
    </Flex>
  );
};

import {
  Box,
  Flex,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useDAO } from 'contexts';
import { FC, ReactNode, useEffect, useState } from 'react';
import { formatNumber, getDelegateVotesByNetwork } from 'utils';
import { Chain } from 'wagmi';

interface DelegatedTokensByNetworkProps {
  children: ReactNode;
  delegateAddress: string;
}

type BreakdownData = {
  votes: number | string;
  chain: Chain;
};

export const DelegatedTokensByNetwork: FC<DelegatedTokensByNetworkProps> = ({
  children,
  delegateAddress,
}) => {
  const { theme, daoInfo } = useDAO();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [breakdownData, setBreakdownData] = useState<
    BreakdownData[] | undefined
  >(undefined);

  const getBreakdownData = async () => {
    setIsLoading(true);
    try {
      const fetchedData = await getDelegateVotesByNetwork(
        daoInfo.config.DAO_KARMA_ID,
        delegateAddress
      );
      const newBreakdownData: BreakdownData[] = [];

      fetchedData.forEach(data => {
        const foundChain = daoInfo.config.DAO_CHAINS.find(
          chain => chain.id === data.chainId
        );
        if (!foundChain) return;
        newBreakdownData.push({
          votes: data.votes,
          chain: foundChain,
        });
      });

      setBreakdownData(newBreakdownData);
    } catch (error) {
      console.log('Error fetching breakdown data', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) getBreakdownData();
  }, [isOpen]);

  return (
    <Popover isOpen={isOpen}>
      <PopoverTrigger>
        <Box cursor="pointer" onClick={() => setIsOpen(!isOpen)}>
          {children}
        </Box>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton onClick={() => setIsOpen(false)} />
        <PopoverHeader
          bg={theme.card.background}
          color={theme.card.text.primary}
        >
          Voting power by network
        </PopoverHeader>
        <PopoverBody bg={theme.card.background} color={theme.card.text.primary}>
          {isLoading ? (
            <Flex
              w="full"
              alignItems="center"
              justifyContent="center"
              py="4"
              px="4"
            >
              <Spinner />
            </Flex>
          ) : (
            <Flex flexDir="column" gap="2">
              {breakdownData?.length ? (
                breakdownData?.map(data => (
                  <Flex
                    key={data.chain.id}
                    flexDir="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap="4"
                  >
                    <Flex flexDir="row" gap="2" align="center">
                      <Image
                        src={`/images/chains/${data.chain.network}.svg`}
                        alt={data.chain.name}
                        boxSize="24px"
                        borderRadius="full"
                      />
                      <Text fontWeight="bold" color={theme.card.text.primary}>
                        {data.chain.name}
                      </Text>
                    </Flex>
                    <Text fontWeight="normal" color={theme.card.text.primary}>
                      {formatNumber(data.votes)}
                    </Text>
                  </Flex>
                ))
              ) : (
                <Text color={theme.card.text.primary}>
                  Not enough data about this delegate.
                </Text>
              )}
            </Flex>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

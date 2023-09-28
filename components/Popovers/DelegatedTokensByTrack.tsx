import {
  Box,
  Flex,
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
import axios from 'axios';
import { useDAO } from 'contexts';
import { API_ROUTES } from 'helpers';
import { FC, ReactNode, useEffect, useState } from 'react';
import { formatNumber } from 'utils';

interface DelegatedTokensByTrackProps {
  children: ReactNode;
  delegateAddress: string;
}

type BreakdownData = {
  id: string;
  displayName: string;
  value: number | string;
};

export const DelegatedTokensByTrack: FC<DelegatedTokensByTrackProps> = ({
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
      const response = await axios.get(
        `/api/${daoInfo.config.DAO_KARMA_ID}/${delegateAddress}/delegated-votes-breakdown`
      );
      const { groupByTrack } = response.data;
      const { data } = await axios.get(
        API_ROUTES.DAO.TRACKS(daoInfo.config.DAO_KARMA_ID)
      );
      const { tracks } = data.data;
      const breakdownArray = tracks.map(
        (track: {
          displayName: string;
          name: string;
          id: number;
          daoName: string;
        }) => ({
          id: track.id,
          displayName: track.displayName,
          value: groupByTrack[track.id] || 0,
        })
      );
      setBreakdownData(breakdownArray);
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
          Voting power by track
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
            <Flex flexDir="column">
              {breakdownData?.length ? (
                breakdownData?.map(track => (
                  <Flex
                    key={track.id}
                    flexDir="row"
                    alignItems="center"
                    justifyContent="space-between"
                    gap="4"
                  >
                    <Text fontWeight="bold" color={theme.card.text.primary}>{`${
                      daoInfo.config.TRACKS_DICTIONARY?.[track.displayName]
                        .emoji
                    } ${track.displayName}`}</Text>
                    <Text fontWeight="normal" color={theme.card.text.primary}>
                      {formatNumber(track.value)}
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

/* eslint-disable no-nested-ternary */
import {
  Flex,
  Icon,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import axios from 'axios';
import { useDAO, useDelegates } from 'contexts';
import { api, easQueryWithAddress } from 'helpers';
import { useEffect, useState } from 'react';
import { EndorsementData } from 'types';
import { AttestationResponse } from 'types/eas';
import {
  AttestationSchema,
  EASAttestation,
  easDelegateEndorseDictionary,
  formatDate,
  formatNumberPercentage,
  getEASChainInfo,
} from 'utils';
import { fetchENSNames } from 'utils/fetchENSName';
import { getAddress } from 'viem';
import ReactPaginate from 'react-paginate';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { CommentModal } from './CommentModal';

export const Endorsements = () => {
  const { profileSelected } = useDelegates();
  const [data, setData] = useState<EndorsementData[]>([]);

  const { daoInfo } = useDAO();
  const endorsersCounter = data.length;

  const [isLoading, setIsLoading] = useState(false);

  const getRecentAttestations = async () => {
    setIsLoading(true);
    const projectEnvironment = process.env.NEXT_PUBLIC_ENV || 'dev';
    const chainsInfo = easDelegateEndorseDictionary[projectEnvironment];

    if (!chainsInfo) {
      return;
    }

    const results: EASAttestation<AttestationSchema>[] = [];

    const fetchAttestations = async (chain: string) => {
      try {
        const checkSumAddress = getAddress(profileSelected?.address as string);
        const response = await axios.post<AttestationResponse>(
          chainsInfo[chain].easAPI,
          {
            query: easQueryWithAddress(
              getEASChainInfo(daoInfo.config.DAO_KARMA_ID).schemaId,
              checkSumAddress
            ),
          }
        );

        const schema = response.data?.data?.schema;
        if (schema && schema.attestations) {
          let uniqueAttestations: EASAttestation<AttestationSchema>[] = [];
          const uniqueAttesters: string[] = [];
          schema.attestations.forEach(attestation => {
            const easAttestation = new EASAttestation<AttestationSchema>(
              attestation
            );
            if (!uniqueAttesters.includes(easAttestation.attester)) {
              uniqueAttestations.push(easAttestation);
              uniqueAttesters.push(easAttestation.attester);
            } else {
              const lastAttest = schema.attestations.reduce(
                (lastAttestation, searchAttestation) => {
                  if (
                    attestation.attester === searchAttestation.attester &&
                    attestation.timeCreated >= searchAttestation.timeCreated
                  ) {
                    return searchAttestation;
                  }
                  return lastAttestation;
                }
              );
              if (lastAttest) {
                const filteredArray = uniqueAttestations.filter(
                  item =>
                    item.attester.toLowerCase() !==
                    attestation.attester.toLowerCase()
                );
                const newAttestation = new EASAttestation<AttestationSchema>(
                  lastAttest
                );
                filteredArray.push(newAttestation);
                uniqueAttestations = filteredArray;
              }
            }
          });

          results.push(...uniqueAttestations);
        }
      } catch (error) {
        console.error('Error fetching attestation data:', error);
      }
    };

    const chainPromises = Object.keys(chainsInfo).map(chain =>
      fetchAttestations(chain)
    );
    await Promise.all(chainPromises);

    const filteredResults = await Promise.all(
      results.map(async item => {
        let votingPower = 0;
        let ensName: string | undefined | null = '';
        const axiosClient = await api
          .get(`/dao/find-delegate`, {
            params: {
              dao: daoInfo.config.DAO_KARMA_ID,
              user: item.attester,
            },
          })
          .catch(() => null);
        if (axiosClient) {
          const { delegate: fetchedDelegate } = axiosClient.data.data;

          votingPower = fetchedDelegate.voteWeight;
          ensName = fetchedDelegate.ensName;
        }
        if (!ensName) {
          const fetched = await fetchENSNames([item.attester]);
          ensName = fetched[0].name;
        }

        const { comment } = item.decodedDataJson as any;

        return {
          addressOrENS: ensName || item.attester,
          date: item.timeCreated,
          votingPower: formatNumberPercentage(votingPower || 0),
          reason: comment,
        };
      })
    );

    const orderedDate = filteredResults.sort(
      (itemA, itemB) => itemB.date - itemA.date
    );
    setData(orderedDate);
    setIsLoading(false);
  };

  const getFormattedData = (date: number) =>
    formatDate(new Date(date * 1000).toUTCString(), 'MMM D, YYYY');

  useEffect(() => {
    if (profileSelected) {
      getRecentAttestations();
    }
  }, [profileSelected]);

  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 10;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = data.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);
  };

  return (
    <Flex
      mb="20"
      py="5"
      border="1px solid white"
      borderRadius="12px"
      flexDir="column"
    >
      <Flex px="6" flexDir="row" gap="1" alignItems="center">
        <Text fontSize="18px" fontWeight="700" color="white">
          Endorsers
        </Text>
        {endorsersCounter ? (
          <Text fontSize="14px" fontWeight="500" color="white">
            ({endorsersCounter})
          </Text>
        ) : null}
      </Flex>

      {isLoading ? (
        <Flex w="full" py="8" alignItems="center" justifyContent="center">
          <Spinner color="white" />
        </Flex>
      ) : endorsersCounter ? (
        <>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th
                    borderBottom="1px solid white"
                    fontSize="12px"
                    fontWeight="500"
                    color="#F2F4F7"
                  >
                    Address
                  </Th>
                  <Th
                    borderBottom="1px solid white"
                    fontSize="12px"
                    fontWeight="500"
                    color="#F2F4F7"
                  >
                    Voting Power
                  </Th>
                  <Th
                    borderBottom="1px solid white"
                    fontSize="12px"
                    fontWeight="500"
                    color="#F2F4F7"
                  >
                    Date
                  </Th>
                  <Th
                    borderBottom="1px solid white"
                    fontSize="12px"
                    fontWeight="500"
                    color="#F2F4F7"
                  />
                </Tr>
              </Thead>
              <Tbody>
                {currentItems.map((item, index) => (
                  <Tr key={item.date + +index}>
                    <Td borderBottom="1px solid white" color="white">
                      {item.addressOrENS}
                    </Td>
                    <Td borderBottom="1px solid white" color="white">
                      {item.votingPower}
                    </Td>
                    <Td borderBottom="1px solid white" color="white">
                      {getFormattedData(item.date)}
                    </Td>
                    <Td borderBottom="1px solid white">
                      {item.reason ? (
                        <CommentModal reason={item.reason} />
                      ) : null}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <ReactPaginate
            breakLabel="..."
            nextLabel={
              <Flex flexDir="row" w="max-content" gap="1" alignItems="center">
                Next <Icon as={AiOutlineArrowRight} w="5" h="5" />
              </Flex>
            }
            previousLabel={
              <Flex flexDir="row" w="max-content" gap="1" alignItems="center">
                <Icon as={AiOutlineArrowLeft} w="5" h="5" /> Previous
              </Flex>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            className="navigator-active"
            renderOnZeroPageCount={null}
          />
        </>
      ) : (
        <Flex
          flexDir="row"
          alignItems="center"
          justifyContent="center"
          w="full"
          px="4"
          py="4"
        >
          <Text color="white">No endorses found.</Text>
        </Flex>
      )}
    </Flex>
  );
};

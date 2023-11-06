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
import { useDAO } from 'contexts';
import { api, easQueryGeneralistic } from 'helpers';
import { FC, useEffect, useState } from 'react';
import { GeneralisticEndorsementData } from 'types';
import { AttestationResponse } from 'types/eas';
import {
  EndorseDelegateSchema,
  EASAttestation,
  easDelegateEndorseDictionary,
  formatDate,
  formatNumberPercentage,
  getEASChainInfo,
} from 'utils';
import { fetchENSNames } from 'utils/fetchENSName';
import ReactPaginate from 'react-paginate';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { GetDaoRes } from 'components/Modals/Endorse';

export const EndorsementsComponent: FC = () => {
  const [data, setData] = useState<GeneralisticEndorsementData[]>([]);

  const { daoInfo, theme } = useDAO();
  const endorsersCounter = data.length;

  const [isLoading, setIsLoading] = useState(false);

  const getRecentAttestations = async () => {
    setIsLoading(true);
    const projectEnvironment = process.env.NEXT_PUBLIC_ENV || 'dev';
    const chainsInfo = easDelegateEndorseDictionary[projectEnvironment];

    if (!chainsInfo) {
      return;
    }

    const results: EASAttestation<EndorseDelegateSchema>[] = [];

    const fetchAttestations = async (chain: string) => {
      try {
        const response = await axios.post<AttestationResponse>(
          chainsInfo[chain].easAPI,
          {
            query: easQueryGeneralistic(
              getEASChainInfo(daoInfo.config.DAO_KARMA_ID).schemaId
            ),
          }
        );

        const schema = response.data?.data?.schema;
        if (schema && schema.attestations) {
          let attestationsToPush: EASAttestation<EndorseDelegateSchema>[] = [];
          schema.attestations.forEach(attestation => {
            try {
              const easAttestation = new EASAttestation<EndorseDelegateSchema>(
                attestation
              );
              const duplicate = attestationsToPush.find(
                at =>
                  at.attester.toLowerCase() ===
                    easAttestation.attester.toLowerCase() &&
                  at.recipient.toLowerCase() ===
                    easAttestation.recipient.toLowerCase()
              );
              if (duplicate) {
                if (duplicate.timeCreated < easAttestation.timeCreated) {
                  const otherAttestations = attestationsToPush.filter(
                    at => duplicate.id !== at.id
                  );
                  attestationsToPush = [...otherAttestations, easAttestation];
                }
              } else {
                attestationsToPush.push(easAttestation);
              }
            } catch (error) {
              console.error('Error processing attestation:', error);
            }
          });

          results.push(...attestationsToPush);
        }
      } catch (error) {
        console.error('Error fetching attestation data:', error);
      }
    };

    const chainPromises = Object.keys(chainsInfo).map(chain =>
      fetchAttestations(chain)
    );
    await Promise.all(chainPromises);

    const {
      data: { data: fetchedData },
    } = await api.get<{ data: { daos: GetDaoRes[] } }>('/dao');

    const daoData = fetchedData.daos.find(
      item => item.name === daoInfo.config.DAO_KARMA_ID
    );

    const getInfo = async (addressToGetInfo: string) =>
      api
        .get(`/dao/find-delegate`, {
          params: {
            dao: daoInfo.config.DAO_KARMA_ID,
            user: addressToGetInfo,
          },
        })
        .catch(() => null);

    const filteredResults = await Promise.all(
      results.map(async item => {
        let votingPower = 0;
        let endorsedByENS: string | undefined | null = '';
        let delegateENS: string | undefined | null = '';

        const endorsedByInfo = await getInfo(item.attester);
        const delegateInfo = await getInfo(item.recipient);

        if (delegateInfo) {
          const { delegate: fetchedDelegate } = delegateInfo.data.data;
          votingPower = fetchedDelegate.voteWeight;
          if (fetchedDelegate.ensName) {
            delegateENS = fetchedDelegate.ensName;
          }
        } else {
          const fetched = await fetchENSNames([item.recipient]);
          delegateENS = fetched[0].name;
        }

        if (endorsedByInfo) {
          const { delegate: fetchedDelegate } = endorsedByInfo.data.data;
          votingPower = fetchedDelegate.voteWeight;
          if (fetchedDelegate.ensName) {
            endorsedByENS = fetchedDelegate.ensName;
          }
        } else {
          const fetched = await fetchENSNames([item.attester]);
          endorsedByENS = fetched[0].name;
        }

        const { comment } = item.decodedDataJson as any;

        return {
          delegate: delegateENS || item.recipient,
          endorsedBy: endorsedByENS || item.attester,
          date: item.timeCreated,
          votingPower: formatNumberPercentage(votingPower || 0),
          reason: comment,
          tokenAdddress: item.decodedDataJson.tokenAddress,
        };
      })
    );

    const filteredToDAO = filteredResults.filter(item => {
      const addresses = daoData?.tokenAddress?.map(address =>
        address.toLowerCase()
      );

      if (!item?.tokenAdddress) {
        return false;
      }

      if (typeof item.tokenAdddress === 'string') {
        const hasMatch = addresses?.includes(item.tokenAdddress.toLowerCase());
        return hasMatch;
      }
      const hasMatch = item?.tokenAdddress?.some(address =>
        addresses?.includes(address.toLowerCase())
      );

      return hasMatch;
    });

    const orderedDate = filteredToDAO.sort(
      (itemA, itemB) => itemB.date - itemA.date
    );
    setData(orderedDate);
    setIsLoading(false);
  };

  const getFormattedData = (date: number) =>
    formatDate(new Date(date * 1000).toUTCString(), 'MMM D, YYYY');

  useEffect(() => {
    if (daoInfo) {
      getRecentAttestations();
    }
  }, [daoInfo]);

  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 20;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = data.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(data.length / itemsPerPage);

  const handlePageClick = (event: { selected: number }) => {
    const newOffset = (event.selected * itemsPerPage) % data.length;
    setItemOffset(newOffset);
  };

  return (
    <Flex mb="20" py="5" flexDir="column" w="full" alignItems="center">
      <Flex flexDir="row" gap="1" alignItems="center">
        <Text fontSize="18px" fontWeight="700" color={theme.text}>
          Endorsers
        </Text>
        {endorsersCounter ? (
          <Text fontSize="14px" fontWeight="500" color={theme.text}>
            ({endorsersCounter})
          </Text>
        ) : null}
      </Flex>

      {isLoading ? (
        <Flex w="full" py="8" alignItems="center" justifyContent="center">
          <Spinner color={theme.text} />
        </Flex>
      ) : endorsersCounter ? (
        <Flex
          flexDir="column"
          borderWidth="1px"
          borderStyle="solid"
          borderColor={theme.text}
          borderRadius="12px"
          mt="4"
          pb="4"
        >
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th
                    borderBottomWidth="1px"
                    borderBottomStyle="solid"
                    borderBottomColor={theme.text}
                    fontSize="12px"
                    fontWeight="500"
                    color={theme.text}
                  >
                    Delegate
                  </Th>
                  <Th
                    borderBottomWidth="1px"
                    borderBottomStyle="solid"
                    borderBottomColor={theme.text}
                    fontSize="12px"
                    fontWeight="500"
                    color={theme.text}
                  >
                    Endorsed by
                  </Th>
                  <Th
                    borderBottomWidth="1px"
                    borderBottomStyle="solid"
                    borderBottomColor={theme.text}
                    fontSize="12px"
                    fontWeight="500"
                    color={theme.text}
                  >
                    Date
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {currentItems.map((item, index) => (
                  <Tr key={item.date + +index}>
                    <Td
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor={theme.text}
                      color={theme.text}
                    >
                      {item.delegate}
                    </Td>
                    <Td
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor={theme.text}
                      color={theme.text}
                    >
                      {item.endorsedBy}
                    </Td>
                    <Td
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor={theme.text}
                      color={theme.text}
                    >
                      {getFormattedData(item.date)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          <ReactPaginate
            breakLabel="..."
            nextLabel={
              <Flex
                flexDir="row"
                w="max-content"
                gap="1"
                alignItems="center"
                color="black"
                backgroundColor="white"
              >
                Next <Icon as={AiOutlineArrowRight} w="5" h="5" />
              </Flex>
            }
            previousLabel={
              <Flex
                flexDir="row"
                w="max-content"
                gap="1"
                alignItems="center"
                color="black"
                backgroundColor="white"
              >
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
        </Flex>
      ) : (
        <Flex
          flexDir="row"
          alignItems="flex-start"
          justifyContent="center"
          w="full"
          py="4"
        >
          <Text color={theme.text}>No endorses found.</Text>
        </Flex>
      )}
    </Flex>
  );
};

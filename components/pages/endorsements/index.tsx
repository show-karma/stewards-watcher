/* eslint-disable no-nested-ternary */
import {
  Button,
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
  truncateAddress,
} from 'utils';
import { fetchENSNames } from 'utils/fetchENSName';
import ReactPaginate from 'react-paginate';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { GetDaoRes } from 'components/Modals/Endorse';
import { ImgWithFallback } from 'components/ImgWithFallback';
import { blo } from 'blo';

export const EndorsementsComponent: FC = () => {
  const [data, setData] = useState<GeneralisticEndorsementData[]>([]);
  const { openProfile } = useDelegates();

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

    const filteredToDAO = results.filter(item => {
      const addresses = daoData?.tokenAddress?.map(address =>
        address.toLowerCase()
      );

      if (!item.decodedDataJson.tokenAddress) {
        return false;
      }

      if (typeof item.decodedDataJson.tokenAddress === 'string') {
        const hasMatch = addresses?.includes(
          item.decodedDataJson.tokenAddress.toLowerCase()
        );
        return hasMatch;
      }
      const hasMatch = item?.decodedDataJson.tokenAddress?.some(address =>
        addresses?.includes(address.toLowerCase())
      );

      return hasMatch;
    });

    const filteredResults = await Promise.all(
      filteredToDAO.map(async item => {
        let votingPower = 0;
        const endorsedBy: GeneralisticEndorsementData['endorsedBy'] = {
          address: item.attester,
        };
        const delegate: GeneralisticEndorsementData['delegate'] = {
          address: item.recipient,
        };

        const endorsedByInfo = await getInfo(item.attester);
        const delegateInfo = await getInfo(item.recipient);

        if (delegateInfo) {
          const { delegate: fetchedDelegate } = delegateInfo.data.data;
          votingPower = fetchedDelegate.voteWeight;
          if (fetchedDelegate.ensName || fetchedDelegate.realName) {
            delegate.ensName = fetchedDelegate.ensName;
            delegate.realName = fetchedDelegate.realName;
          }
          delegate.imageURL = fetchedDelegate.profilePicture;
        } else {
          const fetched = await fetchENSNames([item.recipient]);
          delegate.ensName = fetched[0].name || undefined;
        }

        if (endorsedByInfo) {
          const { delegate: fetchedDelegate } = endorsedByInfo.data.data;
          votingPower = fetchedDelegate.voteWeight;
          if (fetchedDelegate.realName || fetchedDelegate.ensName) {
            endorsedBy.ensName = fetchedDelegate.ensName;
            endorsedBy.realName = fetchedDelegate.realName;
          }
          endorsedBy.imageURL = fetchedDelegate.profilePicture;
        } else {
          const fetched = await fetchENSNames([item.attester]);
          endorsedBy.ensName = fetched[0].name || undefined;
        }

        const { comment } = item.decodedDataJson as any;

        return {
          delegate,
          endorsedBy,
          date: item.timeCreated,
          votingPower: formatNumberPercentage(votingPower || 0),
          reason: comment,
          tokenAdddress: item.decodedDataJson.tokenAddress,
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
            <Table variant="simple" px="4">
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
                    display={{ base: 'none', sm: 'table-cell' }}
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
                      <Button
                        flexDir="row"
                        gap="2"
                        onClick={() => {
                          openProfile(
                            item.delegate.address,
                            'endorsements-received',
                            false
                          );
                        }}
                        p="0"
                        bg="transparent"
                        _hover={{ bg: 'transparent' }}
                        _active={{ bg: 'transparent' }}
                        _focus={{ bg: 'transparent' }}
                        _focusVisible={{ bg: 'transparent' }}
                        _focusWithin={{ bg: 'transparent' }}
                      >
                        <ImgWithFallback
                          fallback={item.delegate.address}
                          src={
                            item.delegate.imageURL ||
                            blo(item.delegate.address as `0x${string}`)
                          }
                          boxSize="20px"
                          borderRadius="full"
                        />
                        <Text
                          textDecoration="underline"
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          color={theme.text}
                          fontSize={{ base: '12px', sm: '14px' }}
                          maxW={{ base: '120px', md: 'none' }}
                        >
                          {item.delegate.realName ||
                            item.delegate.ensName ||
                            truncateAddress(item.delegate.address)}
                        </Text>
                      </Button>
                    </Td>
                    <Td
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor={theme.text}
                      color={theme.text}
                    >
                      <Flex flexDir="row" gap="2" textOverflow="ellipsis">
                        <ImgWithFallback
                          fallback={item.endorsedBy.address}
                          src={
                            item.endorsedBy.imageURL ||
                            blo(item.endorsedBy.address as `0x${string}`)
                          }
                          boxSize="20px"
                          borderRadius="full"
                        />
                        <Text
                          textOverflow="ellipsis"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          color={theme.text}
                          fontSize={{ base: '12px', sm: '14px' }}
                          maxW={{ base: '120px', md: 'none' }}
                        >
                          {item.endorsedBy.realName ||
                            item.endorsedBy.ensName ||
                            truncateAddress(item.endorsedBy.address)}
                        </Text>
                      </Flex>
                    </Td>
                    <Td
                      borderBottomWidth="1px"
                      borderBottomStyle="solid"
                      borderBottomColor={theme.text}
                      color={theme.text}
                      fontSize={{ base: '12px', sm: '14px' }}
                      display={{ base: 'none', sm: 'table-cell' }}
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
                gap="2"
                alignItems="center"
                color={theme.text}
                backgroundColor="transparent"
                px="2"
                py="1"
                borderRadius="2px"
              >
                Next <Icon as={AiOutlineArrowRight} w="4" h="4" />
              </Flex>
            }
            previousLabel={
              <Flex
                flexDir="row"
                w="max-content"
                gap="2"
                alignItems="center"
                color={theme.text}
                backgroundColor="transparent"
                px="2"
                py="1"
                borderRadius="2px"
              >
                <Icon as={AiOutlineArrowLeft} w="4" h="4" /> Previous
              </Flex>
            }
            pageLinkClassName="navigator-active-link"
            pageLabelBuilder={pageNumber => `Page ${pageNumber}`}
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
          <Text color={theme.text}>No endorsements found.</Text>
        </Flex>
      )}
    </Flex>
  );
};

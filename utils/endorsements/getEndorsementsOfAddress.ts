import axios from 'axios';
import { api, easQueryWithAddress } from 'helpers';
import { GetDaoRes } from 'types/api';
import { AttestationResponse } from 'types/eas';
import { easDelegateEndorseDictionary, getEASChainInfo } from 'utils/eas';
import { EndorseDelegateSchema, EASAttestation } from 'utils/EASAttestation';
import { getAddress } from 'viem';

export const getEndorsementsOfAddress = async (
  endorsedAddress: string,
  karmaID: string
) => {
  const projectEnvironment = process.env.NEXT_PUBLIC_ENV || 'dev';
  const chainsInfo = easDelegateEndorseDictionary[projectEnvironment];

  if (!chainsInfo) {
    return [];
  }

  const results: EASAttestation<EndorseDelegateSchema>[] = [];

  const fetchAttestations = async (chain: string) => {
    try {
      const checkSumAddress = getAddress(endorsedAddress as string);
      const response = await axios.post<AttestationResponse>(
        chainsInfo[chain].easAPI,
        {
          query: easQueryWithAddress(
            getEASChainInfo(karmaID).schemaId,
            checkSumAddress
          ),
        }
      );

      const schema = response.data?.data?.schema;
      if (schema && schema.attestations) {
        let uniqueAttestations: EASAttestation<EndorseDelegateSchema>[] = [];
        const uniqueAttesters: string[] = [];
        schema.attestations.forEach(attestation => {
          const easAttestation = new EASAttestation<EndorseDelegateSchema>(
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
              const newAttestation = new EASAttestation<EndorseDelegateSchema>(
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

  const {
    data: { data: fetchedData },
  } = await api.get<{ data: { daos: GetDaoRes[] } }>('/dao');

  const daoData = fetchedData.daos.find(item => item.name === karmaID);

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

  const filteredResults = await Promise.all(filteredToDAO);

  return filteredResults;
};

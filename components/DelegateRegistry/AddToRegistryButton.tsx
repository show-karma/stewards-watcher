import {
  Box,
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalHeader,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useDAO, useWallet } from 'contexts';
import React, { useEffect, useMemo, useState } from 'react';
import { IDelegate } from 'types';
import {
  ICustomScore,
  IDelegateRegistryStats,
} from 'types/delegate-regsitry/IDelegateRegistryStats';
// eslint-disable-next-line import/no-extraneous-dependencies
import { writeContract } from '@wagmi/core';
import ABI from 'utils/delegate-registry/ABI-STATS.json';
import { Hex, createPublicClient, http } from 'viem';
import { goerli } from 'viem/chains';
import { startCase } from 'lodash';
import { useToasty } from 'hooks';

const buttonStyle = {
  border: '1px solid #ccc',
  borderRadius: '5px',
  color: '#333',
  cursor: 'pointer',
  display: 'inline-block',
  fontSize: '0.8em',
  fontWeight: 500,
  padding: '5px 10px',
  textDecoration: 'none',
  textTransform: 'uppercase',
};

const registryContractAddr = process.env
  .NEXT_PUBLIC_STATS_REGISTRY_CONTRACT as Hex;

interface Props {
  profile: IDelegate;
}

const registryContractCfg = (fn: string) => ({
  abi: ABI,
  address: registryContractAddr,
  key: 'stats-registry',
  chainId: 10,
  functionName: fn,
});

const web3 = createPublicClient({
  transport: http(
    'https://eth-sepolia.g.alchemy.com/v2/j_nkHYEl9FG8aBwK3PcqEbravPyCV3DE'
  ),
  chain: goerli,
});

export const AddToRegistryButton: React.FC<Props> = ({ profile }) => {
  const {
    daoInfo: {
      config: { DAO_TOKEN_CONTRACT, DAO_KARMA_ID },
    },
  } = useDAO();
  const { address: connectedAddress, chain } = useWallet();
  const { isOpen, onToggle } = useDisclosure();
  const { toast } = useToasty();

  const [isSenderWhitelisted, setIsSenderWhitelisted] = useState(false);
  const [isDelegateInRegistry, setIsDelegateInRegistry] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const registryStats = useMemo((): IDelegateRegistryStats | null => {
    const lifetime = profile?.rawStats?.find(
      stats => stats.period === 'lifetime'
    );
    if (!lifetime) return null;

    const customScore: IDelegateRegistryStats['customScore'] = [];
    [
      'gitcoinHealthScore',
      'deworkTasksCompleted',
      'deworkPoints',
      'proposalsOnAragon',
    ].forEach(key => {
      if (typeof lifetime[key] === 'number' && lifetime[key] >= 0) {
        customScore.push({
          name: key,
          value: BigInt(lifetime[key]),
        });
      }
    });

    return {
      // Averages multiplied by 10e6 to match the precision of the contract
      aragonVotesPct: BigInt((lifetime.aragonVotesPct || 0) * 10e6),
      avgPostLength: BigInt((lifetime.avgPostLength || 0) * 10e6),
      avgPostLikes: BigInt((lifetime.avgPostLikes || 0) * 10e6),
      avgTopicPostCount: BigInt((lifetime.avgTopicPostCount || 0) * 10e6),
      customScore,
      daoName: DAO_KARMA_ID,
      delegatedVotes: BigInt(profile?.delegatedVotes || 0),
      discordMessagesCount: BigInt(lifetime.discordMessagesCount || 0),
      discordMessagesPercentile: BigInt(
        lifetime.discordMessagesPercentile || 0
      ),
      forumActivityScore: BigInt(lifetime.forumActivityScore || 0),
      forumLikesReceived: BigInt(lifetime.forumLikesReceived || 0),
      forumLikesReceivedPercentile: BigInt(
        lifetime.forumLikesReceivedPercentile || 0
      ),
      forumPostCount: BigInt(lifetime.forumPostCount || 0),
      forumPostCountPercentile: BigInt(lifetime.forumPostCountPercentile || 0),
      forumPostsReadCount: BigInt(lifetime.forumPostsReadCount || 0),
      forumPostsReadCountPercentile: BigInt(
        lifetime.forumPostsReadCountPercentile || 0
      ),
      forumTopicCount: BigInt(lifetime.forumTopicCount || 0),
      forumTopicCountPercentile: BigInt(
        lifetime.forumTopicCountPercentile || 0
      ),
      karmaScore: BigInt(lifetime.karmaScore || 0),
      offChainVotesPct: BigInt(lifetime.offChainVotesPct || 0),
      onChainVotesPct: BigInt(lifetime.onChainVotesPct || 0),
      percentile: BigInt(lifetime.percentile || 0),
      proposalsDiscussed: BigInt(lifetime.proposalsDiscussed || 0),
      proposalsDiscussedPercentile: BigInt(
        lifetime.proposalsDiscussedPercentile || 0
      ),
      proposalsInitiated: BigInt(lifetime.proposalsInitiated || 0),
      proposalsInitiatedPercentile: BigInt(
        lifetime.proposalsInitiatedPercentile || 0
      ),
      proposalsOnAragon: BigInt(lifetime.proposalsOnAragon || 0),
      proposalsOnSnapshot: BigInt(lifetime.proposalsOnSnapshot || 0),
    };
  }, [profile]);

  const isEnabled = useMemo(
    () =>
      isDelegateInRegistry &&
      isSenderWhitelisted &&
      DAO_TOKEN_CONTRACT &&
      DAO_TOKEN_CONTRACT?.length > 0 &&
      DAO_TOKEN_CONTRACT[0]?.contractAddress?.length > 0 &&
      registryStats,
    [
      DAO_TOKEN_CONTRACT,
      registryStats,
      isDelegateInRegistry,
      isSenderWhitelisted,
    ]
  );

  const loadUserInfo = async () => {
    if (!(connectedAddress && profile?.address)) return;
    const [register, whitelisted] = await Promise.all([
      web3.readContract({
        ...registryContractCfg('isDelegateRegistered'),
        args: [
          profile.address,
          DAO_TOKEN_CONTRACT?.[0].contractAddress,
          DAO_TOKEN_CONTRACT?.[0].chain.id,
        ],
      }),
      web3.readContract({
        ...registryContractCfg('getWhitelist'),
        args: [connectedAddress],
      }),
    ]);
    console.log('register', register);
    setIsDelegateInRegistry(!!register);
    setIsSenderWhitelisted(!!whitelisted);
  };

  const sendToChain = async () => {
    if (!registryStats || isLoading) return;
    try {
      setIsLoading(true);
      const args = [
        registryStats,
        profile.address,
        DAO_TOKEN_CONTRACT?.[0].contractAddress,
        DAO_TOKEN_CONTRACT?.[0].chain.id,
      ];

      await writeContract({
        abi: ABI,
        address: registryContractAddr,
        functionName: 'setStats',
        args,
      });
      toast({
        title: 'Success',
        description: 'Stats were successfully sent to the registry',
        status: 'success',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Something went wrong while sending stats to the registry',
        status: 'error',
      });
    } finally {
      onToggle();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      loadUserInfo();
    } catch (error) {
      console.log(error);
    }
  }, [connectedAddress, chain]);

  return isEnabled ? (
    <div>
      <Button
        type="button"
        py={6}
        className="btn btn-primary"
        disabled={
          !(connectedAddress && profile?.address) ||
          !(isSenderWhitelisted && isDelegateInRegistry)
        }
        onClick={onToggle}
      >
        Add to Registry
      </Button>

      <Modal isOpen={isOpen} onClose={onToggle}>
        <ModalContent position="relative">
          <ModalHeader borderBottom="1px solid rgba(0,0,0,0.125)" pb={5} mb={5}>
            <h3>Confirm lifetime stats</h3>
            <button
              type="button"
              onClick={onToggle}
              style={{
                fontSize: '2em',
                position: 'absolute',
                top: 0,
                right: 10,
              }}
            >
              &times;
            </button>
          </ModalHeader>

          <table>
            <thead>
              <th style={{ textAlign: 'right' }}>Score</th>
              <th style={{ textAlign: 'left', paddingLeft: 10 }}>Stat name</th>
            </thead>
            <tbody>
              {registryStats &&
                Object.entries(registryStats).map(([key, value]) => (
                  <tr key={key}>
                    <td style={{ textAlign: 'right' }}>
                      <code
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.125)',
                          padding: '0 5px',
                          borderRadius: '2px',
                        }}
                      >
                        {Array.isArray(value) ? (
                          <>
                            {value.map(({ name, value: val }: ICustomScore) => (
                              <div key={name}>
                                {name}: {`${val}`}
                              </div>
                            ))}
                          </>
                        ) : (
                          `${
                            key.includes('avg') ? Number(value) / 10e6 : value
                          }${key.includes('Pct') ? '%' : ''}`
                        )}
                      </code>
                    </td>
                    <td style={{ textAlign: 'left', paddingLeft: 10 }}>
                      {startCase(key)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <Flex
            textAlign="right"
            pt={5}
            my={5}
            px={5}
            justifyContent="space-between"
            alignItems="center"
            borderTop="1px solid rgba(0,0,0,0.125)"
          >
            <Box>
              <Text textAlign="center">
                <small>This action will replace existing on chain stats</small>
              </Text>
            </Box>
            <Box>
              <Button
                type="button"
                onClick={sendToChain}
                isDisabled={!isEnabled || isLoading}
                style={{
                  ...(buttonStyle as any),
                  background: isEnabled ? 'green' : '#ccc',
                  border: 'none',
                  color: 'white',
                }}
              >
                <Flex alignItems="center" gap={3}>
                  {isLoading && <Spinner />} Send
                </Flex>
              </Button>
            </Box>
          </Flex>
        </ModalContent>
      </Modal>
    </div>
  ) : (
    <div style={{ display: 'hidden' }} />
  );
};

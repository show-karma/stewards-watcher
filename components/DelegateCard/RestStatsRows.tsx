import { Flex, Link } from '@chakra-ui/react';
import { FC } from 'react';
import { ICardStat, IDAOConfig, IDAOData, IDelegate } from 'types';
import { getUserForumUrl } from 'utils';
import { DelegateStat } from './DelegateStat';

interface IRestStatsRowsProps {
  restRowStats: ICardStat[];
  data?: IDelegate;
  daoData?: IDAOData;
  config: IDAOConfig;
}

export const RestStatsRows: FC<IRestStatsRowsProps> = ({
  data,
  daoData,
  config,
  restRowStats,
}) => (
  <Flex
    gap="2"
    w="full"
    bgColor="transparent"
    px="2"
    py="4"
    maxH="max-content"
    justify="flex-start"
    align="flex-start"
  >
    <Flex>
      {restRowStats.map((statItem, index) => (
        <Flex
          justify="flex-start"
          align="flex-start"
          key={+index}
          w="max-content"
        >
          {statItem.id === 'forumScore' &&
          data?.discourseHandle &&
          daoData?.socialLinks.forum &&
          config.DAO_FORUM_TYPE ? (
            <Link
              href={getUserForumUrl(
                data.discourseHandle,
                config.DAO_FORUM_TYPE,
                daoData.socialLinks.forum
              )}
              isExternal
              _hover={{}}
              h="max-content"
            >
              <DelegateStat stat={statItem} />
            </Link>
          ) : (
            <DelegateStat stat={statItem} />
          )}
        </Flex>
      ))}
    </Flex>
  </Flex>
);

import { DAOProvider } from 'contexts/dao';
import { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import { TokenHoldersContainer } from 'containers';
import { daosDictionary } from 'helpers';
import { supportedDAOs } from 'resources';

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  dao: string;
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const paths = [{ params: { site: 'gitcoin' } }];

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<IndexProps, PathProps> = async ({
  params,
}) => {
  if (!params) throw new Error('No path parameters found');

  const { site } = params;

  const hasDAO = daosDictionary[site];
  if (!hasDAO) {
    return {
      notFound: true,
    };
  }

  const daoHasEnabled = supportedDAOs[site].config.ENABLE_DELEGATE_TRACKER;

  if (!daoHasEnabled) {
    return {
      notFound: true,
    };
  }

  return {
    props: { dao: site },
  };
};

interface IIndex {
  dao: string;
}

const Index = ({ dao }: IIndex) => (
  <DAOProvider selectedDAO={dao}>
    <TokenHoldersContainer />
  </DAOProvider>
);

export default Index;

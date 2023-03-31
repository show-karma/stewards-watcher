import { DAOProvider } from 'contexts/dao';
import { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import { DAOContainer } from 'containers';

const supportedDAOs: Record<string, string> = {
  aave: 'aave',
  op: 'op',
  optimism: 'optimism',
  pooltogether: 'pooltogether',
  yamfinance: 'yamfinance',
  ssvnetwork: 'ssvnetwork',
  dydx: 'dydx',
  dimo: 'dimo',
  gitcoin: 'gitcoin',
  element: 'element',
  starknet: 'starknet',
  developerdao: 'developerdao',
  apecoin: 'apecoin',
  safe: 'safe',
};

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  dao: string;
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const paths = [{ params: { site: 'siteIndex' } }];

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

  const dao = supportedDAOs[site];

  if (!dao) {
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
    <DAOContainer />
  </DAOProvider>
);

export default Index;

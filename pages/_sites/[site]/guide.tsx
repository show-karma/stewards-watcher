import { DAOProvider } from 'contexts/dao';
import { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import { FAQContainer } from 'containers';
import { GuideContainer } from 'containers/guide';

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

interface FAQProps {
  dao: string;
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const paths = [{ params: { site: 'siteFAQ' } }];

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<FAQProps, PathProps> = async ({
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

interface IFAQ {
  dao: string;
}

const FAQ = ({ dao }: IFAQ) => (
  <DAOProvider selectedDAO={dao}>
    <GuideContainer />
  </DAOProvider>
);

export default FAQ;

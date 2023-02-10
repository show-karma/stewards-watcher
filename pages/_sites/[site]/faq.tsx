import { DAOProvider } from 'contexts/dao';
import { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import { FAQContainer } from 'containers';
import fs from 'fs';

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
};

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface FAQProps {
  dao: string;
  markdown: string;
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

  const markdownPath = `resources/${site}/faq.md`;
  const file = fs.readFileSync(markdownPath, 'utf-8');

  if (!file) {
    return {
      notFound: true,
    };
  }

  return {
    props: { dao: site, markdown: file },
  };
};

interface IFAQ {
  dao: string;
  markdown: string;
}

const FAQ = ({ dao, markdown }: IFAQ) => (
  <DAOProvider selectedDAO={dao}>
    <FAQContainer markdown={markdown} />
  </DAOProvider>
);

export default FAQ;

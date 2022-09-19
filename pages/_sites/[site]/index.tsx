import { DAOProvider } from 'contexts/dao';
import { GetStaticPaths, GetStaticProps } from 'next';
import { supportedDAOs } from 'resources';
import type { ParsedUrlQuery } from 'querystring';
import { DAOContainer } from 'containers';

interface PathProps extends ParsedUrlQuery {
  site: string;
}

interface IndexProps {
  dao: string;
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const paths = [{ params: { site: 'test' } }, { params: { site: 'test2' } }];

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

const Index = ({ dao }: { dao: string }) => (
  <DAOProvider selectedDAO={dao}>
    <DAOContainer />
  </DAOProvider>
);

export default Index;

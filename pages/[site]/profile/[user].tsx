import { DAOContainer } from 'containers';
import { DAOProvider } from 'contexts';
import { daosDictionary } from 'helpers';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

interface PathProps extends ParsedUrlQuery {
  site: string;
  user: string;
}

interface IndexProps {
  dao: string;
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const paths = [{ params: { site: 'siteUser', user: 'user' } }];

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<IndexProps, PathProps> = async ({
  params,
}) => {
  if (!params) throw new Error('No path parameters found');

  const { site, user } = params;

  const dao = daosDictionary[site];

  if (!dao) {
    return {
      notFound: true,
    };
  }

  return {
    props: { dao: site, user },
  };
};

interface IIndex {
  dao: string;
  user: string;
}

const User = ({ dao, user }: IIndex) => (
  <DAOProvider selectedDAO={dao} withPathname>
    <DAOContainer user={user} />
  </DAOProvider>
);

export default User;

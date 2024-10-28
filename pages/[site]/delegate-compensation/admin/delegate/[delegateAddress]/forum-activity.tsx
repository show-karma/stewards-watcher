import { DAOProvider } from 'contexts/dao';
import { GetStaticPaths, GetStaticProps } from 'next';
import type { ParsedUrlQuery } from 'querystring';
import { daosDictionary } from 'helpers';
import { DelegateCompensationAdminContainer } from 'containers/delegate-compensation-admin';
import { DelegateCompensationAdminForumActivity } from 'components/pages/delegate-compensation/Admin/ForumActivity';

interface PathProps extends ParsedUrlQuery {
  site: string;
  delegateAddress: string;
}

interface FAQProps {
  dao: string;
  delegateAddress: string | null;
}

export const getStaticPaths: GetStaticPaths<PathProps> = async () => {
  const paths = [{ params: { site: 'arbitrum', delegateAddress: '0x' } }];

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<FAQProps, PathProps> = async ({
  params,
}) => {
  if (!params) throw new Error('No path parameters found');

  const { site, delegateAddress } = params;

  const dao = daosDictionary[site];
  const daosWithCompensation = ['arbitrum'];
  if (!dao || !daosWithCompensation.includes(dao)) {
    return {
      notFound: true,
    };
  }

  return {
    props: { dao: site, delegateAddress: delegateAddress || null },
  };
};

interface IFAQ {
  dao: string;
  delegateAddress: string;
}

const DelegateCompesationForumActivityPage = ({
  dao,
  delegateAddress,
}: IFAQ) => (
  <DAOProvider selectedDAO={dao} shouldFetchInfo={false}>
    <DelegateCompensationAdminContainer>
      <DelegateCompensationAdminForumActivity
        delegateAddress={delegateAddress}
      />
    </DelegateCompensationAdminContainer>
  </DAOProvider>
);

export default DelegateCompesationForumActivityPage;

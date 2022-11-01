import { gql } from '@apollo/client';

export const VOTING_HISTORY = {
  offChainProposalsReq: gql`
    query Proposals($daoname: [String]!) {
      proposals(
        first: 1000
        skip: 0
        where: { space_in: $daoname, state: "closed" }
        orderBy: "created"
        orderDirection: desc
      ) {
        id
        title
        end
      }
    }
  `,
  offChainVotesReq: gql`
    query Votes($address: String!, $daoname: [String]!) {
      votes(first: 1000, where: { space_in: $daoname, voter: $address }) {
        choice
        voter
        proposal {
          id
          choices
          state
          title
          end
        }
      }
    }
  `,
  onChainProposalsReq: gql`
    query Proposals($daoname: [String!]!, $skipIds: [String!]!) {
      proposals(
        where: { organization_in: $daoname, id_not_in: $skipIds }
        orderBy: "timestamp"
        orderDirection: desc
      ) {
        id
        description
        timestamp
      }
    }
  `,

  onChainVotesReq: gql`
    query Votes($address: String!, $daoname: [String!]!) {
      votes(
        orderBy: timestamp
        orderDirection: desc
        where: { user: $address, organization_in: $daoname }
      ) {
        id
        proposal {
          id
          description
          timestamp
        }
        organization {
          id
        }
        solution
        timestamp
        support
      }
    }
  `,
};

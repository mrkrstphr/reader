import { gql, useQuery } from '@apollo/client';

const searchIssues = gql`
  query searchIssues($query: String!) {
    searchIssues(query: $query) {
      id
      title
      hasCover
      currentPage
      pageCount
    }
  }
`;

export function useSearchIssues(query) {
  const { data, ...etc } = useQuery(searchIssues, {
    variables: { query },
  });

  return { issues: data?.searchIssues, ...etc };
}

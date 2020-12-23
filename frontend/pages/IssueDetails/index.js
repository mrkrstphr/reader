import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { isNil } from 'lodash';

const fetchIssueDetails = gql`
  query fetchIssue($id: ID!) {
    issue(id: $id) {
      id
      name
      hasCover
      currentPage
      pageCount
    }
  }
`;

function useIssueDetails(id) {
  const { data, ...etc } = useQuery(fetchIssueDetails, {
    variables: { id },
  });

  return { issue: data?.issue, ...etc };
}

export default function IssueDetails() {
  const { id } = useParams();
  const { issue } = useIssueDetails(id);

  if (isNil(issue)) {
    return null;
  }

  return (
    <div>
      <h2>{issue.name}</h2>

      <div>
        <Link
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          to={`/issue/${issue.id}/read`}
        >
          Read
        </Link>
      </div>
    </div>
  );
}

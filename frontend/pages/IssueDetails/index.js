import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { isNil } from 'lodash';
import { BrowserTitle } from '../../components';

const fetchIssueDetails = gql`
  query fetchIssue($id: ID!) {
    issue(id: $id) {
      id
      title
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
      <BrowserTitle title={`${issue.title} - Details`} />

      <div>
        <div className="md:-mx-8 sm:-mx-6 -mt-6">
          {issue.hasCover ? (
            <img
              className="h-32 w-full object-cover lg:h-60 bg-gray-600"
              src={`/issue/${issue.id}/page/1`}
              alt=""
            />
          ) : (
            <div className="h-32 w-full object-cover lg:h-60 bg-gray-600" />
          )}
        </div>
        <div className="max-w-5xl mx-auto">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-start sm:space-x-5">
            <div className="flex flex-col space-y-4">
              {issue.hasCover ? (
                <div className="relative">
                  <img
                    className="w-24 ring-4 ring-white h-auto sm:w-32"
                    src={`/cover/${issue.id}`}
                    alt=""
                  />
                  {issue.currentPage > 1 && (
                    <>
                      <div className="absolute h-1 bg-gray-500 bg-opacity-50 bottom-0 w-full" />
                      <div
                        className="absolute h-1 bg-indigo-500 bottom-0"
                        style={{
                          width: `${(issue.currentPage / issue.pageCount) *
                            100}%`,
                        }}
                      />
                    </>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <div className="bg-gray-500 w-24 h-20 ring-4 ring-white sm:w-32 sm:h-48" />
                  {issue.currentPage > 1 && (
                    <>
                      <div className="absolute h-1 bg-gray-500 bg-opacity-50 bottom-0 w-full" />
                      <div
                        className="absolute h-1 bg-indigo-500 bottom-0"
                        style={{
                          width: `${(issue.currentPage / issue.pageCount) *
                            100}%`,
                        }}
                      />
                    </>
                  )}
                </div>
              )}

              <div className="text-center">
                <Link
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  to={`/issue/${issue.id}/read`}
                >
                  Read
                </Link>
              </div>
            </div>
            <div className="mt-16 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-top sm:space-x-6 sm:pb-1">
              <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                <h2 className="text-2xl font-bold text-gray-900 truncate">
                  {issue.title}
                </h2>
              </div>
              <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4"></div>
            </div>
          </div>
          <div className="hidden sm:block md:hidden mt-6 min-w-0 flex-1">
            <h2 className="text-2xl font-bold text-gray-900 truncate">
              {issue.title}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

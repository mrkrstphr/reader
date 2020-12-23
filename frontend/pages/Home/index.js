import { gql, useQuery } from '@apollo/client';
import React from 'react';
import { Link } from 'react-router-dom';

const fetchRecentlyAddedIssues = gql`
{
  recentlyAddedIssues {
    id
    name
    hasCover
  }
}
`;

function useRecentlyAddedIssues() {
  const {data, ...etc} = useQuery(fetchRecentlyAddedIssues);

  return {issues: data?.recentlyAddedIssues, ...etc};
}

function Issue({ progress, issue }) {
  return (
    <Link to={`/issue/${issue.id}/details`}>
    <div className="w-32 mr-2">
      <div className="h-48 w-32 bg-gray-300 hover:bg-gray-400 cursor-pointer rounded-sm shadow relative bg-contain bg-no-repeat" style={{backgroundImage: issue.hasCover ? `url(cover/${issue.id})` : 'none'}}>
      {progress && (
        <>
          <div className="absolute h-1 bg-gray-500 bg-opacity-50 bottom-0 w-full" />
          <div className="absolute h-1 bg-indigo-500 bottom-0" style={{width: `${progress}%`}} />
        </>
      )}
      </div>
      <div className="text-sm mt-2">
        {issue.name}
      </div>
    </div>
    </Link>
  )
}

export default function HomePage() {
  const {issues: recentlyAddedIssues} = useRecentlyAddedIssues();

  return (
    <div>

<h1 className="text-2xl font-semibold text-gray-900">Home</h1>

      <div className="mb-8">
        <div className="font-heavy mb-3">Continue Reading</div>
        <div className="flex flex-wrap">
          {/* <Issue title="Green Lantern (2005) #19" progress={70} />
          <Issue title="Green Lantern Corps (2006) #6" progress={40} />
          <Issue title="JLA (1999) #3" progress={40} />
          <Issue title="The Walking Dead (2003) #118" progress={5} /> */}
        </div>
      </div>

      <div className="mb-8">
        <div className="font-heavy mb-3">Up Next</div>
        <div className="flex flex-wrap">
          {/* <Issue title="Death Metal (2020) #3" />
          <Issue title="Thor (2020) #8" />
          <Issue title="Guardians of the Galaxy (2019) #11" /> */}
        </div>
      </div>

      <div className="mb-8">
        <div className="font-heavy mb-3">Recently Added</div>
        <div className="flex flex-wrap">
          {(recentlyAddedIssues || []).map(issue => (
            <Issue key={`recent-${issue.id}`} issue={issue} />
          ))}
        </div>
      </div>
    </div>
  )
}

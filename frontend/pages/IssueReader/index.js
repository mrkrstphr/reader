import { gql, useQuery } from '@apollo/client';
import { isNil } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { Icon } from '../../Icon';

const fetchIssueDetails = gql`
  query fetchIssue($id: ID!) {
    issue(id: $id) {
      id
      name
      hasCover
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

function useFetchPages(issue, page) {
  const [currentPage, setCurrentPage] = useState();

  useEffect(() => {
    if (issue && page <= issue.pageCount) {
      fetch(`/issue/${issue.id}/page/${page}`)
        .then(body => body.blob())
        .then(img => URL.createObjectURL(img))
        .then(setCurrentPage);
    }
  }, [issue, page]);

  return {
    currentPage,
  };
}

function useFetchThumbnail(issue, page) {
  const [thumbnail, setThumbnail] = useState();

  useEffect(() => {
    if (issue && page <= issue.pageCount) {
      fetch(`/issue/${issue.id}/page/${page}/thumbnail`)
        .then(body => body.blob())
        .then(img => URL.createObjectURL(img))
        .then(setThumbnail);
    }
  }, [issue, page]);

  return {
    thumbnail,
  };
}

function Thumbnail({ issue, onClick, page }) {
  const { thumbnail } = useFetchThumbnail(issue, page);
  return thumbnail ? (
    <img
      alt={`Thumbnail ${page}`}
      src={thumbnail}
      className="h-36 cursor-pointer"
      onClick={onClick}
    />
  ) : null;
}

export default function IssueReaderPage() {
  const { id } = useParams();
  const history = useHistory();
  const { issue } = useIssueDetails(id);
  const [page, setPage] = useState(1);
  const [isOverlayActive, setIsOverlayActive] = useState(true);
  const { currentPage } = useFetchPages(issue, page);
  const viewerRef = React.useRef(null);
  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.focus();
    }
  }, [viewerRef.current]);

  function onClick(e) {
    const { x: positionX, width } = e.target.getBoundingClientRect();
    const clickX = e.clientX - positionX;

    if (clickX > width * 0.67) {
      setPage(Math.min(page + 1, issue.pageCount));
    } else if (clickX < width * 0.34) {
      setPage(Math.max(1, page - 1));
    } else {
      setIsOverlayActive(active => !active);
    }
  }

  function onKeyPress(e) {
    switch (e.key.toLowerCase()) {
      case 'arrowleft':
        setPage(Math.max(1, page - 1));
        break;

      case 'arrowright':
        setPage(Math.min(page + 1, issue.pageCount));
        break;

      case 'escape':
        history.push(`/issue/${id}/details`);
        break;

      default:
        console.log(e.key);
        break;
    }
  }

  return (
    <div>
      <h1>ISSUE READER VIEW</h1>
      {/* <pre>{JSON.stringify(issue, null, 2)}</pre> */}

      <div>
        <button
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          type="button"
          onClick={() => {
            setPage(Math.min(page + 1, issue.pageCount));
          }}
          disabled={isNil(issue) || page === issue.pageCount}
        >
          Next
        </button>
      </div>

      {/* {currentPage && <img alt="" src={currentPage} />} */}

      {/* <div className="flex space-x-2">
      {[...Array(issue?.pageCount || 0)].map((page, index) => (<Thumbnail key={`thumbnail-${index}`} issue={issue} page={index + 1} onClick={() => setPage(index + 1)} />))}
    </div> */}

      <div
        class="fixed z-10 inset-0 overflow-y-auto"
        ref={viewerRef}
        onClick={onClick}
        onKeyUp={onKeyPress}
        tabIndex={0}
      >
        <div class="flex items-end justify-center min-h-screen text-center">
          <div class="fixed inset-0 transition-opacity" aria-hidden="true">
            <div class="absolute inset-0 bg-black"></div>
          </div>

          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <div className="overflow-hidden h-screen w-screen relative flex">
            {currentPage && (
              <img
                alt=""
                src={currentPage}
                className="max-h-screen max-w-screen m-auto select-none"
              />
            )}
            {isOverlayActive && (
              <div className="absolute top-0 left-0 mt-4 ml-4 w-full flex items-end">
                <Icon
                  icon="times"
                  className="text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={e => {
                    e.stopPropagation();
                    history.push(`/issue/${id}/details`);
                  }}
                />
              </div>
            )}
            {isOverlayActive && (
              <div className="bg-black bg-opacity-80 text-white p-2 absolute w-full bottom-0 z-40">
                <div>
                  <span>
                    {issue ? (
                      <>
                        Page {page} / {issue.pageCount}
                      </>
                    ) : (
                      '&nbsp;'
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { gql, useMutation, useQuery } from '@apollo/client';
import { isNil } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useSwipeable } from 'react-swipeable';
import { Icon } from '../../Icon';

const fetchIssueDetails = gql`
  query fetchIssue($id: ID!) {
    issue(id: $id) {
      id
      title
      hasCover
      pageCount
      currentPage
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
      fetch(`/assets/issue/${issue.id}/page/${page}`)
        .then(body => body.blob())
        .then(img => URL.createObjectURL(img))
        .then(setCurrentPage);

      if (page + 1 <= issue.pageCount) {
        // fetch the next page so it's cached for the next page load
        fetch(`/assets/issue/${issue.id}/page/${page + 1}`);
      }
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
      fetch(`/assets/issue/${issue.id}/page/${page}/thumbnail`)
        .then(body => body.blob())
        .then(img => URL.createObjectURL(img))
        .then(setThumbnail);
    }
  }, [issue, page]);

  return {
    thumbnail,
  };
}

const saveProgressMutation = gql`
  mutation saveReadingProgress($id: ID!, $page: Int!) {
    saveReadingProgress(id: $id, page: $page) {
      id
      currentPage
    }
  }
`;

function useSaveProgress(issueId) {
  const [saveProgress] = useMutation(saveProgressMutation);

  return pageNum => saveProgress({ variables: { id: issueId, page: pageNum } });
}

// function Thumbnail({ issue, onClick, page }) {
//   const { thumbnail } = useFetchThumbnail(issue, page);
//   return thumbnail ? (
//     <img
//       alt={`Thumbnail ${page}`}
//       src={thumbnail}
//       className="h-36 cursor-pointer"
//       onClick={onClick}
//     />
//   ) : null;
// }

function Reader({ issue }) {
  const saveProgress = useSaveProgress(issue.id);
  const [isOverlayActive, setIsOverlayActive] = useState(true);
  const [page, setPage] = useState(issue.currentPage);
  const { currentPage } = useFetchPages(issue, page);
  const viewerRef = useRef(null);
  const history = useHistory();
  const handlers = useSwipeable({
    onSwipedLeft: () => setPage(Math.min(page + 1, issue.pageCount)),
    onSwipedRight: () => setPage(Math.max(1, page - 1)),
    preventDefaultTouchmoveEvent: true,
  });
  const [isFullScreen, toggleIsFullScreen] = useFullScreen();

  useEffect(() => {
    if (viewerRef.current) {
      viewerRef.current.focus();
    }
  }, [viewerRef.current]);

  useEffect(() => {
    if (issue && issue.currentPage !== page) {
      saveProgress(page);
    }
  }, [page]);

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
        history.push(`/issue/${issue.id}/details`);
        break;
    }
  }

  if (!currentPage) {
    // TODO FIXME loading graphic?
    return null;
  }

  return (
    <div>
      <div>
        {/* {currentPage && <img alt="" src={currentPage} />} */}

        {/* <div className="flex space-x-2">
          {[...Array(issue?.pageCount || 0)].map((page, index) => (
            <Thumbnail
              key={`thumbnail-${index}`}
              issue={issue}
              page={index + 1}
              onClick={() => setPage(index + 1)}
            />
          ))}
        </div> */}

        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          ref={viewerRef}
          onClick={onClick}
          onKeyUp={onKeyPress}
          tabIndex={0}
        >
          <div className="flex items-end justify-center min-h-screen text-center">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-black"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div
              className="overflow-hidden h-screen w-screen relative flex"
              {...handlers}
            >
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
                    className="text-white text-2xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={e => {
                      e.stopPropagation();
                      history.push(`/issue/${issue.id}/details`);
                    }}
                  />
                </div>
              )}
              {isOverlayActive && (
                <div className="bg-black bg-opacity-80 text-white p-2 absolute w-full bottom-0 z-40">
                  <div className="flex space-x-2 items-center">
                    <div className="flex-1 text-center">
                      {issue ? (
                        <>
                          Page {page} / {issue.pageCount}
                        </>
                      ) : (
                        '&nbsp;'
                      )}
                    </div>
                    <div>
                      <Icon
                        icon={isFullScreen ? 'compress' : 'expand'}
                        onClick={e => {
                          e.stopPropagation();
                          toggleIsFullScreen();
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className="bg-indigo-500 h-2 mt-2 rounded-sm"
                    style={{
                      width: `${(issue.currentPage / issue.pageCount) * 100}%`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useFullScreen() {
  const [isFullScreen, setIsFullScreen] = React.useState(
    !isNil(document.fullscreenElement)
  );

  function onFullScreenChanged() {
    if (document.fullscreenElement) {
      setIsFullScreen(true);
    } else {
      setIsFullScreen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('fullscreenchange', onFullScreenChanged);

    return () =>
      document.removeEventListener('fullscreenchange', onFullScreenChanged);
  }, [onFullScreenChanged]);

  function toggleFullScreen() {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  return [isFullScreen, toggleFullScreen];
}

export default function IssueReaderPage() {
  const { id } = useParams();
  const { issue } = useIssueDetails(id);

  if (!issue) {
    // TODO FIXME loading graphic
    return null;
  }

  return <Reader issue={issue} />;
}

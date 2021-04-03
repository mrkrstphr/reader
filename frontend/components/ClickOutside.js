import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';

/**
 * Fires an event when anywhere outside the child elements are clicked.
 */
export function ClickOutside({ children, className = '', onClickOutside }) {
  const ref = useRef();
  useEffect(() => {
    function onClick(e) {
      if (!ref.current) {
        return;
      }

      if (!ref.current.contains(e.target)) {
        onClickOutside(e);
      }
    }

    document.addEventListener('touchend', onClick, true);
    document.addEventListener('click', onClick, true);

    return () => {
      document.removeEventListener('touchend', onClick, true);
      document.removeEventListener('click', onClick, true);
    };
  }, [onClickOutside, ref]);

  return (
    <div className={className} ref={ref}>
      {children}
    </div>
  );
}

ClickOutside.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  className: PropTypes.string,
  onClickOutside: PropTypes.func.isRequired,
};

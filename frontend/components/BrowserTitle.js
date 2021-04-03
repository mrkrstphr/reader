// import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';

export function BrowserTitle({ title }) {
  return (
    <Helmet>
      <title>{title ? `${title} - ` : ''}Comics</title>
    </Helmet>
  );
}

// BrowserTitle.propTypes = {
//   title: PropTypes.string.isRequired,
// };

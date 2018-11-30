import React from 'react';
import PropTypes from 'prop-types';
import './loading.scss';

const Loading = ({ loading }) => {
    const load = loading.length && loading.find((load) => !load.ignoreLoadScreen);
    return !load ? null : (
        <div className="loading">
            <div className="loading-background-cover" />
            <span className="pulse-loading" />
        </div>
    );
};

Loading.propTypes = {
    loading: PropTypes.arrayOf(PropTypes.shape({
        loading: PropTypes.string,
        ignoreLoadScreen: PropTypes.bool,
    })),
};

export default Loading;

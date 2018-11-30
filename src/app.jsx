import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Loading } from 'components';

import 'normalize.css/normalize.css';
import 'css/main.scss';

class App extends Component {
    /* eslint-disable complexity */
    render() {
        const { children = [], loading } = this.props;
        return (
            <div id="content-wrapper">
                <Loading loading={loading} />
                <div className="content">
                    {children}
                </div>
            </div>
        );
    }
    /* eslint-enable */
}

App.propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
    loading: PropTypes.arrayOf(PropTypes.shape({
        loading: PropTypes.string,
        ignoreLoadScreen: PropTypes.bool,
    })),
};

const mapStateToProps = (state) => ({
    loading: state.loading,
});

export default withRouter(connect(mapStateToProps)(App));

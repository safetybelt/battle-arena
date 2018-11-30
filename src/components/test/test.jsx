import React from 'react';
import PropTypes from 'prop-types';
import { Player, Map } from 'components';
import './test.scss';

/* eslint-disable no-magic-numbers */

class Test extends React.Component {
    render() {
        const { loading = [], testLoading } = this.props;
        return (
            <div id="test-page">
                <h1>Test Page</h1>
                <ul>
                    {!loading.length ? null : loading.map((l) => <li key={l.loading}>{l.loading}</li>)}
                </ul>
                <button onClick={testLoading}>TEST LOADING</button>
                <hr />
                <Map>
                    <Player tiles={['PLAYER_1']} position={[50, 50]} />
                </Map>
            </div>
        );
    }
}

/* eslint-enable */

Test.propTypes = {
    loading: PropTypes.arrayOf(PropTypes.shape({
        loading: PropTypes.string,
        ignoreLoadScreen: PropTypes.bool,
    })),
    testLoading: PropTypes.func,
};

export default Test;

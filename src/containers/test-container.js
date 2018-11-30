import { connect } from 'react-redux';
import { Test } from 'components';
import {
    handleLoad,
} from 'actions';

const mapStateToProps = (state) => ({
    loading: state.loading,
});

const mapDispatchToProps = (dispatch) => ({
    testLoading: () => {
        const promise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, 20000);       // eslint-disable-line no-magic-numbers
        });
        dispatch(handleLoad(promise, 'Test Loading!'));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(Test);

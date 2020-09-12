import { connect } from 'react-redux';
import AuthLoading from '../../components/auth/AuthLoading';
import { navigationRootAppAction, navigationGoAuthAction } from '../../actions/navigationAction';
import { fetchListSubjectStartAction } from '../../actions/practiceAction';

const mapStateToProps = state => {
    return {
    };
}

const mapDispatchToProps = dispatch => {
    return {
        gotoRootApp: (payload) => {
            dispatch(navigationRootAppAction(payload));
        },
        goBackAuth: () => {
            dispatch(navigationGoAuthAction(payload));
        },
        makeRequestListSubject: (payload) => {
            dispatch(fetchListSubjectStartAction(payload));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoading);

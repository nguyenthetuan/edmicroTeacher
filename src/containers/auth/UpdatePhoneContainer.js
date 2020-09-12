import { connect } from 'react-redux';
import UpdatePhoneScreen from '../../components/auth/UpdatePhoneScreen';
import { setProfileUserAction } from '../../actions/userAction';

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        makeRequestProfile: (payload) => dispatch(setProfileUserAction(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePhoneScreen);
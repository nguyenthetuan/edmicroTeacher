/**
 * @author [DevSon]
 * @email [bienson72@mail.com]
 * @create date 2018-04-17 03:36:22
 * @modify date 2018-04-17 03:36:22
 * @desc [description]
*/

import { connect } from 'react-redux';
import FlagClass from '../../components/libs/FlagClass';
import { navigationClassChangeAction } from '../../actions/navigationAction';

const mapStateToProps = state => {
  return {
    gradeId: state.user.gradeId
  };
}

const mapDispatchToProps = dispatch => {
  return {
    gotoChangeClass: () => {
      dispatch(navigationClassChangeAction());
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FlagClass);
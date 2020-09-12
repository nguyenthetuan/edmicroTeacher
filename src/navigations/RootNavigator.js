import { createAppContainer ,createSwitchNavigator} from 'react-navigation';
import AuthStack from './AuthStack';
import AuthLoadingContainer from '../containers/auth/AuthLoadingContainer';
import GradeScreen from '../components/auth/GradeScreen';
import TeacherStack from './TeacherStack'

export default createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: AuthLoadingContainer,
            Auth: AuthStack,
            Grades: GradeScreen,
            Teacher: TeacherStack
        },
        {
            initialRouteName: 'AuthLoading',
        }
    )
);

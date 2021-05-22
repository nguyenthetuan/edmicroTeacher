import { Alert } from 'react-native';
import { EXIT_APP_MSG, CHANGE_GRADE_ID_SUCCESS } from '../constants/message';

export const alertLogout = (cal) => {
  Alert.alert(
    '',
    'Bạn có chắc chắn muốn đăng xuất không ?',
    [
      { text: 'Có', onPress: () => { cal() } },
      { text: 'Không', onPress: () => console.log('Cancel Pressed') }
    ],
    { cancelable: false }
  );
};

export const alertConfirmAvatar = (cal) => {
  Alert.alert(
    '',
    'Bạn có chắc chắn muốn thay đổi ảnh đại diện ?',
    [
      { text: 'Có', onPress: () => { cal() } },
      { text: 'Không', onPress: () => console.log('Cancel Pressed') },
    ],
    { cancelable: false }
  );
};

export const alertChangeGrade = (navigation) => {
  Alert.alert(
    '',
    CHANGE_GRADE_ID_SUCCESS,
    [
      { text: 'OK', onPress: () => { navigation.goBack(); } }
    ],
    { cancelable: false }
  );
};


export const alertExitApp = (BackHandler) => {
  Alert.alert(
    '',
    EXIT_APP_MSG,
    [
      { text: 'Có', onPress: () => BackHandler.exitApp() },
      { text: 'Không', onPress: () => console.log('Cancel Pressed') },
    ],
    { cancelable: false }
  )
}

export const alertMessage = (title, message) => {
  Alert.alert(
    title,
    message,
    [
      { text: 'OK', onPress: () => console.log('Cancel Pressed') }
    ],
    { cancelable: false }
  )
}

export const alertDeletePaper = (title, message, onPress) => {
  Alert.alert(
    title,
    message,
    [
      { text: 'Có', onPress: () => onPress() },
      { text: 'Không', onPress: () => console.log('Cancel Pressed')},
    ],
    { cancelable: false }
  )
}
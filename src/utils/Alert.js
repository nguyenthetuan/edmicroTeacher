import { Alert } from 'react-native';
import { EXIT_APP_MSG, CHANGE_GRADE_ID_SUCCESS } from '../constants/message';

export const alertLogout = (cal) => {
  Alert.alert(
    '',
    'Bạn có chắc chắn muốn đăng xuất không ?',
    [
      { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      { text: 'Có', onPress: () => { cal() } }
    ],
    { cancelable: false }
  );
};

export const alertConfirmAvatar = (cal) => {
  Alert.alert(
    '',
    'Bạn có chắc chắn muốn thay đổi ảnh đại diện ?',
    [
      { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      { text: 'Có', onPress: () => { cal() } }
    ],
    { cancelable: false }
  );
};

export const alertChangeGrade = (navigation) => {
  Alert.alert(
    'Thông báo',
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
      { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      { text: 'Có', onPress: () => BackHandler.exitApp() },
    ],
    { cancelable: false }
  )
}

export const alertMessage = (title, message) => {
  Alert.alert(
    title,
    message,
    [
      { text: 'OK', onPress: () => console.log('Cancel Pressed'), style: 'cancel' }
    ],
    { cancelable: false }
  )
}

export const alertDeletePaper = (title, message,onPress) => {
  Alert.alert(
    title,
    message,
    [
      { text: 'Không', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      { text: 'Có', onPress: () => onPress(), style: 'cancel' }
    ],
    { cancelable: false }
  )
}
import ImagePicker from 'react-native-image-picker';
// More info on all the options is below in the README...just some common use cases shown here
const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};

const showSelectImage = (cb) => {
  ImagePicker.showImagePicker(options, (response) => {
    // console.log('Response = ', response);
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      const source = { uri: response.uri };
      const data = response.data;
      // You can also display the image using data:
      // let source = { uri: 'data:image/jpeg;base64,' + response.data };
      cb(source, data);
    }
  });
};

module.exports = {
  showSelectImage,
};


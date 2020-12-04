import React, { useState } from "react";
import { Button, View, Text } from "react-native";
import DateTimePickerModal from "@react-native-community/datetimepicker";


const Example = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
  };

  return (
    <View style={{ flex: 1 ,justifyContent:'center',alignItems:'center'}}>
      <Text>1231</Text>
      <Button title="Show Date Picker" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        value={new Date()}
      />
    </View>
  );
};

export default Example;
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Icon from "../assets/icons";
import { theme } from "../constants/theme";

const Input = ({
  placeholder,
  iconName,
  iconSize = 20,
  iconColor = theme.colors.textLight,
  handleChangeText,
  ...props
}) => {
  const [inputValue, setInputValue] = useState(""); // State to hold input value

  const onTextChange = (text) => {
    setInputValue(text); // Update local state
    if (handleChangeText) {
      handleChangeText(text); // Call the parent handler if provided
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Icon
        name={iconName}
        size={iconSize}
        color={iconColor}
        style={styles.icon}
      />
      <TextInput
        placeholder={placeholder}
        style={styles.input}
        value={inputValue} // Bind input value to state
        onChangeText={onTextChange} // Handle text change
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: 12,
    padding: 10,
    marginVertical: 0,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
});

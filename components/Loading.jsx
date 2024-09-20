import React from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { theme } from "../constants/theme";

const Loading = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: "#000",
  },
});

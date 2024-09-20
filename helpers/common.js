import { Dimensions } from "react-native";

const { width: widthDevice, height: heightDevice } = Dimensions.get("window");

export const hp = (percentage) => {
  return (percentage * heightDevice) / 100;
};

export const wp = (percentage) => {
  return (percentage * widthDevice) / 100;
};

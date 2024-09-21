import { Image, StatusBar, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Button from "../components/Button";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

const Welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <StatusBar styles={"dark"} />
      <View style={styles.container}>
        {/* welcome image*/}
        <Image
          resizeMethod="contain"
          source={require("../assets/images/welcome.png")}
          style={styles.imageContainer}
        />

        {/* title */}
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>LinkUp!</Text>
          <Text style={styles.desc}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit,amet
            consectetur adipisicing elit.{" "}
          </Text>
        </View>

        {/* footer */}
        <View style={styles.footer}>
          <Button
            title="Getting Started"
            onPress={() => router.push("signup")}
          />
          <View style={styles.toLoginContainer}>
            <Text style={styles.already}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("login")}>
              <Text style={{ color: theme.colors.primary, fontSize: wp(4.5), fontWeight: 'bold' }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingHorizontal: wp(4),
  },
  imageContainer: {
    height: hp(30),
    width: wp(100),
    alignSelf: "center",
  },
  title: {
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
    fontSize: hp(4),
  },
  desc: {
    textAlign: "center",
    fontSize: hp(1.7),
    color: theme.colors.text,
    paddingHorizontal: wp(5),
    lineHeight: 24,
  },
  footer: {
    width: "100%",
    gap: 20,
  },
  toLoginContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  already: {
    fontSize: wp(3.8)
  }
});

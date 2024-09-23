import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import Icon from "../../assets/icons";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import { useRouter } from "expo-router";

const home = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign Out", "Error Signing Out!");
    }
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>LinkUp</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("notification")}>
              <Icon name="heart" size={hp(3.2)} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push("create_post")}>
              <Icon name="plus" size={hp(3.2)} color={theme.colors.text} />
            </Pressable>
            <Pressable onPress={() => router.push("profile")}>
              <Image
                source={
                  user.image
                    ? { uri: user.image }
                    : require("../../assets/images/defaultUser.png")
                }
                style={{ width: 45, height: 45, borderRadius: 8 }}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4.5),
    gap: 45,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    fontSize: hp(3.8),
    fontWeight: "bold",
    color: theme.colors.text,
  },
  icons: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
  },
});

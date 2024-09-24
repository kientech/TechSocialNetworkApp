import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import Icon from "../../assets/icons";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import { useRouter } from "expo-router";

const Home = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign Out", "Error Signing Out!");
    } else {
      Alert.alert("Sign Out", "Successfully logged out!");
    }
  };

  const defaultImage = require("../../assets/images/defaultUser.png");
  const userImageUri = user?.image
    ? {
        uri: `https://jdnjdbiflwgamipkjewd.supabase.co/storage/v1/object/public/${user.image}`,
      }
    : defaultImage;
  console.log("🚀 ~ Home ~ userImageUri:", userImageUri);

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
                source={userImageUri}
                style={styles.userImage}
                resizeMethod="resize"
                resizeMode="cover" // Hoặc "contain"
                onLoadStart={() => console.log("Loading started")}
                onLoadEnd={() => console.log("Loading finished")}
                onError={() => console.log("Error loading image")}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4.5),
    gap: 45,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: hp(3.8),
    fontWeight: "bold",
    color: theme.colors.text,
  },
  icons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 8,
  },
});

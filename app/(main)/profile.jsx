import { Alert, Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../context/AuthContext";
import BackButton from "../../components/BackButton";
import { wp } from "../../helpers/common";
import Icon from "../../assets/icons";
import { theme } from "../../constants/theme";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Input from "../../components/Input";
import Button from "../../components/Button";

const Profile = () => {
  const { user, setUser, setAuth } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState(user?.address || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(user?.image || null);
  console.log("🚀 ~ Profile ~ avatar:", avatar);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "We need permission to access your camera roll."
      );
      return false;
    }
    return true;
  };

  const onLogout = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Sign Out", "Error Signing Out!");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Confirm", "Are you sure you want to log out?", [
      { text: "Cancel", onPress: () => console.log("Cancel"), style: "cancel" },
      { text: "Logout", onPress: onLogout, style: "destructive" },
    ]);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300, height: 300 } }], // Điều chỉnh kích thước
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Điều chỉnh nén
      );

      setAvatar(manipulatedImage.uri);
    }
  };

  const handleSaveProfile = async () => {
    if (!name || !email) {
      Alert.alert("Error", "Name and email are required.");
      return;
    }

    setLoading(true);
    let avatarUrl = avatar;

    if (avatar && avatar !== user?.image) {
      const formData = new FormData();
      formData.append("file", {
        uri: avatar,
        name: `avatar_${user.id}${Math.floor(
          10000 + Math.random() * 90000
        )}.jpg`,
        type: "image/jpeg",
      });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(
          `avatars/${user.id}${Math.floor(
            10000 + Math.random() * 90000
          )}_avatar.jpg`,
          formData,
          {
            contentType: "image/jpeg",
          }
        );

      if (uploadError) {
        Alert.alert("Error", "Failed to upload avatar.");
        console.log("Upload Error:", uploadError);
        setLoading(false);
        return;
      }

      const { publicURL } = supabase.storage
        .from("avatars")
        .getPublicUrl(
          `avatars/${user.id}${Math.floor(
            10000 + Math.random() * 90000
          )}_avatar.jpg`
        );

      avatarUrl = uploadData?.fullPath; // Sử dụng URL công khai cho avatar
    }

    // Cập nhật thông tin người dùng trong cơ sở dữ liệu
    const { error } = await supabase
      .from("users")
      .update({
        name,
        address,
        bio,
        email,
        image: avatarUrl,
      })
      .eq("id", user?.id);

    setLoading(false);

    if (error) {
      Alert.alert("Error", "Failed to update profile");
      console.log("Update Error:", error);
    } else {
      Alert.alert("Success", "Profile updated successfully");
      setUser({ ...user, name, address, bio, email, image: avatarUrl });
    }
  };

  const inputs = [
    { placeholder: "Name", value: name, icon: "user", setter: setName },
    {
      placeholder: "Address",
      value: address,
      icon: "location",
      setter: setAddress,
    },
    {
      placeholder: "Email",
      value: email,
      setter: setEmail,
      icon: "mail",
      keyboardType: "email-address",
    },
    { placeholder: "Bio", value: bio, icon: "home", setter: setBio },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton router={router} />
          <Text style={styles.title}>Profile</Text>
          <Pressable style={styles.logout} onPress={handleLogout}>
            <Icon name={"logout"} color={"white"} />
          </Pressable>
        </View>

        {/* Avatar */}
        <Pressable onPress={pickImage} style={styles.avatarContainer}>
          {avatar?.startsWith("avatars") ? (
            <Image
              source={{
                uri: `https://jdnjdbiflwgamipkjewd.supabase.co/storage/v1/object/public/${user?.image}`,
              }}
              style={styles.avatar}
            />
          ) : (
            <Image
              source={{
                uri: avatar,
              }}
              style={styles.avatar}
            />
          )}
          <Text style={styles.avatarText}>Change Avatar</Text>
        </Pressable>

        {/* Input Fields */}
        {inputs.map((input, index) => (
          <Input
            key={index}
            iconName={input.icon}
            placeholder={input.placeholder}
            value={input.value}
            onChangeText={input.setter}
            keyboardType={input.keyboardType}
          />
        ))}

        {/* Save Button */}
        <Button
          title={loading ? "Updating..." : "Update Profile"}
          onPress={handleSaveProfile}
          disabled={loading}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4.5),
    gap: 25,
  },
  title: {
    fontSize: wp(7.8),
    fontWeight: "bold",
    color: theme.colors.text,
  },
  logout: {
    padding: 5,
    backgroundColor: theme.colors.roseLight,
    borderRadius: 4,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: wp(5),
  },
  avatar: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
  },
  avatarText: {
    marginTop: 10,
    fontSize: wp(4),
    color: "blue",
  },
});

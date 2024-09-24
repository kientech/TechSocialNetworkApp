import { Alert, Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import Input from "../../components/Input";
import Button from "../../components/Button";
import ScreenWrapper from "../../components/ScreenWrapper";
import BackButton from "../../components/BackButton";
import Icon from "../../assets/icons";
import { useRouter } from "expo-router";
import { wp } from "../../helpers/common";
import { theme } from "../../constants/theme";

const CreatePost = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 600, height: 400 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );

      setImage(manipulatedImage.uri);
    }
  };

  const handleCreatePost = async () => {
    if (!content) {
      Alert.alert("Error", "Content is required.");
      return;
    }

    setLoading(true);
    let imageUrl = image;

    if (image) {
      const formData = new FormData();
      formData.append("file", {
        uri: image,
        name: `post_image_${user.id}${Math.floor(
          10000 + Math.random() * 90000
        )}.jpg`,
        type: "image/jpeg",
      });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("posts")
        .upload(
          `posts/${user.id}${Math.floor(
            10000 + Math.random() * 90000
          )}_post.jpg`,
          formData,
          { contentType: "image/jpeg" }
        );

      if (uploadError) {
        Alert.alert("Error", "Failed to upload image.");
        console.log("Upload Error:", uploadError);
        setLoading(false);
        return;
      }

      const { publicURL } = supabase.storage
        .from("posts")
        .getPublicUrl(uploadData?.path);

      imageUrl = uploadData?.fullPath;
    }

    const { error } = await supabase.from("posts").insert([
      {
        body: content,
        userId: user.id,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      },
    ]);

    setLoading(false);

    if (error) {
      Alert.alert("Error", "Failed to create post");
      console.log("Create Post Error:", error);
    } else {
      Alert.alert("Success", "Post created successfully");
      setTitle("");
      setContent("");
      setImage(null);
      router.push("/home");
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <BackButton router={router} />
          <Text style={styles.title}>Create Post</Text>
          <Text></Text>
        </View>

        <Pressable onPress={pickImage} style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.imageText}>Tap to select an image</Text>
          )}
        </Pressable>

        {/* Input Fields */}
        <Input
          iconName={"home"}
          placeholder="Content"
          value={content}
          onChangeText={setContent}
          multiline={true}
          style={styles.textArea}
        />

        {/* Create Post Button */}
        <Button
          title={loading ? "Creating..." : "Create Post"}
          onPress={handleCreatePost}
          disabled={loading}
        />
      </View>
    </ScreenWrapper>
  );
};

export default CreatePost;

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
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  imageContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imageText: {
    color: "gray",
  },
  textArea: {
    height: 100,
  },
});

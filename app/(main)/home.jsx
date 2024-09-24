import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import Icon from "../../assets/icons";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import { useRouter } from "expo-router";
import { timeAgo } from "../../helpers/timeAgo";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const defaultImage = require("../../assets/images/defaultUser.png");

  const userImageUri = user?.image
    ? {
        uri: `https://jdnjdbiflwgamipkjewd.supabase.co/storage/v1/object/public/${user.image}`,
      }
    : defaultImage;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from("posts").select("*");
        if (error) throw error;
        setPosts(data);
        await fetchUserDetails(data);
      } catch (error) {
        Alert.alert("Error fetching posts", error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserDetails = async (posts) => {
      const userIds = posts.map((post) => post.userId);
      if (userIds.length === 0) return;
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .in("id", userIds);
      if (error) {
        console.error("Error fetching users:", error.message);
        return;
      }

      const userMap = data.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

      setUsers(userMap);
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const { error } = await supabase
        .from("postLikes")
        .insert([{ postId: postId, userId: user.id }]);
      if (error) throw error;
      Alert.alert("Liked!");
    } catch (error) {
      Alert.alert("Error liking post", error.message);
    }
  };

  const handleComment = async (postId) => {
    if (!newComment.trim()) return; // Ensure comment is not empty
    try {
      const { error } = await supabase
        .from("comments")
        .insert([{ postId: postId, userId: user.id, text: newComment }]);
      if (error) throw error;
      setNewComment(""); // Clear input
      Alert.alert("Comment added!");
    } catch (error) {
      Alert.alert("Error adding comment", error.message);
    }
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </ScreenWrapper>
    );
  }

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
                resizeMode="cover"
              />
            </Pressable>
          </View>
        </View>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const postUser = users[item.userId] || {};
            return (
              <View style={styles.postContainer}>
                <View style={styles.infomationUser}>
                  <Image
                    source={{
                      uri: `https://jdnjdbiflwgamipkjewd.supabase.co/storage/v1/object/public/${postUser?.image}`,
                    }}
                    style={styles.avatar}
                  />
                  <View>
                    <Text style={styles.postUserName}>
                      {postUser.name || "Unknown User"}
                    </Text>
                    <Text style={styles.timeAgo}>
                      {timeAgo(item.createdAt)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.bodyText}>{item.body}</Text>
                {item.image && (
                  <Image
                    source={{
                      uri: `https://jdnjdbiflwgamipkjewd.supabase.co/storage/v1/object/public/${item.image}`,
                    }}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.reactContainer}>
                  <Pressable
                    style={styles.reactItem}
                    onPress={() => handleLike(item.id)}
                  >
                    <Icon name="heart" />
                    <Text style={{ fontSize: 16 }}>Like</Text>
                  </Pressable>
                  <Pressable style={styles.reactItem}>
                    <Icon name="comment" />
                    <Text style={{ fontSize: 16 }}>Comment</Text>
                  </Pressable>
                  <Pressable style={styles.reactItem}>
                    <Icon name="share" />
                    <Text style={{ fontSize: 16 }}>Share</Text>
                  </Pressable>
                </View>

                {/* Comment Input */}
                <View style={styles.commentSection}>
                  <TextInput
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Add a comment..."
                    style={styles.commentInput}
                  />
                  <Pressable
                    onPress={() => handleComment(item.id)}
                    style={styles.commentButton}
                  >
                    <Text style={styles.commentButtonText}>Send</Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
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
    marginBottom: -25,
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
    borderRadius: 12,
  },
  postContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: theme.colors.gray,
    borderWidth: 1,
    borderRadius: 16,
    marginBottom: 24,
    backgroundColor: "white",
  },
  postUserName: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 16,
    color: theme.colors.text,
  },
  postImage: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginTop: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 8,
  },
  infomationUser: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  timeAgo: {
    fontSize: 12,
    color: theme.colors.gray,
  },
  bodyText: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 20,
    color: theme.colors.text,
  },
  reactContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  reactItem: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  commentSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.gray,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  commentButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  commentButtonText: {
    color: "white",
  },
});

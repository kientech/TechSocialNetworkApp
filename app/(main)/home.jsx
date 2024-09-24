import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
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
  console.log("🚀 ~ Home ~ users:", users);
  const defaultImage = require("../../assets/images/defaultUser.png");

  const userImageUri = user?.image
    ? {
        uri: `https://jdnjdbiflwgamipkjewd.supabase.co/storage/v1/object/public/${user.image}`,
      }
    : defaultImage;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase.from("posts").select("*");
        if (error) throw error;
        setPosts(data);
        await fetchUserDetails(data);
      } catch (error) {
        Alert.alert("Error fetching posts", error.message);
      }
    };

    const fetchUserDetails = async (posts) => {
      const userIds = posts.map((post) => post.userId);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .in("id", userIds);
      if (error) {
        console.error("Error fetching users:", error.message);
        return;
      }

      const userMap = data.reduce((acc, user) => {
        acc[user.id] = user; // Chuyển đổi thành đối tượng với id làm key
        return acc;
      }, {});

      setUsers(userMap);
    };

    fetchPosts();
  }, []);

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
                onLoadStart={() => console.log("Loading started")}
                onLoadEnd={() => console.log("Loading finished")}
                onError={() => console.log("Error loading image")}
              />
            </Pressable>
          </View>
        </View>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
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
    padding: 16,
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
    height: 200,
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
    gap: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  timeAgo: {
    color: theme.colors.text,
  },
  bodyText: {
    fontSize: wp(3.8),
    fontWeight: theme.fonts.base,
  },
});

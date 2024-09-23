import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import BackButton from "../components/BackButton";
import { useRouter } from "expo-router";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Input from "../components/Input";
import Button from "../components/Button";
import { supabase } from "../lib/supabase";

const SignUp = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name) {
      Alert.alert("Error", "Name is required");
      return;
    }
    if (!email) {
      Alert.alert("Error", "Email is required");
      return;
    }
    if (!password) {
      Alert.alert("Error", "Password is required");
      return;
    }

    setLoading(true);

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          name,
        },
      },
    });

    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message || "An error occurred during signup.");
    } else {
      Alert.alert("Success", "Sign Up Successfully");
    }
  };

  const handleCreateAccount = () => {
    router.push("login");
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton router={router} />
        <View>
          <Text style={styles.welcomeText}>Let's,</Text>
          <Text style={styles.welcomeText}>Get Started!</Text>
        </View>
        <View style={styles.form}>
          <Text>Please signup to continue</Text>
          <View>
            <Input
              iconName="user"
              value={name}
              placeholder="Kien Duong Trung"
              onChangeText={setName}
            />
            <Input
              iconName="mail"
              value={email}
              placeholder="example@gmail.com"
              onChangeText={setEmail}
              autoCapitalize="none"
            />
            <Input
              iconName="lock"
              value={password}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={setPassword}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>
          {/* Display loading indicator when loading is true */}
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <Button title="Sign up" onPress={handleSignUp} loading={loading} />
          )}
          <View style={styles.signupContainer}>
            <Text style={styles.dontHave}>Alerady have an account? </Text>
            <TouchableOpacity onPress={handleCreateAccount}>
              <Text style={styles.signupText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(4.5),
    gap: 45,
  },
  welcomeText: {
    fontWeight: theme.fonts.extraBold,
    fontSize: hp(4),
    color: theme.colors.text,
  },
  form: {
    gap: 20,
  },
  errorText: {
    color: theme.colors.error,
    marginTop: 5,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  dontHave: {
    fontSize: wp(3.8),
  },
  signupText: {
    color: theme.colors.primary,
    fontWeight: "bold",
    fontSize: wp(3.8),
  },
});

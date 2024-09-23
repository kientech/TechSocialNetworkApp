import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
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

  const handleSignUp = async () => {
    if (!name) {
      setError("Name is required");
      return;
    }
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    Alert.alert("Sign Up Successful");
    router.push("login");
  };

  const handleRecoverPassword = () => {
    Alert.alert("Recover Password", "Password recovery process initiated.");
    // Redirect to password recovery page or process
  };

  const handleCreateAccount = () => {
    router.push("login"); // Example of routing to register page
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
          <Button title="Sign up" onPress={handleSignUp} />
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
  recoverText: {
    color: theme.colors.dark,
    fontSize: wp(3.8),
    textAlign: "right",
    fontWeight: theme.fonts.semibold,
    marginVertical: 10,
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

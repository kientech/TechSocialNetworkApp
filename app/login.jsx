import { StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import BackButton from "../components/BackButton";
import { useRouter } from "expo-router";
import { hp, wp } from "../helpers/common";
import { theme } from "../constants/theme";
import Input from "../components/Input";
import Button from "../components/Button";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  console.log("🚀 ~ Login ~ email:", email);
  const [password, setPassword] = useState("");
  console.log("🚀 ~ Login ~ password:", password);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!password) {
      setError("Password is required");
      return;
    }

    // Add any additional validation logic (e.g., email format, password strength)
    Alert.alert("Login successful", `Welcome back, ${email}!`);
    // Redirect or further login logic here
  };

  const handleRecoverPassword = () => {
    Alert.alert("Recover Password", "Password recovery process initiated.");
    // Redirect to password recovery page or process
  };

  const handleCreateAccount = () => {
    router.push("signup"); // Example of routing to register page
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton router={router} />
        <View>
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
        </View>
        <View style={styles.form}>
          <Text>Please login to continue</Text>
          <View>
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
          <TouchableOpacity onPress={handleRecoverPassword}>
            <Text style={styles.recoverText}>Forgot Password ?</Text>
          </TouchableOpacity>
          <Button title="Login" onPress={handleLogin} />
          <View style={styles.signupContainer}>
            <Text style={styles.dontHave}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleCreateAccount}>
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

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

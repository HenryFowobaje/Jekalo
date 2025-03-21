// app/auth/login.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

// Complete any pending web browser auth sessions (needed for expo-auth-session)
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Google sign-in configuration
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "472556737079-g2jts3st1fmrm4i73anqnlh4e8n90g11.apps.googleusercontent.com",
    iosClientId: "472556737079-d3vuv5cl87f3rd0d38706i90hf00a0bd.apps.googleusercontent.com",
    webClientId: "472556737079-4ed3n039qujud4q8d0q4ej91h7p4nbkr.apps.googleusercontent.com",
  });

  // Handle Google sign-in response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      console.log("Received Google ID token:", id_token);
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((result) => {
          console.log("Firebase Google sign-in successful:", result.user);
          router.replace("/(tabs)/goals");
        })
        .catch((error) => {
          console.error("Firebase Google sign-in error:", error);
          setErrorMessage("Google Sign-In failed. Check console for details.");
        });
    }
  }, [response]);

  const handleLogin = async () => {
    console.log("Attempting login with email:", email);
    if (!email || !password) {
      const msg = "Email and password are required";
      setErrorMessage(msg);
      console.log("Login error:", msg);
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful, redirecting to goals...");
      router.replace("/(tabs)/goals");
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    console.log('Redirect URI Expo is using:', request?.redirectUri);
    console.log("Initiating 2 Google Sign-In via Expo Auth Session");
    console.log('Redirect URI Expo is using:', request?.redirectUri);
    promptAsync();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Jekalo</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => {
          console.log("Email changed:", text);
          setEmail(text);
        }}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => {
          console.log("Password changed:", text);
          setPassword(text);
        }}
        secureTextEntry
        style={styles.input}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button mode="contained" onPress={handleLogin} loading={loading} style={styles.button}>
        Login
      </Button>
      <Button mode="outlined" onPress={handleGoogleSignIn} style={styles.googleButton}>
        Sign in with Google
      </Button>
      <TouchableOpacity onPress={() => {
        console.log("Navigating to RegisterScreen");
        router.push("/auth/register");
      }}>
        <Text style={styles.switchText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F8F8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    marginBottom: 12,
  },
  button: {
    width: "100%",
    marginTop: 10,
  },
  googleButton: {
    width: "100%",
    marginTop: 10,
    borderColor: "#6200EE",
  },
  switchText: {
    marginTop: 12,
    color: "#6200EE",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

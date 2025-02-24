import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { createUserWithEmailAndPassword, signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useRouter } from "expo-router";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

// Complete any pending web browser auth sessions (needed for expo-auth-session)
WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  console.log("Rendering RegisterScreen");

  // Google sign-up configuration (similar to login)
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "472556737079-g2jts3st1fmrm4i73anqnlh4e8n90g11.apps.googleusercontent.com",
    iosClientId: "472556737079-d3vuv5cl87f3rd0d38706i90hf00a0bd.apps.googleusercontent.com",
    webClientId: "472556737079-4ed3n039qujud4q8d0q4ej91h7p4nbkr.apps.googleusercontent.com",
  });

  // Handle Google sign-up response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      console.log("Received Google ID token for signup:", id_token);
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((result) => {
          console.log("Firebase Google sign-up successful:", result.user);
          router.replace("/(tabs)/goals");
        })
        .catch((error) => {
          console.error("Firebase Google sign-up error:", error);
          setErrorMessage("Google Sign-Up failed. Check console for details.");
        });
    }
  }, [response]);

  const handleSignup = async () => {
    console.log("Attempting signup with email:", email);
    if (!email || !password || !confirmPassword) {
      const msg = "All fields are required";
      setErrorMessage(msg);
      console.log("Signup error:", msg);
      return;
    }
    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setErrorMessage(msg);
      console.log("Signup error:", msg);
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Signup successful, redirecting to goals...");
      router.replace("/(tabs)/goals");
    } catch (error: any) {
      console.error("Signup error:", error);
      setErrorMessage(error.message);
    }
    setLoading(false);
  };

  const handleGoogleSignUp = () => {
    console.log("Initiating Google Sign-Up via Expo Auth Session");
    promptAsync();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an Account</Text>
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
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => {
          console.log("Confirm password changed:", text);
          setConfirmPassword(text);
        }}
        secureTextEntry
        style={styles.input}
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button mode="contained" onPress={handleSignup} loading={loading} style={styles.button}>
        Sign Up
      </Button>
      <Button mode="outlined" onPress={handleGoogleSignUp} style={styles.googleButton}>
        Sign Up with Google
      </Button>
      <TouchableOpacity onPress={() => {
        console.log("Navigating to LoginScreen");
        router.push("/auth/login");
      }}>
        <Text style={styles.switchText}>Already have an account? Log in</Text>
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

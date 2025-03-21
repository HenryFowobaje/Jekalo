// app/_layout.tsx
import React, { useEffect, useState } from "react";
import { ThemeProvider, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseConfig";
import { GoalProvider } from "../context/GoalContext";
import { useColorScheme } from "@/hooks/useColorScheme";

// Keep the splash screen visible until we decide to hide it
// SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  // We are no longer waiting for custom fonts to load
  const fontsLoaded = true; // <-- temporarily set to true

  // State to track if we've finished checking auth
  const [authChecked, setAuthChecked] = useState(true);

  useEffect(() => {
    console.log("[_layout] Starting auth listener...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("[_layout] Auth state changed. User:", user ? "Logged In" : "Not Logged In");
      if (user) {
        console.log("[_layout] Navigating to (tabs) since user is logged in.");
        router.replace("/(tabs)");
      } else {
        console.log("[_layout] Navigating to /auth since user is not logged in.");
        router.replace("/auth/login");
      }
      setAuthChecked(true);
    });
    return () => {
      console.log("[_layout] Cleaning up auth listener.");
      unsubscribe();
    };
  }, [router]);

  // Hide the splash screen once auth is checked (fonts are assumed to be loaded)
  useEffect(() => {
    async function hideSplash() {
      if (fontsLoaded && authChecked) {
        console.log("[_layout] Auth checked. Hiding SplashScreen.");
        await SplashScreen.hideAsync();
      }
    }
    hideSplash();
  }, [fontsLoaded, authChecked]);

  // If auth hasn't been checked, keep the splash screen visible
  if (!authChecked) {
    console.log("[_layout] Waiting for auth...");
    return null;
  }

  return (
    <GoalProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* Auth Flow */}
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          {/* Main Tabs */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          {/* Modals */}
          <Stack.Screen
            name="(modals)/createGoal"
            options={{ presentation: "modal", title: "Create Goal", headerShown: true }}
          />
          <Stack.Screen
            name="(modals)/goalDetails"
            options={{ presentation: "modal", title: "Goal Details", headerShown: true }}
          />
          {/* 404 Fallback (Optional) */}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GoalProvider>
  );
}

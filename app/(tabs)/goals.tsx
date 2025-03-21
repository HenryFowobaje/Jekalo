// app/(tabs)/goals.tsx
import React, { useMemo, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { FAB, Card, ProgressBar, Avatar, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGoalContext } from "../../context/GoalContext";
import { useRouter, useFocusEffect } from "expo-router";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { signOut } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { collection, getDocs, writeBatch, doc, query, orderBy } from "firebase/firestore";
import styles from "./goals.styles";

export default function GoalsScreen() {
  const { state } = useGoalContext();
  const router = useRouter();

  // Reload or log goals when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      console.log("Goals on focus:", state.goals);
    }, [state.goals])
  );

  // Sort goals by due date (if a goal is missing a deadline, place it at the end)
  const sortedGoals = useMemo(() => {
    return [...state.goals].sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const dateB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return dateA - dateB;
    });
  }, [state.goals]);

  // Function to permanently delete all goals from Firestore
  const clearAllGoals = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const goalsRef = collection(db, `users/${user.uid}/goals`);
      const q = query(goalsRef, orderBy("created", "desc"));
      const snapshot = await getDocs(q);
      const batch = writeBatch(db);

      snapshot.docs.forEach((docSnapshot) => {
        const goalDocRef = doc(db, `users/${user.uid}/goals`, docSnapshot.id);
        batch.delete(goalDocRef);
      });

      await batch.commit();
      Alert.alert("Success", "All goals have been cleared.");
    } catch (error) {
      console.error("Error clearing goals:", error);
      Alert.alert("Error", "Failed to clear goals.");
    }
  };

  // Confirm before clearing all goals
  const confirmClearAll = () => {
    Alert.alert(
      "Clear All Goals",
      "Are you sure you want to remove all goals?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => clearAllGoals(),
        },
      ]
    );
  };

  // Format date with fallback
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "No due date"
      : date.toLocaleString("en-US", { dateStyle: "medium" });
  };

  // Render a single goal card with animation
  const renderGoalItem = ({ item }: any) => {
    const progressPercent = Math.round(item.progress * 100);
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut} layout={Layout.springify()}>
        <Card style={styles.card}>
          <Card.Title
            title={item.title}
            left={(props) => <Avatar.Icon {...props} icon={item.icon} />}
            titleStyle={styles.cardTitle}
          />
          <Card.Content>
            <ProgressBar
              progress={item.progress}
              color="#6200EE"
              style={styles.progress}
            />
            <Text style={styles.progressText}>
              {progressPercent}% Complete • Due: {formatDate(item.deadline)}
            </Text>
          </Card.Content>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() =>
              router.push({
                pathname: "/(modals)/goalDetails",
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.detailButtonText}>View Details ➝</Text>
          </TouchableOpacity>
        </Card>
      </Animated.View>
    );
  };

  // Render empty state
  const renderEmptyList = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No goals yet.</Text>
      <Text style={styles.emptyText}>
        Tap the + button to add your first goal!
      </Text>
    </View>
  );

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out.");
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.header}>My Goals</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {state.goals.length > 0 && (
              <TouchableOpacity onPress={confirmClearAll}>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            )}
            <Button mode="text" onPress={handleSignOut}>
              Sign Out
            </Button>
          </View>
        </View>

        {/* Goals List */}
        {state.loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : state.goals.length === 0 ? (
          renderEmptyList()
        ) : (
          <FlatList
            data={sortedGoals}
            keyExtractor={(item) => item.id}
            renderItem={renderGoalItem}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Floating Action Button */}
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => router.push("/(modals)/createGoal")}
        />
      </View>
    </SafeAreaView>
  );
}

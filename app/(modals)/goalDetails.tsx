import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, TouchableOpacity } from "react-native";
import {
  Card,
  Avatar,
  Button,
  ProgressBar,
  IconButton,
  TextInput,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGoalContext } from "../../context/GoalContext";
import styles from "./goalDetails.styles";

interface MilestoneUpdate {
  id: string;
  text: string;
  timestamp: string;
}

interface Milestone {
  id: string;
  text: string;
  completed: boolean;
  updates?: MilestoneUpdate[];
}

export default function GoalDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  // Convert id to a string if it's an array.
  const goalId = Array.isArray(id) ? id[0] : id;
  const { dispatch } = useGoalContext();

  const [goal, setGoal] = useState<any>(null);

  // Inline title editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState("");

  // Track which milestone is being edited
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  // Temporarily store milestone edits
  const [milestoneEdits, setMilestoneEdits] = useState<{ [key: string]: string }>({});

  // Track which milestone’s activity is expanded
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

  useEffect(() => {
    loadGoal();
  }, []);

  // Load goal from AsyncStorage using goalId
  const loadGoal = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem("goals");
      const goals = storedGoals ? JSON.parse(storedGoals) : [];
      const foundGoal = goals.find((g: any) => g.id === goalId);
      setGoal(foundGoal);
      if (foundGoal) {
        setTempTitle(foundGoal.title);
      }
    } catch (error) {
      console.error("Error loading goal:", error);
    }
  };

  // Update the entire goal in AsyncStorage
  const updateGoalInStorage = async (updatedGoal: any) => {
    try {
      const storedGoals = await AsyncStorage.getItem("goals");
      const goals = storedGoals ? JSON.parse(storedGoals) : [];
      const updatedGoals = goals.map((g: any) =>
        g.id === goalId ? updatedGoal : g
      );
      await AsyncStorage.setItem("goals", JSON.stringify(updatedGoals));
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  // --- Inline Title Editing ---
  const toggleTitleEdit = () => {
    if (!isEditingTitle) {
      setTempTitle(goal.title);
      setIsEditingTitle(true);
    } else {
      updateGoalTitle(tempTitle);
      setIsEditingTitle(false);
    }
  };

  const updateGoalTitle = async (newTitle: string) => {
    const updatedGoal = { ...goal, title: newTitle.trim() };
    setGoal(updatedGoal);
    await updateGoalInStorage(updatedGoal);
    dispatch({ type: "UPDATE_GOAL", payload: updatedGoal });
  };

  // --- Milestones ---
  const toggleMilestone = async (milestoneId: string) => {
    const updatedMilestones = goal.milestones.map((m: Milestone) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    const updatedGoal = { ...goal, milestones: updatedMilestones };
    setGoal(updatedGoal);
    await updateGoalInStorage(updatedGoal);
    dispatch({ type: "UPDATE_GOAL", payload: updatedGoal });
  };

  const startEditingMilestone = (milestone: Milestone) => {
    setEditingMilestoneId(milestone.id);
    setMilestoneEdits((prev) => ({
      ...prev,
      [milestone.id]: milestone.text,
    }));
  };

  const confirmEditingMilestone = async (milestoneId: string) => {
    const newText = milestoneEdits[milestoneId]?.trim() || "";
    const updatedMilestones = goal.milestones.map((m: Milestone) =>
      m.id === milestoneId ? { ...m, text: newText } : m
    );
    const updatedGoal = { ...goal, milestones: updatedMilestones };
    setGoal(updatedGoal);
    await updateGoalInStorage(updatedGoal);
    dispatch({ type: "UPDATE_GOAL", payload: updatedGoal });
    setEditingMilestoneId(null);
  };

  const cancelEditingMilestone = (milestoneId: string) => {
    setEditingMilestoneId(null);
    setMilestoneEdits((prev) => ({
      ...prev,
      [milestoneId]: "",
    }));
  };

  const deleteMilestone = async (milestoneId: string) => {
    const updatedMilestones = goal.milestones.filter(
      (m: Milestone) => m.id !== milestoneId
    );
    const updatedGoal = { ...goal, milestones: updatedMilestones };
    setGoal(updatedGoal);
    await updateGoalInStorage(updatedGoal);
    dispatch({ type: "UPDATE_GOAL", payload: updatedGoal });
  };

  const addMilestone = async () => {
    const newMilestone: Milestone = {
      id: Date.now().toString(),
      text: "",
      completed: false,
      updates: [],
    };
    const updatedMilestones = [...goal.milestones, newMilestone];
    const updatedGoal = { ...goal, milestones: updatedMilestones };
    setGoal(updatedGoal);
    await updateGoalInStorage(updatedGoal);
    dispatch({ type: "UPDATE_GOAL", payload: updatedGoal });
  };

  // --- Activity Updates ---
  const toggleExpandMilestone = (milestoneId: string) => {
    setExpandedMilestone((prev) => (prev === milestoneId ? null : milestoneId));
  };

  const addMilestoneUpdate = async (milestoneId: string, text: string) => {
    if (!text.trim()) return;
    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    const updatedMilestones = goal.milestones.map((m: Milestone) => {
      if (m.id === milestoneId) {
        const newUpdate: MilestoneUpdate = {
          id: Date.now().toString(),
          text: text.trim(),
          timestamp,
        };
        const updates = m.updates ? [...m.updates, newUpdate] : [newUpdate];
        return { ...m, updates };
      }
      return m;
    });
    const updatedGoal = { ...goal, milestones: updatedMilestones };
    setGoal(updatedGoal);
    await updateGoalInStorage(updatedGoal);
    dispatch({ type: "UPDATE_GOAL", payload: updatedGoal });
  };

  const deleteMilestoneUpdate = async (milestoneId: string, updateId: string) => {
    const updatedMilestones = goal.milestones.map((m: Milestone) => {
      if (m.id === milestoneId) {
        const filteredUpdates = (m.updates || []).filter((u) => u.id !== updateId);
        return { ...m, updates: filteredUpdates };
      }
      return m;
    });
    const updatedGoal = { ...goal, milestones: updatedMilestones };
    setGoal(updatedGoal);
    await updateGoalInStorage(updatedGoal);
    dispatch({ type: "UPDATE_GOAL", payload: updatedGoal });
  };

  // --- Goal Completion / Deletion ---
  const completeGoal = async () => {
    Alert.alert("Complete Goal", "Mark this goal as complete?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          const updatedGoal = { ...goal, completed: true, progress: 1 };
          setGoal(updatedGoal);
          await updateGoalInStorage(updatedGoal);
          dispatch({ type: "UPDATE_GOAL", payload: updatedGoal });
          router.replace("/(tabs)/goals");
        },
      },
    ]);
  };

  const deleteGoal = async () => {
    Alert.alert(
      "Delete Goal",
      "Are you sure you want to delete this goal? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              dispatch({ type: "DELETE_GOAL", payload: goalId });
              const storedGoals = await AsyncStorage.getItem("goals");
              const goals = storedGoals ? JSON.parse(storedGoals) : [];
              const updatedGoals = goals.filter((g: any) => g.id !== goalId);
              await AsyncStorage.setItem("goals", JSON.stringify(updatedGoals));
              router.replace("/(tabs)/goals");
            } catch (error) {
              console.error("Error deleting goal:", error);
            }
          },
        },
      ]
    );
  };

  if (!goal) return <Text style={styles.loading}>Loading...</Text>;

  const milestoneProgress =
    goal.milestones && goal.milestones.length > 0
      ? goal.milestones.filter((m: Milestone) => m.completed).length /
        goal.milestones.length
      : 0;

  const formattedDate = new Date(goal.deadline).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <View style={styles.container}>
      {/* Goal Card */}
      <Card style={styles.goalCard}>
        <Card.Content>
          <View style={styles.titleRow}>
            <Avatar.Icon icon={goal.icon} size={48} style={styles.goalIcon} />
            {isEditingTitle ? (
              <TextInput
                value={tempTitle}
                onChangeText={setTempTitle}
                mode="outlined"
                style={styles.titleInput}
              />
            ) : (
              <Text style={styles.goalTitle}>{goal.title}</Text>
            )}
            <IconButton
              icon={isEditingTitle ? "check" : "pencil"}
              onPress={toggleTitleEdit}
            />
          </View>
          <View style={styles.dateRow}>
            <IconButton icon="calendar" size={20} style={styles.calendarIcon} />
            <Text style={styles.dueDateText}>Due: {formattedDate}</Text>
          </View>
          <Text style={styles.subHeader}>Overall Progress</Text>
          <ProgressBar
            progress={goal.progress || milestoneProgress}
            color="#4CAF50"
            style={styles.progress}
          />
        </Card.Content>
      </Card>

      {/* Milestones Section */}
      <View style={styles.milestonesContainer}>
        <Text style={styles.sectionTitle}>Milestones</Text>
        <FlatList
          data={goal.milestones}
          keyExtractor={(item: Milestone) => item.id}
          ListEmptyComponent={
            <Text style={styles.placeholderText}>No milestones yet.</Text>
          }
          renderItem={({ item }) => {
            const isEditing = editingMilestoneId === item.id;
            const displayText = isEditing
              ? milestoneEdits[item.id] ?? item.text
              : item.text;
            return (
              <Card style={styles.milestoneCard}>
                <View style={styles.milestoneRow}>
                  <IconButton
                    icon={
                      item.completed
                        ? "checkbox-marked-outline"
                        : "checkbox-blank-outline"
                    }
                    onPress={() => toggleMilestone(item.id)}
                  />
                  {isEditing ? (
                    <TextInput
                      style={styles.milestoneInput}
                      value={displayText}
                      onChangeText={(text) =>
                        setMilestoneEdits((prev) => ({
                          ...prev,
                          [item.id]: text,
                        }))
                      }
                      mode="outlined"
                    />
                  ) : (
                    <View style={styles.milestoneTextWrapper}>
                      <Text
                        style={[
                          styles.milestoneText,
                          item.completed && styles.completedText,
                        ]}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {displayText || "Untitled Milestone"}
                      </Text>
                    </View>
                  )}
                  {isEditing ? (
                    <>
                      <IconButton
                        icon="check"
                        onPress={() => confirmEditingMilestone(item.id)}
                      />
                      <IconButton
                        icon="close"
                        onPress={() => cancelEditingMilestone(item.id)}
                      />
                    </>
                  ) : (
                    <IconButton
                      icon="pencil"
                      onPress={() => startEditingMilestone(item)}
                    />
                  )}
                  <IconButton
                    icon={() => <Text style={styles.bookEmoji}>📖</Text>}
                    onPress={() => toggleExpandMilestone(item.id)}
                  />
                  <IconButton
                    icon="trash-can-outline"
                    onPress={() => deleteMilestone(item.id)}
                  />
                </View>
                {expandedMilestone === item.id && (
                  <View style={styles.activitySection}>
                    {(item.updates || []).length > 0 ? (
                      item.updates?.map((upd) => (
                        <View style={styles.updateRow} key={upd.id}>
                          <Text style={styles.updateText}>
                            {upd.text}{" "}
                            <Text style={styles.updateTimestamp}>
                              ({upd.timestamp})
                            </Text>
                          </Text>
                          <IconButton
                            icon="close"
                            size={18}
                            onPress={() => deleteMilestoneUpdate(item.id, upd.id)}
                          />
                        </View>
                      ))
                    ) : (
                      <Text style={styles.placeholderText}>
                        No activity updates yet.
                      </Text>
                    )}
                    <AddUpdateField
                      onAdd={(text) => addMilestoneUpdate(item.id, text)}
                    />
                  </View>
                )}
              </Card>
            );
          }}
        />
        <Button
          mode="contained"
          icon="plus"
          onPress={addMilestone}
          style={styles.addMilestoneButton}
        >
          Add Milestone
        </Button>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          onPress={completeGoal}
          style={styles.completeButton}
          labelStyle={styles.buttonLabel}
        >
          Complete Goal
        </Button>
        <Button
          mode="outlined"
          onPress={deleteGoal}
          style={styles.deleteButton}
          labelStyle={[styles.buttonLabel, { color: "#DC143C" }]}
        >
          Delete Goal
        </Button>
      </View>
    </View>
  );
}

/** Helper component for adding updates to a milestone. */
function AddUpdateField({ onAdd }: { onAdd: (text: string) => void }) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    onAdd(inputValue);
    setInputValue("");
  };

  return (
    <View style={styles.addUpdateContainer}>
      <TextInput
        mode="outlined"
        placeholder="Add an update..."
        value={inputValue}
        onChangeText={setInputValue}
        style={styles.addUpdateInput}
      />
      <Button mode="contained" onPress={handleAdd} style={styles.addUpdateButton}>
        Post
      </Button>
    </View>
  );
}

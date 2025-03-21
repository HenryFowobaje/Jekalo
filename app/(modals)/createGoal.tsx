// CreateGoalScreen.tsx
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import {
  Avatar,
  Button,
  TextInput,
  Card,
  IconButton,
} from "react-native-paper";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useGoalContext } from "../../context/GoalContext";
import { NotificationType, Goal, GoalType, Milestone } from "../../types/models";
import { auth } from "../../config/firebaseConfig";
import { GoalsService } from "../../services/firebase/GoalsService";
import styles from "./CreateGoal.styles";

export default function CreateGoalScreen() {
  const router = useRouter();
  const { dispatch } = useGoalContext();
  const [goalTitle, setGoalTitle] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  // Updated milestones state to use the Milestone type
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [touched, setTouched] = useState(false);

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  const addMilestone = () => {
    // Create a new milestone with a default 'completed' value and empty updates array
    const newMilestone: Milestone = { 
      id: Date.now().toString(), 
      text: "", 
      completed: false, 
      updates: [] 
    };
    setMilestones((prev) => [...prev, newMilestone]);
  };

  const updateMilestone = (id: string, text: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, text } : m))
    );
  };

  const deleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const renderMilestoneItem = ({ item }: { item: Milestone }) => (
    <Card style={styles.milestoneCard}>
      <View style={styles.milestoneRow}>
        <TextInput
          style={styles.milestoneInput}
          placeholder="Milestone description"
          value={item.text}
          onChangeText={(text) => updateMilestone(item.id, text)}
          mode="outlined"
        />
        <IconButton icon="trash-can-outline" onPress={() => deleteMilestone(item.id)} />
      </View>
    </Card>
  );

  const saveGoal = useCallback(async () => {
    setTouched(true);
    if (!goalTitle.trim() || !selectedIcon) return;

    // Get the authenticated user's UID:
    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.error("User is not logged in.");
      return;
    }

    // Build partial goal data that matches the createGoal signature.
    const goalData = {
      title: goalTitle,
      description: goalDescription.trim(),
      type: "habit" as GoalType, // default to 'habit'
      icon: selectedIcon,
      deadline: dueDate.toISOString(),
      frequency: undefined, // or provide a default frequency if needed
      reminders: {
        enabled: false,
        times: [],
        type: "push" as NotificationType,
      },
      milestones, // Now milestones is of type Milestone[]
    };

    try {
      // Create the goal in Firestore.
      const newGoal = await GoalsService.createGoal(userId, goalData);
      
      router.back();
    } catch (error) {
      console.error("Failed to create goal:", error);
    }
  }, [goalTitle, goalDescription, selectedIcon, dueDate, milestones, dispatch, router]);

  return (
    <View style={styles.container}>
      <Card style={styles.formCard}>
        <Card.Content>
          <Text style={styles.header}>Create a New Goal 🎯</Text>

          {/* Goal Title */}
          <TextInput
            label="Goal Title"
            placeholder="What do you want to achieve?"
            value={goalTitle}
            onChangeText={setGoalTitle}
            style={styles.input}
            mode="outlined"
            error={touched && !goalTitle.trim()}
          />
          {touched && !goalTitle.trim() && (
            <Text style={styles.errorText}>Title is required</Text>
          )}

          {/* Goal Description */}
          <TextInput
            label="Goal Description"
            placeholder="Why do you want to achieve this?"
            value={goalDescription}
            onChangeText={setGoalDescription}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={3}
          />

          {/* Icon Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select an Icon</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.iconScroll}
            >
              {[
                { name: "flash", label: "Quick" },
                { name: "bullseye", label: "Focus" },
                { name: "trophy", label: "Achieve" },
                { name: "school", label: "Learn" },
                { name: "book", label: "Read" },
              ].map((icon) => (
                <TouchableOpacity
                  key={icon.name}
                  onPress={() => setSelectedIcon(icon.name)}
                  style={[
                    styles.iconWrapper,
                    selectedIcon === icon.name && styles.iconSelected,
                  ]}
                >
                  <Avatar.Icon size={48} icon={icon.name} />
                  <Text style={styles.iconLabel}>{icon.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Due Date Picker */}
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={styles.datePicker}
          >
            <IconButton icon="calendar" size={24} iconColor="#6200EE" />
            <Text style={styles.dateText}>Due Date: {dueDate.toDateString()}</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={dueDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          {/* Milestones Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Milestones 🏆</Text>
            {milestones.length > 0 ? (
              <FlatList
                data={milestones}
                keyExtractor={(item) => item.id}
                renderItem={renderMilestoneItem}
              />
            ) : (
              <Text style={styles.placeholderText}>
                No milestones added yet.
              </Text>
            )}
            <Button
              mode="outlined"
              onPress={addMilestone}
              style={styles.addMilestoneButton}
            >
              + Add Milestone
            </Button>
          </View>

          {/* Save Goal */}
          <Button
            mode="contained"
            onPress={saveGoal}
            style={styles.saveButton}
            contentStyle={styles.saveButtonContent}
            disabled={!goalTitle.trim() || !selectedIcon}
          >
            Save Goal ✅
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

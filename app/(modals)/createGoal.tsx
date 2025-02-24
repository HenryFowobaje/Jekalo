import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Avatar, Button, TextInput, Card, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useGoalContext } from '../../context/GoalContext';

const icons = [
  { name: 'flash', label: 'Quick' },
  { name: 'bullseye', label: 'Focus' },
  { name: 'trophy', label: 'Achieve' },
  { name: 'school', label: 'Learn' },
  { name: 'book', label: 'Read' },
];

export default function CreateGoalScreen() {
  const router = useRouter();
  const { dispatch } = useGoalContext();
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [milestones, setMilestones] = useState<{ id: string; text: string }[]>([]);
  const [touched, setTouched] = useState(false);

  const onDateChange = (_: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { id: Date.now().toString(), text: '' }]);
  };

  const updateMilestone = (id: string, text: string) => {
    setMilestones(milestones.map(m => (m.id === id ? { ...m, text } : m)));
  };

  const deleteMilestone = (id: string) => {
    setMilestones(milestones.filter(m => m.id !== id));
  };

  const saveGoal = useCallback(() => {
    setTouched(true);
    if (!goalTitle.trim() || !selectedIcon) return;

    const newGoal = {
      id: Date.now().toString(),
      title: goalTitle,
      description: goalDescription.trim(),
      icon: selectedIcon,
      progress: 0,
      deadline: dueDate.toISOString(),
      milestones,
    };

    dispatch({ type: 'ADD_GOAL', payload: newGoal });
    router.back();
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconScroll}>
              {icons.map(icon => (
                <TouchableOpacity
                  key={icon.name}
                  onPress={() => setSelectedIcon(icon.name)}
                  style={[styles.iconWrapper, selectedIcon === icon.name && styles.iconSelected]}
                >
                  <Avatar.Icon size={48} icon={icon.name} />
                  <Text style={styles.iconLabel}>{icon.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Due Date Picker */}
          <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.datePicker}>
            <IconButton icon="calendar" size={24} color="#6200EE" />
            <Text style={styles.dateText}>Due Date: {dueDate.toDateString()}</Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker value={dueDate} mode="date" display="default" onChange={onDateChange} />
          )}

          {/* Milestones Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Milestones 🏆</Text>
            {milestones.length > 0 ? (
              <FlatList
                data={milestones}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <Card style={styles.milestoneCard}>
                    <View style={styles.milestoneRow}>
                      <TextInput
                        style={styles.milestoneInput}
                        placeholder="Milestone description"
                        value={item.text}
                        onChangeText={text => updateMilestone(item.id, text)}
                      />
                      <IconButton icon="trash-can-outline" onPress={() => deleteMilestone(item.id)} />
                    </View>
                  </Card>
                )}
              />
            ) : (
              <Text style={styles.placeholderText}>No milestones added yet.</Text>
            )}
            <Button mode="outlined" onPress={addMilestone} style={styles.addMilestoneButton}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F2F5',
  },
  formCard: {
    borderRadius: 16,
    elevation: 4,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6200EE',
  },
  input: {
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    fontSize: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: '600',
  },
  iconScroll: {
    paddingVertical: 4,
  },
  iconWrapper: {
    alignItems: 'center',
    marginRight: 16,
    padding: 8,
    borderRadius: 12,
  },
  iconSelected: {
    borderWidth: 2,
    borderColor: '#6200EE',
    backgroundColor: '#EDE7F6',
  },
  iconLabel: {
    marginTop: 4,
    fontSize: 12,
    color: '#333',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6200EE',
  },
  milestoneCard: {
    marginVertical: 5,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    elevation: 2,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  addMilestoneButton: {
    marginTop: 10,
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 10,
  },
  saveButtonContent: {
    paddingVertical: 8,
  },
});

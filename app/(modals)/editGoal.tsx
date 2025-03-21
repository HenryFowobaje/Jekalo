import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, SegmentedButtons, Switch, Text } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import { GoalsService } from '../../services/firebase/GoalsService';
import { Goal, GoalType, FrequencyType, NotificationType } from '../../types/models';
import { auth } from '../../config/firebaseConfig';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditGoalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GoalType>('habit');
  const [icon, setIcon] = useState('🎯');
  const [frequencyType, setFrequencyType] = useState<FrequencyType>('daily');
  const [reminderTime, setReminderTime] = useState(new Date());
  const [enableReminders, setEnableReminders] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGoal();
  }, [id]);

  const loadGoal = async () => {
    try {
      if (!auth.currentUser || !id) return;
      const goalData = await GoalsService.getGoal(auth.currentUser.uid, id);
      if (goalData) {
        setGoal(goalData);
        setTitle(goalData.title);
        setDescription(goalData.description || '');
        setType(goalData.type);
        setIcon(goalData.icon);
        setFrequencyType(goalData.frequency?.type || 'daily');
        setEnableReminders(goalData.reminders?.enabled || false);
        if (goalData.reminders?.times?.[0]) {
          const [hours, minutes] = goalData.reminders.times[0].split(':');
          const time = new Date();
          time.setHours(parseInt(hours), parseInt(minutes));
          setReminderTime(time);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load goal');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!auth.currentUser || !id) {
        Alert.alert('Error', 'You must be logged in to update goals');
        return;
      }

      if (!title.trim()) {
        Alert.alert('Error', 'Please enter a title for your goal');
        return;
      }

      setLoading(true);

      const updates = {
        title: title.trim(),
        description: description.trim(),
        type,
        icon,
        frequency: {
          type: frequencyType,
          time: reminderTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
        },
        reminders: {
          enabled: enableReminders,
          times: [
            reminderTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
          ],
          type: 'push' as NotificationType  // Explicitly cast to NotificationType
        }
      };

      await GoalsService.updateGoal(auth.currentUser.uid, id, updates);
      router.back();
      Alert.alert('Success', 'Goal updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update goal. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Goal Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        label="Description (Optional)"
        value={description}
        onChangeText={setDescription}
        multiline
        style={styles.input}
      />

      <Text style={styles.label}>Goal Type</Text>
      <SegmentedButtons
        value={type}
        onValueChange={value => setType(value as GoalType)}
        buttons={[
          { value: 'habit', label: 'Habit' },
          { value: 'one-time', label: 'One-time' }
        ]}
        style={styles.segment}
      />

      <Text style={styles.label}>Frequency</Text>
      <SegmentedButtons
        value={frequencyType}
        onValueChange={value => setFrequencyType(value as FrequencyType)}
        buttons={[
          { value: 'daily', label: 'Daily' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'monthly', label: 'Monthly' }
        ]}
        style={styles.segment}
      />

      <View style={styles.reminderContainer}>
        <Text style={styles.label}>Enable Reminders</Text>
        <Switch value={enableReminders} onValueChange={setEnableReminders} />
      </View>

      {enableReminders && (
        <View style={styles.timeContainer}>
          <Text style={styles.label}>Reminder Time</Text>
          <DateTimePicker
            value={reminderTime}
            mode="time"
            is24Hour={true}
            onChange={(event, selectedTime) => {
              if (selectedTime) setReminderTime(selectedTime);
            }}
          />
        </View>
      )}

      <Button
        mode="contained"
        onPress={handleUpdate}
        loading={loading}
        style={styles.button}
      >
        Update Goal
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#666',
  },
  segment: {
    marginBottom: 16,
  },
  reminderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeContainer: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    marginBottom: 32,
  },
});

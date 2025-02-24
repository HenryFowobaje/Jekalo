import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FAFAFA",
  },
  loading: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  goalCard: {
    marginBottom: 20,
    borderRadius: 12,
    elevation: 4,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  goalIcon: {
    marginRight: 10,
  },
  goalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
  },
  titleInput: {
    flex: 1,
    marginRight: 8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  calendarIcon: {
    marginRight: 8, // Ensures spacing from "Due:"
  },
  dueDateText: {
    fontSize: 14,
    color: "#555",
  },
  subHeader: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 8,
    color: "#666",
  },
  progress: {
    height: 10,
    borderRadius: 5,
  },
  milestonesContainer: {
    flex: 1,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  placeholderText: {
    fontSize: 14,
    color: "#888",
    marginVertical: 10,
    textAlign: "center",
  },
  milestoneCard: {
    marginBottom: 10,
    borderRadius: 12,
    elevation: 2,
    padding: 8,
  },
  milestoneRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  milestoneInput: {
    flex: 1,
    marginRight: 8,
  },
  milestoneTextWrapper: {
    flex: 1,
    marginLeft: 6,
  },
  milestoneText: {
    fontSize: 16,
    color: "#333",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  activitySection: {
    marginTop: 8,
  },
  updateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 6,
    marginBottom: 6,
  },
  updateText: {
    fontSize: 14,
    color: "#333",
  },
  updateTimestamp: {
    fontSize: 12,
    color: "#777",
  },
  addUpdateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  addUpdateInput: {
    flex: 1,
    marginRight: 8,
  },
  addUpdateButton: {
    borderRadius: 6,
  },
  addMilestoneButton: {
    marginVertical: 10,
    backgroundColor: "#6200EE",
    borderRadius: 12,
  },
  /** Book Emoji Icon */
  bookEmoji: {
    fontSize: 18, 
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  completeButton: {
    flex: 0.48,
    backgroundColor: "#4CAF50", // Green for "Complete Goal"
    borderRadius: 12,
  },
  deleteButton: {
    flex: 0.48,
    borderColor: "#DC143C",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  buttonLabel: {
    fontSize: 14,
  },
});

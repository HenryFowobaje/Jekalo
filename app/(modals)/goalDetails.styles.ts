// goalDetails.styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F0F2F5",
  },
  loading: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  goalCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 4,
    backgroundColor: "#fff",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  goalIcon: {
    marginRight: 12,
  },
  titleInput: {
    flex: 1,
    marginRight: 8,
  },
  goalTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  calendarIcon: {
    marginRight: 4,
  },
  dueDateText: {
    fontSize: 14,
    color: "#555",
  },
  subHeader: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 12,
  },
  progress: {
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
  },
  milestonesContainer: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginVertical: 8,
  },
  milestoneCard: {
    marginVertical: 5,
    backgroundColor: "#FAFAFA",
    borderRadius: 10,
    elevation: 2,
  },
  milestoneRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  milestoneTextWrapper: {
    flex: 1,
  },
  milestoneText: {
    fontSize: 16,
    color: "#333",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  bookEmoji: {
    fontSize: 18,
  },
  activitySection: {
    backgroundColor: "#EFEFEF",
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  updateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  updateText: {
    fontSize: 14,
    color: "#555",
    flex: 1,
  },
  updateTimestamp: {
    fontSize: 12,
    color: "#999",
  },
  addUpdateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  addUpdateInput: {
    flex: 1,
    marginRight: 8,
  },
  addUpdateButton: {
    paddingVertical: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
  completeButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
  },
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 8,
    borderColor: "#DC143C",
  },
  buttonLabel: {
    fontSize: 16,
  },
  // Additional keys missing in previous version:
  addMilestoneButton: {
    marginTop: 10,
  },
  milestoneInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
});

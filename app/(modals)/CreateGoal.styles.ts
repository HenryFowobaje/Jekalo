// CreateGoal.styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F0F2F5",
  },
  formCard: {
    borderRadius: 16,
    elevation: 4,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#6200EE",
  },
  input: {
    marginBottom: 12,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
    fontSize: 12,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: "600",
  },
  iconScroll: {
    paddingVertical: 4,
  },
  iconWrapper: {
    alignItems: "center",
    marginRight: 16,
    padding: 8,
    borderRadius: 12,
  },
  iconSelected: {
    borderWidth: 2,
    borderColor: "#6200EE",
    backgroundColor: "#EDE7F6",
  },
  iconLabel: {
    marginTop: 4,
    fontSize: 12,
    color: "#333",
  },
  datePicker: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6200EE",
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
  },
  milestoneInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: "#888",
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

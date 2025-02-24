import { StyleSheet } from "react-native";

export default StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
  },
  clearAllText: {
    fontSize: 16,
    color: "#DC143C",
    fontWeight: "600",
  },
  listContent: {
    paddingBottom: 80, // Extra space so FAB doesn't cover the last item
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    // Removed overflow: "hidden" to ensure the shadow displays correctly.
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  progress: {
    marginTop: 8,
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  detailButton: {
    padding: 12,
    alignItems: "flex-end",
  },
  detailButtonText: {
    color: "#6200EE",
    fontWeight: "bold",
  },
  emptyState: {
    marginTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    marginVertical: 2,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#6200EE",
  },
});

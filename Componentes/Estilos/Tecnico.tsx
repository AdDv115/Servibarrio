import { StyleSheet } from "react-native";

const EstilosTecnico = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#18181c",
    borderRadius: 12,
    borderLeftWidth: 6,
    borderLeftColor: "#4cc9f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 3,
    gap: 10,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 100,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: "#4cc9f0",
  },
  buttonDisabled: {
    backgroundColor: "#BDC3C7",
  },
  actionText: {
    color: "#0d0d0e",
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
});

export default EstilosTecnico;

import { StyleSheet } from "react-native";

const EstilosTecnico = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderLeftWidth: 6,
    borderLeftColor: "#1ABC9C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
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
    backgroundColor: "#1ABC9C",
  },
  buttonDisabled: {
    backgroundColor: "#BDC3C7",
  },
  actionText: {
    color: "#FFFFFF",
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

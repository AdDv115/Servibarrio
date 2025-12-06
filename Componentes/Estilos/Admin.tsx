import { StyleSheet } from "react-native";

const EstilosAdmin = StyleSheet.create({
  header: {
    marginBottom: 16,
  },
  listContainer: {
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  row: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495E",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D0D7DE",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#2C3E50",
    backgroundColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "#1ABC9C",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  roleText: {
    fontSize: 12,
    color: "#7F8C8D",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2C3E50",
  },
  smallGap: {
    height: 6,
  },
  errorText: {
    color: "#E74C3C",
    marginBottom: 8,
  },
});

export default EstilosAdmin;

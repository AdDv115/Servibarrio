import { StyleSheet } from "react-native";

const EstilosAdmin = StyleSheet.create({
  layout: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },
  sidebar: {
    width: 130,
    backgroundColor: "#1f1f25",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    gap: 8,
  },
  content: {
    flex: 1,
    backgroundColor: "#18181c",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#2a2a32",
  },
  header: {
    marginBottom: 16,
  },
  listContainer: {
    paddingTop: 10,
  },
  card: {
    backgroundColor: "#000",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a32",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  row: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#d1d1d1",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#2b2b31",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: "#e8e8e8",
    backgroundColor: "#1b1b20",
  },
  button: {
    backgroundColor: "#4cc9f0",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 6,
  },
  buttonText: {
    color: "#0d0d0e",
    fontWeight: "bold",
  },
  roleText: {
    fontSize: 12,
    color: "#9c9c9c",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4cc9f0",
  },
  smallGap: {
    height: 6,
  },
  errorText: {
    color: "#E74C3C",
    marginBottom: 8,
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#27272d",
  },
  navButtonActive: {
    backgroundColor: "#4cc9f0",
  },
  navButtonText: {
    color: "#d1d1d1",
    fontWeight: "600",
  },
  navButtonTextActive: {
    color: "#0d0d0e",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4cc9f0",
    marginBottom: 6,
  },
  placeholderText: {
    color: "#d1d1d1",
    textAlign: "center",
  },
});

export default EstilosAdmin;

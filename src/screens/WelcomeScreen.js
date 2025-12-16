import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>HK</Text>
      <Text style={styles.title}>HealthKey</Text>
      <Text style={styles.subtitle}>India&apos;s NFC Health Record System</Text>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.primaryText}>Log in</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.secondaryText}>Sign up</Text>
      </TouchableOpacity>

      <Text style={styles.smallNote}>
        Demo environment only. No real medical data is stored.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logo: {
    backgroundColor: "#0ea5e9",
    color: "white",
    width: 64,
    height: 64,
    borderRadius: 18,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
    fontSize: 26,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    color: "white",
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#a5b4fc",
    textAlign: "center",
    marginBottom: 32,
  },
  primaryButton: {
    backgroundColor: "#0ea5e9",
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginBottom: 10,
  },
  primaryText: {
    color: "white",
    fontWeight: "600",
  },
  secondaryButton: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#64748b",
    paddingVertical: 12,
    paddingHorizontal: 40,
  },
  secondaryText: {
    color: "#e2e8f0",
    fontWeight: "500",
  },
  smallNote: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 24,
    textAlign: "center",
  },
});

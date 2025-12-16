import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../../App";

export default function PatientDashboardScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>HealthKey</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Hello, {user?.email || "patient"}</Text>
        <Text style={styles.subtitle}>
          This is the mobile preview of your HealthKey patient dashboard.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Next appointment</Text>
          <Text style={styles.cardText}>12 Dec 2025 • 10:30 AM</Text>
          <Text style={styles.cardTextSmall}>Dr. Mehta — Cardiology</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health card</Text>
          <Text style={styles.cardTextSmall}>
            NFC / QR based card details will be shown here.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  header: {
    paddingTop: 56,
    paddingBottom: 12,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#020617",
  },
  appName: { color: "white", fontWeight: "700", fontSize: 18 },
  logoutText: { color: "#e5e7eb", fontSize: 12 },
  content: { paddingHorizontal: 20, paddingBottom: 24 },
  title: { color: "white", fontSize: 20, fontWeight: "700", marginBottom: 4 },
  subtitle: { color: "#94a3b8", fontSize: 13, marginBottom: 16 },
  card: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1f2937",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: { color: "white", fontWeight: "600", marginBottom: 4 },
  cardText: { color: "#e5e7eb", fontSize: 14 },
  cardTextSmall: { color: "#9ca3af", fontSize: 12, marginTop: 2 },
});

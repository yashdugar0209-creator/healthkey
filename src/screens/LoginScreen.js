import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../App";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("patient"); // keep only patient for now
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill email and password (demo any value).");
      return;
    }
    try {
      await login({ email, role });
      // navigation will switch to PatientDashboard because user is set
    } catch (e) {
      setError("Demo login failed.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.caption}>Demo login for patient dashboard</Text>

      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        placeholderTextColor="#64748b"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="password (demo)"
        placeholderTextColor="#64748b"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.primaryButton} onPress={onSubmit}>
        <Text style={styles.primaryText}>Sign in</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.linkText}>New here? Create an account (demo)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#020617",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  title: { fontSize: 24, color: "white", fontWeight: "700", marginBottom: 4 },
  caption: { fontSize: 13, color: "#94a3b8", marginBottom: 20 },
  input: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "white",
    marginBottom: 12,
    fontSize: 14,
  },
  error: { color: "#fecaca", fontSize: 12, marginBottom: 8 },
  primaryButton: {
    backgroundColor: "#0ea5e9",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryText: { color: "white", fontWeight: "600" },
  linkText: { color: "#e2e8f0", fontSize: 13, textAlign: "center" },
});

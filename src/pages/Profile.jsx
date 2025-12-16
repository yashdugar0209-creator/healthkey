import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const auth = (useAuth && useAuth()) || { user: null, logout: () => {} };
  const user = auth.user;

  if (!user) {
    return <div><h3>No user signed in</h3></div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>ID:</strong> {user.id}</p>
    </div>
  );
}

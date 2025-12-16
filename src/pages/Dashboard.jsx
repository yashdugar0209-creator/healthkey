import React from "react";
import Container from "../components/ui/Container";
import Card from "../components/ui/Card";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <Container className="py-6">
      <h1 className="text-2xl font-bold mb-4">Your Dashboard</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-semibold">Recent Records</h3>
          <p className="text-sm text-slate-400 mt-2">No records yet (demo uses localstorage).</p>
        </Card>

        <Card>
          <h3 className="font-semibold">Quick actions</h3>
          <Link to="/patients" className="text-sm underline">View patients</Link>
        </Card>
      </div>
    </Container>
  );
}

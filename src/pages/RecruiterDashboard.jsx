import { useEffect, useState } from "react";
import CandidateCard from "../components/CandidateCard";
import { getCandidates } from "../services/api";

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    load();
  }, []);

 const load = async () => {
  try {
    const data = await getCandidates();
    setCandidates(Array.isArray(data) ? data : []);
  } catch (error) {
    console.warn("Backend not connected. Loading dummy data for Recruiter Dashboard.", error);
    // Dummy data for testing the UI
    setCandidates([
      {
        id: 1,
        full_name: "Alice Johnson",
        email: "alice@example.com",
        job_role: "Frontend Engineer",
        ai_score: 95,
        status: "shortlisted"
      },
      {
        id: 2,
        full_name: "Bob Smith",
        email: "bob@example.com",
        job_role: "Backend Developer",
        ai_score: 88,
        status: "pending"
      }
    ]);
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Recruiter Dashboard
      </h1>

      {candidates.length === 0 ? (
        <p>No candidates found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {candidates.map((c) => (
            <CandidateCard key={c.id} candidate={c} />
          ))}
        </div>
      )}
    </div>
  );
}
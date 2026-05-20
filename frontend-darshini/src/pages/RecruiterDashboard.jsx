import { useEffect, useState } from "react";
import CandidateCard from "../components/CandidateCard";
import { getCandidates } from "../services/api";

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    load();
  }, []);

 const load = async () => {
  const data = await getCandidates();

  console.log("RAW DATA TYPE:", typeof data);
  console.log("IS ARRAY:", Array.isArray(data));
  console.log("DATA:", data);

  setCandidates(Array.isArray(data) ? data : []);
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
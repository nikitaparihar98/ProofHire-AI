import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCandidateScores } from "../services/api";
import SkillReport from "../components/SkillReport";
import StrengthWeakness from "../components/StrengthWeakness";

export default function CandidateDetails() {
  const { id } = useParams();
  const [skills, setSkills] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getCandidateScores(id);
    setSkills(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Candidate Details</h1>

      <SkillReport skills={skills} />

      <StrengthWeakness skills={skills} />
    </div>
  );
}
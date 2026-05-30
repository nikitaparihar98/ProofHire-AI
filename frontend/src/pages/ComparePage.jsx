import { useEffect, useState } from "react";
import { getCandidates, getCandidateScores } from "../services/api";
import CompareCandidates from "../components/CompareCandidates";

export default function ComparePage() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    const res = await getCandidates();
    setCandidates(res);
  };

  const toggleCandidate = (id) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  const compare = async () => {
    const results = await Promise.all(
      selected.map(async (id) => {
        const skills = await getCandidateScores(id);
        const candidate = candidates.find((c) => c.id === id);

        return {
          ...candidate,
          skills,
        };
      })
    );

    setData(results);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-medium mb-4">
        Compare Candidates
      </h1>

      <div className="grid md:grid-cols-3 gap-3 mb-4">
        {candidates.map((c) => (
          <div
            key={c.id}
            onClick={() => toggleCandidate(c.id)}
            className={`p-3 border rounded cursor-pointer ${
              selected.includes(c.id)
                ? "bg-blue-100"
                : ""
            }`}
          >
            {c.name}
          </div>
        ))}
      </div>

      <button
        onClick={compare}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Compare
      </button>

      <CompareCandidates data={data} />
    </div>
  );
}
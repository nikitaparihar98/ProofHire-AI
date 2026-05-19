export default function CandidateTable({ candidates }) {
  return (
    <table className="w-full border mt-4">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 border">Name</th>
          <th className="p-3 border">Role</th>
          <th className="p-3 border">Score</th>
          <th className="p-3 border">Status</th>
        </tr>
      </thead>

      <tbody>
        {candidates.map((candidate) => (
          <tr key={candidate.id}>
            <td className="p-3 border">
              {candidate.name}
            </td>

            <td className="p-3 border">
              {candidate.candidate_role}
            </td>

            <td className="p-3 border">
              {candidate.overall_score}
            </td>

            <td className="p-3 border">
              {candidate.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default function CompareCandidates({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th>Score</th>
            <th>Confidence</th>
            <th>Problem Solving</th>
            <th>Code Quality</th>
            <th>Efficiency</th>
          </tr>
        </thead>

        <tbody>
          {data.map((c) => (
            <tr key={c.id} className="border-t text-center">
              <td className="p-2">{c.name}</td>
              <td>{c.overall_score}</td>
              <td>{c.confidence_score}</td>
              <td>{c.skills?.problem_solving}</td>
              <td>{c.skills?.code_quality}</td>
              <td>{c.skills?.efficiency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default function SkillReport({ skills }) {
  if (!skills) return null;

  return (
    <div className="border rounded-xl p-4 mt-4">
      <h2 className="text-lg font-bold mb-3">Skill Report</h2>

      {Object.entries(skills).map(([key, value]) => (
        <div key={key} className="flex justify-between py-1">
          <span className="capitalize">{key.replace("_", " ")}</span>
          <span className="font-semibold">{value}</span>
        </div>
      ))}
    </div>
  );
}
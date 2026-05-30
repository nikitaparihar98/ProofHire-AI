export default function StrengthWeakness({ skills }) {
  if (!skills) return null;

  const strengths = [];
  const weaknesses = [];

  Object.entries(skills).forEach(([k, v]) => {
    if (v >= 80) strengths.push(k);
    else if (v < 70) weaknesses.push(k);
  });

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <div className="border p-3 rounded-xl">
        <h3 className="font-medium text-emerald-600">Strengths</h3>
        {strengths.length ? (
          strengths.map((s) => <p key={s}>✔ {s}</p>)
        ) : (
          <p>None</p>
        )}
      </div>

      <div className="border p-3 rounded-xl">
        <h3 className="font-medium text-rose-500">Weaknesses</h3>
        {weaknesses.length ? (
          weaknesses.map((w) => <p key={w}>✖ {w}</p>)
        ) : (
          <p>None</p>
        )}
      </div>
    </div>
  );
}
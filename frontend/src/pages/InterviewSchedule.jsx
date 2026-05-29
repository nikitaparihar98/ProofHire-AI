import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCandidateInterviews } from '../services/api';
import { Link } from 'react-router-dom';

const getDisplayNotes = (notes) => {
  if (!notes) return '';
  try {
    const parsed = JSON.parse(notes);
    return parsed?.recruiter_notes || '';
  } catch {
    return notes;
  }
};

export default function InterviewSchedule() {
  const { user } = useAuth();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const candidateId = user?.candidate_id || user?.id;
      if (!candidateId) return;

      const data = await getCandidateInterviews(candidateId);

      setInterviews(data);
    } catch (err) {
      console.error("Failed to fetch interviews", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center">
        Loading interviews...
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          My Interviews
        </h1>

        <p className="text-slate-500 mt-2">
          View all scheduled interviews
        </p>
      </div>

      {interviews.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center">
          <h2 className="text-xl font-bold text-slate-800">
            No Interviews Scheduled
          </h2>

          <p className="text-slate-500 mt-2">
            Recruiters have not scheduled any interviews yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {interviews.map((interview) => (
            (() => {
              const displayNotes = getDisplayNotes(interview.notes);
              return (
            <div
              key={interview.id}
              className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {interview.interview_title}
                  </h2>

                  <p className="text-slate-500 mt-1">
                    {interview.mode} Interview
                  </p>
                </div>

                <span className="px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase">
                  {interview.status}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <div>
                  <span className="font-semibold text-slate-700">
                    Scheduled Time:
                  </span>

                  <p className="text-slate-600">
                    {new Date(interview.scheduled_time).toLocaleString()}
                  </p>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">
                    Candidate:
                  </span>

                  <p className="text-slate-600">
                    {interview.candidate_name}
                  </p>
                </div>

                {displayNotes && (
                  <div>
                    <span className="font-semibold text-slate-700">
                      Notes:
                    </span>

                    <p className="text-slate-600">
                      {displayNotes}
                    </p>
                  </div>
                )}
              </div>

              {interview.mode === "Online" && interview.status === "Scheduled" && (
                <Link
                  to={`/candidate/interviews/${interview.id}/room`}
                  className="mt-6 inline-flex px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
                >
                  Join Interview Room
                </Link>
              )}
              {interview.status === "Completed" && (
                <p className="mt-6 inline-flex rounded-xl bg-emerald-50 px-5 py-3 text-sm font-bold text-emerald-700">
                  Interview completed. Recruiter review is in progress.
                </p>
              )}
            </div>
              );
            })()
          ))}
        </div>
      )}
    </div>
  );
}

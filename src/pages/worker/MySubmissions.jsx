import { useState, useEffect } from "react";
import api from "../../api/axios";

const statusStyle = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

const MySubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get("/submissions/my").then(r => { setSubmissions(r.data); setLoading(false); }); }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Submissions</h2>
      {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" /></div>
        : submissions.length === 0 ? <div className="card text-center text-gray-400 py-12">No submissions yet.</div>
        : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left border-b">
              <th className="pb-3 text-gray-500 font-medium">Task</th>
              <th className="pb-3 text-gray-500 font-medium">Submission</th>
              <th className="pb-3 text-gray-500 font-medium">Coins</th>
              <th className="pb-3 text-gray-500 font-medium">Date</th>
              <th className="pb-3 text-gray-500 font-medium">Status</th>
            </tr></thead>
            <tbody className="divide-y">
              {submissions.map(s => (
                <tr key={s._id}>
                  <td className="py-3 font-medium text-gray-800 max-w-[160px] truncate">{s.taskTitle}</td>
                  <td className="py-3 text-gray-500 max-w-[200px] truncate">{s.submissionText}</td>
                  <td className="py-3 text-amber-600 font-medium">{s.payableAmount} 🪙</td>
                  <td className="py-3 text-gray-500">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyle[s.status]}`}>{s.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MySubmissions;

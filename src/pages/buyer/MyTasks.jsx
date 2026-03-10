import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { FaTrash, FaEye } from "react-icons/fa";

const MyTasks = () => {
  const { refreshUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTasks = () => api.get("/tasks/my").then(r => { setTasks(r.data); setLoading(false); });
  useEffect(() => { fetchTasks(); }, []);

  const viewSubmissions = async (task) => {
    setSelectedTask(task);
    const res = await api.get(`/submissions/task/${task._id}`);
    setSubmissions(res.data);
  };

  const deleteTask = async (task) => {
    if (!window.confirm("Delete this task? Coins will be refunded.")) return;
    await api.delete(`/tasks/${task._id}`);
    await refreshUser();
    toast.success("Task deleted. Coins refunded.");
    fetchTasks();
  };

  const approve = async (sub) => {
    await api.patch(`/submissions/${sub._id}/approve`);
    toast.success("Approved! Worker paid.");
    const res = await api.get(`/submissions/task/${selectedTask._id}`);
    setSubmissions(res.data);
    fetchTasks();
  };

  const reject = async (sub) => {
    await api.patch(`/submissions/${sub._id}/reject`);
    toast.info("Submission rejected.");
    const res = await api.get(`/submissions/task/${selectedTask._id}`);
    setSubmissions(res.data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Tasks</h2>
      {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" /></div>
        : tasks.length === 0 ? <div className="card text-center text-gray-400 py-12">No tasks yet.</div>
        : (
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task._id} className="card">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4 flex-1 min-w-0">
                  {task.imageUrl && <img src={task.imageUrl} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" alt="" />}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-800">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1 truncate">{task.detail}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                      <span>👷 {task.requiredWorkers} workers needed</span>
                      <span>🪙 {task.payableAmount} coins/worker</span>
                      <span>📅 {task.completionDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => viewSubmissions(task)} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                    <FaEye size={12} /> Submissions
                  </button>
                  <button onClick={() => deleteTask(task)} className="btn-danger text-xs py-1.5 px-3">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-bold">Submissions: {selectedTask.title}</h3>
              <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="p-6">
              {submissions.length === 0
                ? <p className="text-center text-gray-400 py-8">No pending submissions.</p>
                : submissions.map(sub => (
                  <div key={sub._id} className="border rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <img src={sub.workerPhoto || `https://ui-avatars.com/api/?name=${sub.workerName}&background=6366f1&color=fff`}
                        className="w-9 h-9 rounded-full" alt="" />
                      <div>
                        <p className="font-medium text-sm">{sub.workerName}</p>
                        <p className="text-xs text-gray-400">{sub.workerEmail}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3"><strong>Submission:</strong> {sub.submissionText}</p>
                    <div className="flex gap-2">
                      <button onClick={() => approve(sub)} className="btn-primary text-xs py-1.5 px-3">✓ Approve</button>
                      <button onClick={() => reject(sub)} className="btn-danger text-xs py-1.5 px-3">✗ Reject</button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;

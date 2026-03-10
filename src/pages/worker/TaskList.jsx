import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { FaCoins, FaCalendar, FaUsers } from "react-icons/fa";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionText, setSubmissionText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { api.get("/tasks").then(r => { setTasks(r.data); setLoading(false); }); }, []);

  const handleSubmit = async () => {
    if (!submissionText.trim()) return toast.warn("Please enter your submission.");
    setSubmitting(true);
    try {
      await api.post("/submissions", { taskId: selectedTask._id, submissionText });
      toast.success("Submission sent! Waiting for approval.");
      setTasks(prev => prev.filter(t => t._id !== selectedTask._id));
      setSelectedTask(null);
      setSubmissionText("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally { setSubmitting(false); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Tasks</h2>
      {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" /></div>
        : tasks.length === 0 ? <div className="card text-center text-gray-400 py-12">No available tasks at the moment.</div>
        : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map(task => (
            <div key={task._id} className="card hover:shadow-md transition-shadow">
              {task.imageUrl && <img src={task.imageUrl} className="w-full h-36 object-cover rounded-lg mb-3" alt="" />}
              <h3 className="font-semibold text-gray-800">{task.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.detail}</p>
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
                <span className="flex items-center gap-1"><FaCoins className="text-amber-500" />{task.payableAmount} coins</span>
                <span className="flex items-center gap-1"><FaUsers />{task.requiredWorkers} spots</span>
                <span className="flex items-center gap-1"><FaCalendar />{task.completionDate}</span>
              </div>
              <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                <strong>Submit:</strong> {task.submissionInfo}
              </div>
              <button onClick={() => { setSelectedTask(task); setSubmissionText(""); }}
                className="btn-primary w-full mt-4 text-sm">Submit Work</button>
            </div>
          ))}
        </div>
      )}

      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="font-bold">{selectedTask.title}</h3>
              <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-2"><strong>Instruction:</strong> {selectedTask.submissionInfo}</p>
              <textarea value={submissionText} onChange={e => setSubmissionText(e.target.value)}
                className="input-field h-28 resize-none" placeholder="Paste your submission here..." />
              <div className="flex gap-2 mt-4">
                <button onClick={() => setSelectedTask(null)} className="flex-1 border border-gray-300 rounded-lg py-2 text-sm hover:bg-gray-50">Cancel</button>
                <button onClick={handleSubmit} disabled={submitting} className="flex-1 btn-primary disabled:opacity-50">
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;

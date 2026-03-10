import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = () => api.get("/tasks/all").then(r => { setTasks(r.data); setLoading(false); });
  useEffect(() => { fetchTasks(); }, []);

  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    await api.delete(`/tasks/${id}`);
    toast.success("Task deleted.");
    fetchTasks();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Tasks</h2>
      {loading ? <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" /></div>
        : tasks.length === 0 ? <div className="card text-center text-gray-400 py-12">No tasks found.</div> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left border-b">
              <th className="pb-3 text-gray-500 font-medium">Title</th>
              <th className="pb-3 text-gray-500 font-medium">Buyer</th>
              <th className="pb-3 text-gray-500 font-medium">Workers</th>
              <th className="pb-3 text-gray-500 font-medium">Coins</th>
              <th className="pb-3 text-gray-500 font-medium">Deadline</th>
              <th className="pb-3 text-gray-500 font-medium">Action</th>
            </tr></thead>
            <tbody className="divide-y">
              {tasks.map(t => (
                <tr key={t._id}>
                  <td className="py-3 font-medium text-gray-800 max-w-[160px] truncate">{t.title}</td>
                  <td className="py-3 text-gray-500">{t.buyerName}</td>
                  <td className="py-3">{t.requiredWorkers}</td>
                  <td className="py-3 text-amber-600">{t.payableAmount} 🪙</td>
                  <td className="py-3 text-gray-500">{t.completionDate}</td>
                  <td className="py-3">
                    <button onClick={() => deleteTask(t._id)} className="btn-danger text-xs py-1 px-2 flex items-center gap-1">
                      <FaTrash size={10} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageTasks;

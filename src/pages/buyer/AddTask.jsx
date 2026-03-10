import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";
import { toast } from "react-toastify";

const AddTask = () => {
  const { user, refreshUser } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const rw = Number(watch("requiredWorkers", 0));
  const pa = Number(watch("payableAmount", 0));
  const totalCost = rw * pa;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await api.post("/tasks", data);
      await refreshUser();
      toast.success("Task added!");
      reset();
      navigate("/dashboard/buyer/my-tasks");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add task");
    } finally { setLoading(false); }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Task</h2>
      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Task Title</label>
            <input {...register("title", { required: "Required" })} className="input-field mt-1" placeholder="e.g. Write a product review" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Task Details</label>
            <textarea {...register("detail", { required: "Required" })} className="input-field mt-1 h-24 resize-none" placeholder="Describe what workers need to do..." />
            {errors.detail && <p className="text-red-500 text-xs mt-1">{errors.detail.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Required Workers</label>
              <input {...register("requiredWorkers", { required: "Required", min: { value: 1, message: "Min 1" } })}
                type="number" min="1" className="input-field mt-1" />
              {errors.requiredWorkers && <p className="text-red-500 text-xs mt-1">{errors.requiredWorkers.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Coins Per Worker</label>
              <input {...register("payableAmount", { required: "Required", min: { value: 1, message: "Min 1" } })}
                type="number" min="1" className="input-field mt-1" />
              {errors.payableAmount && <p className="text-red-500 text-xs mt-1">{errors.payableAmount.message}</p>}
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
            <span className="font-medium text-amber-700">Total cost: </span>
            <span className="text-amber-800 font-bold">{totalCost} coins</span>
            <span className="text-amber-600 ml-2">(You have {user?.coins} coins)</span>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Completion Date</label>
            <input {...register("completionDate", { required: "Required" })} type="date"
              className="input-field mt-1" min={new Date().toISOString().split("T")[0]} />
            {errors.completionDate && <p className="text-red-500 text-xs mt-1">{errors.completionDate.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Submission Info</label>
            <textarea {...register("submissionInfo", { required: "Required" })}
              className="input-field mt-1 h-20 resize-none" placeholder="What should workers submit as proof?" />
            {errors.submissionInfo && <p className="text-red-500 text-xs mt-1">{errors.submissionInfo.message}</p>}
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Task Image URL (optional)</label>
            <input {...register("imageUrl")} className="input-field mt-1" placeholder="https://..." />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? "Adding task..." : "Add Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;

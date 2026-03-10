import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

import Register from "./pages/Register";
import Login from "./pages/Login";
import DashboardLayout from "./pages/DashboardLayout";

import BuyerHome from "./pages/buyer/BuyerHome";
import AddTask from "./pages/buyer/AddTask";
import MyTasks from "./pages/buyer/MyTasks";
import PurchaseCoin from "./pages/buyer/PurchaseCoin";
import PaymentHistory from "./pages/buyer/PaymentHistory";

import WorkerHome from "./pages/worker/WorkerHome";
import TaskList from "./pages/worker/TaskList";
import MySubmissions from "./pages/worker/MySubmissions";
import Withdrawals from "./pages/worker/Withdrawals";

import AdminHome from "./pages/admin/AdminHome";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageTasks from "./pages/admin/ManageTasks";
import ManageWithdrawals from "./pages/admin/ManageWithdrawals";

function DashboardRedirect() {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === "buyer") return <Navigate to="/dashboard/buyer/home" replace />;
  if (user.role === "worker") return <Navigate to="/dashboard/worker/home" replace />;
  if (user.role === "admin") return <Navigate to="/dashboard/admin/home" replace />;
  return null;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route index element={<DashboardRedirect />} />

        {/* Buyer */}
        <Route path="buyer/home"           element={<PrivateRoute allowedRoles={["buyer"]}><BuyerHome /></PrivateRoute>} />
        <Route path="buyer/add-task"        element={<PrivateRoute allowedRoles={["buyer"]}><AddTask /></PrivateRoute>} />
        <Route path="buyer/my-tasks"        element={<PrivateRoute allowedRoles={["buyer"]}><MyTasks /></PrivateRoute>} />
        <Route path="buyer/purchase-coin"   element={<PrivateRoute allowedRoles={["buyer"]}><PurchaseCoin /></PrivateRoute>} />
        <Route path="buyer/payment-history" element={<PrivateRoute allowedRoles={["buyer"]}><PaymentHistory /></PrivateRoute>} />

        {/* Worker */}
        <Route path="worker/home"           element={<PrivateRoute allowedRoles={["worker"]}><WorkerHome /></PrivateRoute>} />
        <Route path="worker/task-list"      element={<PrivateRoute allowedRoles={["worker"]}><TaskList /></PrivateRoute>} />
        <Route path="worker/my-submissions" element={<PrivateRoute allowedRoles={["worker"]}><MySubmissions /></PrivateRoute>} />
        <Route path="worker/withdrawals"    element={<PrivateRoute allowedRoles={["worker"]}><Withdrawals /></PrivateRoute>} />

        {/* Admin */}
        <Route path="admin/home"               element={<PrivateRoute allowedRoles={["admin"]}><AdminHome /></PrivateRoute>} />
        <Route path="admin/manage-users"       element={<PrivateRoute allowedRoles={["admin"]}><ManageUsers /></PrivateRoute>} />
        <Route path="admin/manage-tasks"       element={<PrivateRoute allowedRoles={["admin"]}><ManageTasks /></PrivateRoute>} />
        <Route path="admin/manage-withdrawals" element={<PrivateRoute allowedRoles={["admin"]}><ManageWithdrawals /></PrivateRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

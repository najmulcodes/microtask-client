import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaUpload } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  const { register: registerUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("photo", file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);
      if (data.photo instanceof File) {
        formData.append("photo", data.photo);
      } else if (data.photoURL) {
        formData.append("photoURL", data.photoURL);
      }

      await registerUser(formData);
      toast.success("Registration successful! Welcome 🎉");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || "Registration failed";
      if (msg.toLowerCase().includes("email")) toast.error("This email is already registered.");
      else toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // Exchange access token for ID token via userinfo
      try {
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();
        // We need the credential (ID token) for our backend
        // Use implicit flow instead
        toast.error("Use the 'Sign in with Google' button on the login page for Google auth.");
      } catch {
        toast.error("Google sign-in failed.");
      }
    },
    onError: () => toast.error("Google sign-in failed."),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-indigo-600">🎯 MicroTask</h1>
          <p className="text-gray-500 mt-1">Create your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Profile Photo */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <img
                src={preview || "https://ui-avatars.com/api/?name=User&background=6366f1&color=fff"}
                className="w-20 h-20 rounded-full object-cover border-4 border-indigo-100"
                alt="preview"
              />
              <label className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-1.5 cursor-pointer hover:bg-indigo-600">
                <FaUpload size={10} />
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>
            <p className="text-xs text-gray-400">Upload photo (optional)</p>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input {...register("name", { required: "Name is required" })}
              className="input-field mt-1" placeholder="John Doe" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" },
            })} type="email" className="input-field mt-1" placeholder="you@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <input {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
                pattern: { value: /^(?=.*[A-Z])(?=.*\d)/, message: "Must include 1 uppercase & 1 number" },
              })} type={showPass ? "text" : "password"} className="input-field pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700">Role</label>
            <select {...register("role", { required: "Please select a role" })} className="input-field mt-1">
              <option value="">Select a role</option>
              <option value="worker">Worker — earn coins by completing tasks</option>
              <option value="buyer">Buyer — post tasks and pay workers</option>
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
          </div>

          <p className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
            🪙 Workers start with <strong>10 coins</strong>. Buyers start with <strong>50 coins</strong>.
          </p>

          <button type="submit" disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

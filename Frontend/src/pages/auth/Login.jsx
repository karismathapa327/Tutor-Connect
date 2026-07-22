import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { getDashboardPath } from "../../utils/getDashboardPath";
import { GraduationCap, AlertCircle } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: name === "email" ? validateEmail(value) : validatePassword(value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: name === "email" ? validateEmail(value) : validatePassword(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({ email: emailError, password: passwordError });
    setTouched({ email: true, password: true });

    if (emailError || passwordError) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      const data = await login(formData);
      toast.success(data.message);
      navigate(getDashboardPath(data.user.role));
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  const getInputClasses = (fieldName) => {
    const baseClasses = "w-full bg-slate-50 dark:bg-slate-800 border rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500";
    if (touched[fieldName] && errors[fieldName]) {
      return `${baseClasses} border-rose-300 dark:border-rose-700 focus:ring-rose-500`;
    }
    if (touched[fieldName] && !errors[fieldName] && formData[fieldName]) {
      return `${baseClasses} border-emerald-300 dark:border-emerald-700 focus:ring-emerald-500`;
    }
    return `${baseClasses} border-slate-200 dark:border-slate-700`;
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-8">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center">
              <GraduationCap className="text-indigo-600 dark:text-indigo-400" size={28} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
                Login
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Welcome back to TutorConnect
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1.5 text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@example.com"
                className={getInputClasses("email")}
              />
              {touched.email && errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1.5 text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your password"
                className={getInputClasses("password")}
              />
              {touched.password && errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
              disabled={Object.values(errors).some((error) => error !== "")}
            >
              Login
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

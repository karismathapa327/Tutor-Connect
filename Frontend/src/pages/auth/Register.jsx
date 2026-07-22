import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { GraduationCap, AlertCircle } from "lucide-react";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateName = (value) => {
    if (!value.trim()) return "Full name is required";
    if (!/^[A-Za-z\s]+$/.test(value)) return "Name must contain only letters and spaces";
    if (value.trim().length < 2) return "Name must be at least 2 characters";
    return "";
  };

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

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return validateName(value);
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      default:
        return "";
    }
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
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };

    setErrors(allErrors);
    setTouched({ name: true, email: true, password: true });

    const hasErrors = Object.values(allErrors).some((error) => error !== "");
    if (hasErrors) {
      toast.error("Please fix the errors in the form.");
      return;
    }

    try {
      const data = await register(formData);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
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
                Create an Account
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                Join TutorConnect today
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1.5 text-sm">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Karishma"
                className={getInputClasses("name")}
              />
              {touched.name && errors.name && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name}
                </p>
              )}
            </div>

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
                placeholder="karishma@example.com"
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
                placeholder="Min 6 characters"
                className={getInputClasses("password")}
              />
              {touched.password && errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-200 font-medium mb-1.5 text-sm">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
              disabled={Object.values(errors).some((error) => error !== "")}
            >
              Create Account
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

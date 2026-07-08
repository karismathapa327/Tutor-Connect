import { Link } from "react-router-dom";
import { FaGraduationCap } from "react-icons/fa";

function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold text-blue-600"
        >
          <FaGraduationCap />
          TutorConnect
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-8 font-medium">

          <a href="#home" className="hover:text-blue-600 transition duration-300">
            Home
          </a>

          <a href="#about" className="hover:text-blue-600 transition duration-300">
            About
          </a>

          <a href="#subjects" className="hover:text-blue-600 transition duration-300">
            Subjects
          </a>

          <a href="#tutors" className="hover:text-blue-600 transition duration-300">
            Tutors
          </a>

          <a href="#contact" className="hover:text-blue-600 transition duration-300">
            Contact
          </a>

        </div>

        {/* Buttons */}
        <div className="hidden md:flex gap-4">

          <Link
            to="/login"
            className="border border-blue-600 text-blue-600 px-5 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </Link>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;
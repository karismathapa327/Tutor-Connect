import { Link } from "react-router-dom";
import {
  FaGraduationCap,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

function Footer() {
  return (
    <footer
      id="contact"
      className="bg-gray-900 text-white pt-16 pb-8"
    >
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-4 gap-10">

        {/* Logo */}

        <div>

          <div className="flex items-center gap-2 text-3xl font-bold text-blue-400">

            <FaGraduationCap />

            TutorConnect

          </div>

          <p className="text-gray-400 mt-5 leading-7">
            Connecting students with experienced tutors
            to make quality education accessible for everyone.
          </p>

        </div>

        {/* Quick Links */}

        <div>

          <h3 className="text-xl font-semibold mb-5">
            Quick Links
          </h3>

          <ul className="space-y-3 text-gray-400">

            <li><a href="#home">Home</a></li>

            <li><a href="#about">About</a></li>

            <li><a href="#subjects">Subjects</a></li>

            <li><a href="#tutors">Tutors</a></li>

          </ul>

        </div>

        {/* Account */}

        <div>

          <h3 className="text-xl font-semibold mb-5">
            Account
          </h3>

          <ul className="space-y-3 text-gray-400">

            <li>
              <Link to="/login">
                Login
              </Link>
            </li>

            <li>
              <Link to="/register">
                Register
              </Link>
            </li>

          </ul>

        </div>

        {/* Social */}

        <div>

          <h3 className="text-xl font-semibold mb-5">
            Follow Us
          </h3>

          <div className="flex gap-5 text-3xl text-blue-400">

            <FaFacebook className="cursor-pointer" />

            <FaInstagram className="cursor-pointer" />

            <FaLinkedin className="cursor-pointer" />

            <FaGithub className="cursor-pointer" />

          </div>

        </div>

      </div>

      <hr className="border-gray-700 my-10" />

      <div className="text-center text-gray-400">

        © {new Date().getFullYear()} TutorConnect.

        All Rights Reserved.

      </div>

    </footer>
  );
}

export default Footer;
import { Link } from "react-router-dom";
import Button from "../common/Button";

function Hero() {
  return (
    <section
      id="home"
      className="bg-linear-to-br from-blue-50 via-white to-blue-100 min-h-[90vh] flex items-center"
    >
      <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Content */}
        <div>

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
            🎓 Welcome to TutorConnect
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold mt-6 leading-tight">
            Learn Better.
            <br />
            <span className="text-blue-600">
              Teach Smarter.
            </span>
          </h1>

          <p className="text-gray-600 text-lg mt-6 leading-8">
            TutorConnect helps students find experienced tutors,
            schedule personalized tutoring sessions,
            and achieve academic success from anywhere.
          </p>

          <div className="flex gap-4 mt-8">

                <Button
                    text="Find a Tutor"
                    to="/register"
                />

                <Button
                    text="Become a Tutor"
                    to="/register"
                    variant="secondary"
                />

          </div>

          {/* Statistics */}

          <div className="flex gap-10 mt-10">

            <div className="text-center">
              <h2 className="text-3xl font-bold text-blue-600">
                500+
              </h2>
              <p className="text-gray-500">
                Students
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-blue-600">
                100+
              </h2>
              <p className="text-gray-500">
                Tutors
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-blue-600">
                20+
              </h2>
              <p className="text-gray-500">
                Subjects
              </p>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="flex justify-center">

          <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md">

            <div className="text-center">

              <div className="text-8xl">
                👩‍🏫
              </div>

              <h2 className="text-2xl font-bold mt-4">
                Expert Tutors
              </h2>

              <p className="text-gray-500 mt-2">
                Learn from verified teachers,
                professionals, and university students.
              </p>

              <div className="mt-6 bg-yellow-100 py-3 rounded-xl">

                ⭐⭐⭐⭐⭐

                <p className="font-semibold">
                  Rated 4.9 / 5
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;
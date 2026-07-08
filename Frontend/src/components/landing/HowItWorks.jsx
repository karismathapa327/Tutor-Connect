import {
  FaUserPlus,
  FaSearch,
  FaCalendarCheck,
  FaGraduationCap,
  FaArrowRight,
} from "react-icons/fa";

function HowItWorks() {
  const steps = [
    {
      icon: <FaUserPlus size={40} />,
      title: "Create Account",
      description:
        "Sign up as a student or tutor in just a few minutes.",
    },
    {
      icon: <FaSearch size={40} />,
      title: "Find a Tutor",
      description:
        "Browse verified tutors based on subject, rating, and availability.",
    },
    {
      icon: <FaCalendarCheck size={40} />,
      title: "Book a Session",
      description:
        "Choose a convenient time and send a tutoring request.",
    },
    {
      icon: <FaGraduationCap size={40} />,
      title: "Start Learning",
      description:
        "Attend your session, learn effectively, and leave a review.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">

        {/* Heading */}
        <div className="text-center mb-16">

          <p className="text-blue-600 font-semibold uppercase">
            How It Works
          </p>

          <h2 className="text-4xl font-bold mt-2">
            Start Learning in Four Simple Steps
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto">
            TutorConnect makes finding the right tutor simple,
            quick, and stress-free.
          </p>

        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-4 gap-8">

          {steps.map((step, index) => (

            <div
              key={index}
              className="relative bg-blue-50 rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300"
            >

              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-6">
                {step.icon}
              </div>

              <h3 className="text-2xl font-bold mb-4">
                {step.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {step.description}
              </p>

              {/* Arrow */}

              {index !== steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 -right-6 text-blue-500">
                  <FaArrowRight size={28} />
                </div>
              )}

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;
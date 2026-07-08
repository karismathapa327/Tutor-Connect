import {
  FaUserCheck,
  FaCalendarAlt,
  FaDollarSign,
  FaChartLine,
} from "react-icons/fa";

function Features() {
  const features = [
    {
      icon: <FaUserCheck size={40} />,
      title: "Verified Tutors",
      description:
        "Every tutor is verified to ensure quality education and trust.",
    },
    {
      icon: <FaCalendarAlt size={40} />,
      title: "Flexible Scheduling",
      description:
        "Book tutoring sessions at a time that fits your schedule.",
    },
    {
      icon: <FaDollarSign size={40} />,
      title: "Affordable Learning",
      description:
        "Choose tutors that match your budget without compromising quality.",
    },
    {
      icon: <FaChartLine size={40} />,
      title: "Track Progress",
      description:
        "Monitor completed sessions, ratings, and your learning journey.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">

        <div className="text-center mb-16">

          <p className="text-blue-600 font-semibold uppercase">
            Why Choose TutorConnect
          </p>

          <h2 className="text-4xl font-bold mt-2">
            Connecting Students with Expert Tutors
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto">
            TutorConnect makes learning simple, affordable, and accessible
            through verified tutors and personalized online sessions.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature, index) => (

            <div
              key={index}
              className="bg-blue-50 rounded-2xl p-8 shadow-md hover:shadow-xl hover:-translate-y-2 transition duration-300"
            >
              <div className="text-blue-600 mb-6">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold mb-4">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {feature.description}
              </p>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default Features;
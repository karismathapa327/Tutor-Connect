import {
  FaLaptopCode,
  FaCalculator,
  FaFlask,
  FaBook,
  FaAtom,
  FaLeaf,
} from "react-icons/fa";

function Subjects() {
  const subjects = [
    {
      icon: <FaLaptopCode size={40} />,
      title: "Computer Science",
      description: "Programming, Web Development, Data Structures, and more.",
      tutors: 120,
    },
    {
      icon: <FaCalculator size={40} />,
      title: "Mathematics",
      description: "Algebra, Calculus, Geometry, and Statistics.",
      tutors: 95,
    },
    {
      icon: <FaFlask size={40} />,
      title: "Science",
      description: "Chemistry, Biology, Environmental Science.",
      tutors: 80,
    },
    {
      icon: <FaBook size={40} />,
      title: "English",
      description: "Grammar, Writing, Speaking, and IELTS preparation.",
      tutors: 75,
    },
    {
      icon: <FaAtom size={40} />,
      title: "Physics",
      description: "Mechanics, Electricity, Optics, and Thermodynamics.",
      tutors: 60,
    },
    {
      icon: <FaLeaf size={40} />,
      title: "Biology",
      description: "Genetics, Anatomy, Microbiology, and Ecology.",
      tutors: 50,
    },
  ];

  return (
    <section id="subjects" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">

        {/* Heading */}

        <div className="text-center mb-16">

          <p className="text-blue-600 font-semibold uppercase">
            Popular Subjects
          </p>

          <h2 className="text-4xl font-bold mt-2">
            Explore Subjects You Can Learn
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto">
            Discover experienced tutors across multiple subjects and
            start learning with confidence.
          </p>

        </div>

        {/* Subject Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {subjects.map((subject, index) => (

            <div
              key={index}
              className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl hover:-translate-y-2 transition duration-300"
            >

              <div className="text-blue-600 mb-5">
                {subject.icon}
              </div>

              <h3 className="text-2xl font-bold mb-3">
                {subject.title}
              </h3>

              <p className="text-gray-600 leading-7 mb-6">
                {subject.description}
              </p>

              <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                {subject.tutors}+ Tutors
              </span>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default Subjects;
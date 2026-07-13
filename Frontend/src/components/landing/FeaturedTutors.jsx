import { User } from "lucide-react";
import Button from "../common/Button";

function FeaturedTutors() {
  const tutors = [
    {
      id: 1,
      name: "Jane Smith",
      subject: "Computer Science",
      rating: 4.9,
      experience: "5 Years",
      rate: "$20/hr",
    },
    {
      id: 2,
      name: "David Johnson",
      subject: "Mathematics",
      rating: 4.8,
      experience: "7 Years",
      rate: "$18/hr",
    },
    {
      id: 3,
      name: "Emily Brown",
      subject: "English",
      rating: 5.0,
      experience: "6 Years",
      rate: "$22/hr",
    },
  ];

  return (
    <section id="tutors" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-8">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-blue-600 font-semibold uppercase">
            Featured Tutors
          </p>

          <h2 className="text-4xl font-bold mt-2">
            Meet Our Top Tutors
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto">
            Learn from experienced and verified tutors across multiple
            subjects.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {tutors.map((tutor) => (

            <div
              key={tutor.id}
              className="bg-white rounded-2xl shadow-md p-8"
            >

              <div className="w-24 h-24 rounded-full bg-blue-100 mx-auto flex items-center justify-center text-4xl">
                <User className="w-10 h-10"></User>
              </div>

              <h3 className="text-2xl font-bold text-center mt-6">
                {tutor.name}
              </h3>

              <p className="text-blue-600 text-center mt-2">
                {tutor.subject}
              </p>

              <div className="mt-6 space-y-2 text-gray-600">

                <p>⭐ Rating: {tutor.rating}</p>

                <p>💰 Rate: {tutor.rate}</p>

                <p>📅 Experience: {tutor.experience}</p>

              </div>

              <div className="mt-8 flex justify-center">

                <Button
                  text="View Profile"
                  to="/register"
                />

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default FeaturedTutors;
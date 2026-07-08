function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      course: "Computer Science Student",
      review:
        "TutorConnect helped me improve my grades in just two months. The tutors are knowledgeable and supportive.",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      id: 2,
      name: "Michael Lee",
      course: "Engineering Student",
      review:
        "Booking sessions was simple and my tutor explained difficult concepts in an easy-to-understand way.",
      rating: "⭐⭐⭐⭐⭐",
    },
    {
      id: 3,
      name: "Emily Davis",
      course: "Biology Student",
      review:
        "The platform is easy to use and I found an excellent tutor within a day.",
      rating: "⭐⭐⭐⭐⭐",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">

        {/* Heading */}
        <div className="text-center mb-16">

          <p className="text-blue-600 font-semibold uppercase">
            Testimonials
          </p>

          <h2 className="text-4xl font-bold mt-2">
            What Our Students Say
          </h2>

          <p className="text-gray-500 mt-5 max-w-2xl mx-auto">
            Hear from students who have achieved their learning goals through TutorConnect.
          </p>

        </div>

        {/* Cards */}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {testimonials.map((testimonial) => (

            <div
              key={testimonial.id}
              className="bg-blue-50 rounded-2xl shadow-md p-8"
            >

              <p className="text-2xl">
                {testimonial.rating}
              </p>

              <p className="text-gray-700 leading-7 italic mt-6">
                "{testimonial.review}"
              </p>

              <div className="mt-8">

                <h3 className="font-bold text-xl">
                  {testimonial.name}
                </h3>

                <p className="text-blue-600">
                  {testimonial.course}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}

export default Testimonials;
import Button from "../common/Button";

function CTA() {
  return (
    <section className="py-24 bg-blue-600">

      <div className="max-w-4xl mx-auto text-center px-8">

        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Ready to Start Your Learning Journey?
        </h2>

        <p className="text-blue-100 text-lg mt-6 leading-8">
          Join TutorConnect today and connect with experienced tutors,
          schedule personalized sessions, and achieve your academic goals.
        </p>

        <div className="mt-10 flex justify-center">

          <Button
            text="Get Started Today"
            to="/register"
          />

        </div>

      </div>

    </section>
  );
}

export default CTA;
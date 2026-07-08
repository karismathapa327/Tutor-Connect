import Navbar from "../components/common/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Subjects from "../components/landing/Subjects";
import HowItWorks from "../components/landing/HowItWorks";
import FeaturedTutors from "../components/landing/FeaturedTutors";
import Testimonials from "../components/landing/Testimonials";
import CTA from "../components/landing/CTA";
import Footer from "../components/common/Footer";

function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Subjects />
      <HowItWorks />
      <FeaturedTutors />
      <Testimonials />
      <CTA />
      <Footer />
      
    </>
  );
}

export default Landing;
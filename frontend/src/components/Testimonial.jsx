import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { testimonialStyles as a } from "../assets/dummyStyles";
const Testimonial = () => {
  const scrollRefLeft = useRef(null);
  const scrollRefRight = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      role: "Cardiologist",
      rating: 5,
      text: "The appointment booking system is incredibly efficient. It saves me valuable time and helps me focus on patient care.",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      type: "doctor",
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Patient",
      rating: 5,
      text: "Scheduling appointments has never been easier. The interface is intuitive and reminders are very helpful!",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
      type: "patient",
    },
    {
      id: 3,
      name: "Dr. Robert Martinez",
      role: "Pediatrician",
      rating: 4,
      text: "This platform has streamlined our clinic operations significantly. Patient management is much more organized.",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
      type: "doctor",
    },
    {
      id: 4,
      name: "Emily Williams",
      role: "Patient",
      rating: 5,
      text: "Booking appointments online 24/7 is a game-changer. The confirmation system gives me peace of mind.",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80",
      type: "patient",
    },
    {
      id: 5,
      name: "Dr. Amanda Lee",
      role: "Dermatologist",
      rating: 5,
      text: "Excellent platform for managing appointments. Automated reminders reduce no-shows dramatically.",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
      type: "doctor",
    },
    {
      id: 6,
      name: "David Thompson",
      role: "Patient",
      rating: 5,
      text: "The wait time has reduced significantly since using this platform. Very convenient and user-friendly!",
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80",
      type: "patient",
    },
  ];

  const leftTestimonials = testimonials.filter((t) => t.type === "doctor");
  const rightTestimonials = testimonials.filter((t) => t.type === "patient");

  useEffect(() => {
    const scrollLeft = scrollRefLeft.current;
    const scrollRight = scrollRefRight.current;
    if (!scrollLeft || !scrollRight) return;

    let leftPos = 0;
    let rightPos = 0;
    let rafId;
    const scrollSpeed = 0.5;

    // Give images a moment to load so scrollHeight is accurate
    const timer = setTimeout(() => {
      rightPos = scrollRight.scrollHeight / 2;
      scrollRight.scrollTop = Math.round(rightPos);
    }, 300);

    const smoothScroll = () => {
      if (!isPaused) {
        const leftMax = scrollLeft.scrollHeight / 2;
        const rightMax = scrollRight.scrollHeight / 2;

        leftPos += scrollSpeed;
        if (leftPos >= leftMax) leftPos = 0;

        rightPos -= scrollSpeed;
        if (rightPos <= 0) rightPos = rightMax;

        scrollLeft.scrollTop = Math.round(leftPos);
        scrollRight.scrollTop = Math.round(rightPos);
      }
      rafId = requestAnimationFrame(smoothScroll);
    };

    rafId = requestAnimationFrame(smoothScroll);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafId);
    };
  }, [isPaused]);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? a.activeStar : a.inactiveStar}>
        <Star className={a.star} />
      </span>
    ));

  const TestimonialCard = ({ testimonial, direction }) => (
    <div
      className={`${a.testimonialCard} ${
        direction === "left" ? a.leftCardBorder : a.rightCardBorder
      }`}
    >
      <div className={a.cardContent}>
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className={a.avatar}
        />
        <div className={a.textContainer}>
          <div className={a.nameRoleContainer}>
            <div>
              <h4
                className={`${a.name} ${
                  direction === "left" ? a.leftName : a.rightName
                }`}
              >
                {testimonial.name}
              </h4>
              <p className={a.role}>{testimonial.role}</p>
            </div>
            <div className={a.starsContainer}>
              {renderStars(testimonial.rating)}
            </div>
          </div>

          <p className={a.quote}>"{testimonial.text}"</p>

          {/* Stars on small screens beneath text */}
          <div className={a.mobileStarsContainer}>
            {renderStars(testimonial.rating)}
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className={a.container}>
      <div className={a.headerContainer}>
        <h2 className={a.title}>Voices of Trust</h2>
        <p className={a.subTitle}>
          Real stories from doctors and patients sharing their positive
          experiences with our healthcare platform.
        </p>
      </div>
      <div
        className={a.grid}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className={`${a.columnContainer} ${a.leftColumnBorder}`}>
          <div className={`${a.columnHeader} ${a.leftColumnBorder}`}>
            👩‍⚕️ Medical Professionals
          </div>
          <div
            className={a.scrollContainer}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            ref={scrollRefLeft}
          >
            {[...leftTestimonials, ...leftTestimonials].map((t, i) => (
              <TestimonialCard
                key={`L-${i}`}
                testimonial={t}
                direction="left"
              />
            ))}
          </div>
        </div>
        <div className={`${a.columnContainer} ${a.rightColumnBorder}`}>
          <div className={`${a.columnHeader} ${a.rightColumnHeader}`}>
            {" "}
            🧑 Patients
          </div>
          <div
            className={a.scrollContainer}
            ref={scrollRefRight}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {[...rightTestimonials, ...rightTestimonials].map((t, i) => (
              <TestimonialCard
                key={`R-${i}`}
                testimonial={t}
                direction="right"
              />
            ))}
          </div>
        </div>
      </div>
      <style>{a.animationStyles}</style>
    </div>
  );
};

export default Testimonial;

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../index.css";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const pinnedContainerRef = useRef(null);
  const lineRefs = useRef([]);
  const ctaContainerRef = useRef(null);
  const inviteTextRef = useRef(null);

  // Utility to add each "line" to our refs for GSAP.
  const addToRefs = (el) => {
    if (el && !lineRefs.current.includes(el)) {
      lineRefs.current.push(el);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Use a scroll distance multiplier to provide enough scroll room.
      const extraScrollRoom = pinnedContainerRef.current.offsetHeight + window.innerHeight * 3;
      // Pin the entire container for extra scroll distance.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinnedContainerRef.current,
          start: "top top",
          end: extraScrollRoom,
          scrub: true,
          pin: true,
          pinSpacing: true,
          // markers: true, // Uncomment for debugging
        },
      });

      // Animate each line sequentially.
      lineRefs.current.forEach((line) => {
        tl.fromTo(
          line,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1 }
        );
      });

      // Animate the invite text and separator
      if (inviteTextRef.current) {
        tl.fromTo(
          inviteTextRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1 }
        );
      }

      // Animate the CTA container (both buttons appear together).
      if (ctaContainerRef.current) {
        tl.fromTo(
          ctaContainerRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1 }
        );
      }
    }, pinnedContainerRef);

    return () => ctx.revert();
  }, []);

  // Define the header lines exactly as you want them displayed.
  const headerLines = [
    "In",
    "a",
    "world",
    "of",
    "endless",
    "conversations,",
    "meetings,",
    "and",
    "ideas,",
    "too",
    "much",
    "gets",
    "lost."
  ];

  return (
    <div className="bg-background text-text min-h-screen flex flex-col justify-between">
      {/* Pinned Container: Header, Tagline, Extra Line, CTA, and scroll anchor */}
      <header
        ref={pinnedContainerRef}
        className="flex-grow flex flex-col justify-center items-center w-full"
      >
        <div className="w-full px-4 max-w-3xl mx-auto text-center">
          {/* First sentence — appears in the middle of the screen initially */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 mt-32">
            <span style={{ color: "#B4D4FF" }}>
              Time is your most valuable resource.
            </span>
          </h1>

          {/* Remaining lines */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6">
            {headerLines.map((word, i) => (
              <span
                key={i}
                ref={addToRefs}
                className="inline-block mx-1"
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Tagline */}
          <div ref={addToRefs} className="mb-4">
            <h1 className="max-w-2xl mx-auto text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-highlight text-center">
              <span className="text-accent glow">Kairos</span> helps you capture and recall what matters.
            </h1>
          </div>
          {/* <div ref={addToRefs} className="mb-4">
            <h1 className="max-w-2xl mx-auto text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-highlight text-center">
              So you can move as fast as you think, without the hassle.
            </h1>
          </div> */}
          {/* Extra Line */}
          <div ref={addToRefs} className="mb-6">
            <h1 className="max-w-2xl mx-auto text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-highlight text-center">
              Built for those who move fast and think faster.
            </h1>
          </div>

          {/* Separator and Invite Text */}
          <div ref={inviteTextRef}>
            <hr className="border-t my-4" style={{ borderColor: "#FF8A5B" }} />
            <p className="text-lg font-semibold text-gray-300 mb-4">Invite Only. Join the Waitlist:</p>
          </div>

          {/* CTA Buttons (appear together) */}
          <div
            ref={ctaContainerRef}
            className="flex flex-col sm:flex-row justify-center items-center gap-6 px-4 mt-8"
          >
            {/* Personal Button */}
            <button
              onClick={() => (window.location.href = "/personal")}
              className="
                w-64 
                px-8 py-5 
                font-semibold 
                rounded-md 
                shadow-md 
                hover:shadow-lg 
                transform hover:scale-105 
                transition duration-200
                flex flex-col items-center
                personal-glow
              "
            >
              <span className="text-xl font-bold">Personal</span>
              <span className="text-sm">Stay Sharp</span>
            </button>

            {/* Work Button */}
            <button
              onClick={() => (window.location.href = "/work")}
              className="
                w-64 
                px-8 py-5 
                font-semibold 
                rounded-md 
                shadow-md 
                hover:shadow-lg 
                transform hover:scale-105 
                transition duration-200
                flex flex-col items-center
                work-glow
              "
            >
              <span className="text-xl font-bold">Work</span>
              <span className="text-sm">Get Ahead</span>
            </button>
          </div>

          {/* Hacky scroll anchor: a 1px div that matches the background color */}
          <div className="h-16 bg-border" />
        </div>
      </header>

      {/* Footer */}
      <footer
        className="w-full max-w-3xl mx-auto text-center py-4 fixed bottom-0"
        style={{
          background: "linear-gradient(to top, rgba(28, 31, 51, 0.9), rgba(28, 31, 51, 0.7))",
          color: "#F8FAFC",
        }}
      >
         © Kairos 2024 All Rights Reserved
      </footer>
    </div>
  );
}

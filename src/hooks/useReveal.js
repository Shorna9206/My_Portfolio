import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function useReveal(scope) {
  useEffect(() => {
    if (!scope?.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        const direction = el.dataset.reveal || "up";
        const from =
          direction === "left" ? { x: -110, rotate: -4, scale: 0.94 } :
          direction === "right" ? { x: 110, rotate: 4, scale: 0.94 } :
          { y: 64, rotate: 0, scale: 0.97 };
        gsap.fromTo(el, { ...from, opacity: 0 }, {
          x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, duration: 1.15, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 90%", end: "bottom 10%", toggleActions: "play none none reverse" }
        });
      });

      // Stagger children that share the same parent grid/list for a wave effect
      gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
        const items = group.querySelectorAll("[data-reveal-item]");
        if (!items.length) return;
        gsap.fromTo(items, { y: 50, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: group, start: "top 85%", toggleActions: "play none none reverse" }
        });
      });

      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          y: Number(el.dataset.parallax || 60),
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 }
        });
      });

      gsap.utils.toArray("[data-rotate]").forEach((el) => {
        gsap.to(el, {
          rotate: Number(el.dataset.rotate || 8),
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 }
        });
      });
    }, scope);

    return () => ctx.revert();
  }, [scope]);
}

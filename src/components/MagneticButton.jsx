import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const MotionLink = motion.create(Link);

export default function MagneticButton({ children, to, href, secondary = false }) {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const cls = `magnetic-btn ${secondary ? "secondary" : ""}`;

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setPos({ x: relX * 0.35, y: relY * 0.45 });
  };
  const handleLeave = () => setPos({ x: 0, y: 0 });

  const motionProps = {
    ref,
    className: cls,
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    animate: { x: pos.x, y: pos.y },
    transition: { type: "spring", stiffness: 180, damping: 12, mass: 0.3 },
    whileTap: { scale: 0.94 }
  };

  if (href) {
    const isExternal = /^https?:\/\//i.test(href);
    return (
      <motion.a {...motionProps} href={href} {...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}>
        {children}<ArrowUpRight size={16} />
      </motion.a>
    );
  }
  return (
    <MotionLink {...motionProps} to={to}>
      {children}<ArrowUpRight size={16} />
    </MotionLink>
  );
}

import { motion } from "framer-motion";

export default function SectionTitle({ eyebrow, title, text, number }) {
  return <div className="section-title" data-reveal>
    <div>
      <span className="eyebrow">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          style={{ display: "inline-block" }}
        >{number}</motion.span> / {eyebrow}
      </span>
      <h2>{title}</h2>
    </div>
    {text && <p>{text}</p>}
  </div>;
}

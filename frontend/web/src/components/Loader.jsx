import { motion } from "framer-motion";

export default function Loader() {
  return (
    <motion.div className="loader" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: .7, delay: 1.25 }} style={{ pointerEvents: "none" }}>
      <div className="loader-mark">RS</div>
      <div className="loader-line"><span /></div>
      <p>LOADING EXPERIENCE</p>
    </motion.div>
  );
}
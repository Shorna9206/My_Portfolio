import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);

export default function ProjectCard({ project, index }) {
  const direction = index % 2 === 0 ? "left" : "right";
  return (
    <MotionLink
      to={`/projects/${project.slug}`}
      className="project-card"
      data-cursor
      data-reveal={direction}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <div className="project-media">
        <img src={project.image} alt={project.title}/>
        <span className="project-index">0{index+1}</span>
        <span className="project-view">VIEW <ArrowUpRight size={18}/></span>
      </div>
      <div className="project-info"><div><span className="eyebrow">{project.category}</span><h3>{project.title}</h3></div><span className="project-year">{project.year}</span></div>
    </MotionLink>
  );
}

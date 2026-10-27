import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight, Sun, Moon } from "lucide-react";

const links = [
  ["Home", "/"], ["About", "/about"], ["Skills", "/skills"], ["Projects", "/projects"],
  ["Experience", "/experience"], ["Research", "/research"], ["Contact", "/contact"]
];

export default function Navbar({ theme, setTheme }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="nav-wrap">
      <nav className="nav container">
        <Link className="brand" to="/" onClick={() => setOpen(false)}><span>RS</span><b>ROKEYA SHORNA</b></Link>
        <div className="desktop-nav">
          {links.map(([label, href]) => <NavLink key={href} to={href} className={({isActive}) => isActive ? "active" : ""}>{label}</NavLink>)}
          <Link className="nav-resume" to="/resume">Resume <ArrowUpRight size={14}/></Link>
          <motion.button
            className="icon-btn"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.88, rotate: 180 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={theme}
                initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                transition={{ duration: 0.25 }}
                style={{ display: "grid", placeItems: "center" }}
              >
                {theme === "dark" ? <Sun size={17}/> : <Moon size={17}/>}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
        <motion.button
          className="mobile-menu"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          whileTap={{ scale: 0.88 }}
        >
          <Menu />
        </motion.button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-top">
              <span className="brand"><span>RS</span><b>ROKEYA SHORNA</b></span>
              <motion.button className="icon-btn" onClick={() => setOpen(false)} whileTap={{ scale: 0.85, rotate: 90 }}><X/></motion.button>
            </div>
            <div className="mobile-links">
              {links.map(([label, href], i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                >
                  <NavLink to={href} onClick={() => setOpen(false)}>{label}</NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: links.length * 0.05, duration: 0.4, ease: "easeOut" }}
              >
                <NavLink to="/resume" onClick={() => setOpen(false)}>Resume ↗</NavLink>
              </motion.div>
            </div>
            <p className="mobile-foot">RESEARCH • CODE • DESIGN</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

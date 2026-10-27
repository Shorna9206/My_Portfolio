import { useEffect, useRef, useState } from "react";
import { Routes, Route, useLocation, Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Download, Mail, MapPin, Github, Linkedin, ExternalLink, Award, Users, BookOpen, BriefcaseBusiness } from "lucide-react";
import useLenis from "./hooks/useLenis";
import useReveal from "./hooks/useReveal";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loader from "./components/Loader";
import CustomCursor from "./components/CustomCursor";
import ScrollProgress from "./components/ScrollProgress";
import SectionTitle from "./components/SectionTitle";
import MagneticButton from "./components/MagneticButton";
import ProjectCard from "./components/ProjectCard";
import ThreeOrb from "./components/ThreeOrb";
import { profile, education, experiences, skills, projects, publications, awards, workshops, leadership, references, coursework, hobbies } from "./data/portfolio";

function Layout({theme, setTheme}) {
  const location = useLocation();
  const scope = useRef(null);
  useLenis(); useReveal(scope);
  useEffect(() => { window.scrollTo({top:0, behavior:"instant"}); }, [location.pathname]);
  return <div ref={scope}>
    <ScrollProgress/><CustomCursor/><Navbar theme={theme} setTheme={setTheme}/><Loader/>
    <AnimatePresence mode="wait"><motion.main key={location.pathname} initial={{opacity:0,y:34,scale:.985,filter:"blur(6px)"}} animate={{opacity:1,y:0,scale:1,filter:"blur(0px)"}} exit={{opacity:0,y:-24,scale:.985,filter:"blur(6px)"}} transition={{duration:.6,ease:[0.16,1,0.3,1]}}><Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/skills" element={<Skills/>}/>
      <Route path="/projects" element={<Projects/>}/>
      <Route path="/projects/:slug" element={<ProjectDetail/>}/>
      <Route path="/experience" element={<Experience/>}/>
      <Route path="/research" element={<Research/>}/>
      <Route path="/services" element={<Services/>}/>
      <Route path="/resume" element={<Resume/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="*" element={<NotFound/>}/>
    </Routes></motion.main></AnimatePresence>
    <Footer/>
  </div>;
}

function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const isFloat = typeof to === "number" && !Number.isInteger(to);
  useEffect(() => {
    let raf, start;
    const duration = 1400;
    const tick = (t) => {
      if (!start) start = t;
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(to * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to]);
  return <strong>{isFloat ? val.toFixed(2) : Math.round(val)}{suffix}</strong>;
}

function Home() {
  return <div>
    <section className="hero">
      <motion.div className="hero-grid" animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}/>
      <motion.div className="hero-glow" animate={{ scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, 15, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}/>
      <div className="container hero-inner">
        <div className="hero-copy">
          <motion.span className="eyebrow hero-eyebrow" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.6,ease:"easeOut"}}>RESEARCHER • PROGRAMMER • WEB DEVELOPER</motion.span>
          <motion.h1
            initial="hidden" animate="show"
            variants={{ hidden:{}, show:{ transition:{ staggerChildren:0.14, delayChildren:0.15 } } }}
          >
            <motion.span variants={{hidden:{opacity:0,y:44,rotateX:35},show:{opacity:1,y:0,rotateX:0,transition:{duration:.8,ease:[0.16,1,0.3,1]}}}} style={{display:"block",transformOrigin:"bottom"}}>Ideas into</motion.span>
            <motion.em variants={{hidden:{opacity:0,y:44,rotateX:35},show:{opacity:1,y:0,rotateX:0,transition:{duration:.8,ease:[0.16,1,0.3,1]}}}} style={{display:"block",transformOrigin:"bottom"}}>intelligent</motion.em>
            <motion.span variants={{hidden:{opacity:0,y:44,rotateX:35},show:{opacity:1,y:0,rotateX:0,transition:{duration:.8,ease:[0.16,1,0.3,1]}}}} style={{display:"block",transformOrigin:"bottom"}}>experiences.</motion.span>
          </motion.h1>
          <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.7,ease:"easeOut"}}>{profile.summary}</motion.p>
          <motion.div className="hero-actions" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.85,ease:"easeOut"}}><MagneticButton to="/projects">Explore Work <ArrowUpRight size={15}/></MagneticButton><MagneticButton to="/resume" secondary>View Resume <Download size={15}/></MagneticButton></motion.div>
          <motion.div className="hero-mini-stats" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:1,ease:"easeOut"}}>
            <div><Counter to={3.90}/><span>B.Sc CGPA</span></div><div><Counter to={3.78}/><span>M.Sc CGPA</span></div><div><Counter to={4} suffix="+"/><span>Roles & experiences</span></div>
          </motion.div>
        </div>
        <div className="hero-visual" data-reveal="right">
          <motion.div className="portrait-card" animate={{ y: [0, -14, 0], rotate: [2, -1, 2] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
            <div className="portrait-glow"/>
            <img src="/assets/profile.png" alt="Rokeya Shorna"/>
            <div className="portrait-meta"><span>ROKEYA SHORNA</span><small>AI • WEB • RESEARCH</small></div>
          </motion.div>
          <div className="visual-orb" data-parallax="-40"><ThreeOrb/></div>
          <motion.span className="orb-label" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>SCROLL / EXPLORE</motion.span>
        </div>
      </div>
      <div className="container hero-bottom"><motion.span animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>SCROLL TO EXPLORE ↓</motion.span><span>DHAKA • BANGLADESH</span></div>
    </section>
    <section className="statement section-pad"><div className="container statement-grid"><span className="eyebrow">01 / PROFILE</span><h2 data-reveal>I work at the intersection of <em>research, code and design.</em></h2></div></section>
    <section className="section-pad quick-profile"><div className="container quick-grid">
      <article data-reveal="left"><BriefcaseBusiness/><span>CURRENT ROLE</span><h3>Junior Programmer</h3><p>GIS-based development for the Rural Road Master Plan under RCIP, LGED funded by ADB.</p></article>
      <article data-reveal="up"><BookOpen/><span>RESEARCH FOCUS</span><h3>AI & Pattern Recognition</h3><p>Digital image processing, pattern recognition, artificial intelligence and machine learning.</p></article>
      <article data-reveal="right"><Award/><span>PUBLICATIONS</span><h3>IEEE + Research</h3><p>Published work includes Bangla sentiment analysis and combined regression methods for rainfall measurement.</p></article>
    </div></section>
    <section className="feature section-pad"><div className="container">
      <SectionTitle number="02" eyebrow="SELECTED WORK" title="Built with purpose." text="Academic, research and software projects grounded in practical problems and implementation."/>
      <div className="project-grid">{projects.slice(0,3).map((p,i)=><ProjectCard key={p.slug} project={p} index={i}/>)}</div>
      <div className="center-link"><Link to="/projects">View all projects <ArrowUpRight size={17}/></Link></div>
    </div></section>
    <section className="marquee"><div className="marquee-track"><span>ARTIFICIAL INTELLIGENCE • MACHINE LEARNING • DIGITAL IMAGE PROCESSING • WEB DEVELOPMENT • PATTERN RECOGNITION • </span><span aria-hidden="true">ARTIFICIAL INTELLIGENCE • MACHINE LEARNING • DIGITAL IMAGE PROCESSING • WEB DEVELOPMENT • PATTERN RECOGNITION • </span></div></section>
    <section className="section-pad dark-panel"><div className="container split">
      <div><span className="eyebrow">03 / RESEARCH</span><h2 data-reveal>Curious about how <em>technology understands.</em></h2></div>
      <div data-reveal><p className="large-muted">Research interests include digital image processing, pattern recognition, artificial intelligence and machine learning. The portfolio also highlights published work and academic milestones.</p><MagneticButton to="/research">Explore Research <ArrowUpRight size={15}/></MagneticButton></div>
    </div></section>
    <section className="section-pad timeline-preview"><div className="container"><SectionTitle number="04" eyebrow="JOURNEY" title="Experience that compounds." text="From teaching and technical support to web development and GIS-based programming."/><div className="journey-grid">{experiences.map((e,i)=><article key={e.role} data-reveal={i%2===0?"left":"right"}><span>0{i+1}</span><small>{e.period}</small><h3>{e.role}</h3><p>{e.organization}</p></article>)}</div></div></section>
    <section className="cta section-pad"><div className="container"><span className="eyebrow">05 / CONTACT</span><h2 data-reveal>Let's make the next<br/><em>idea meaningful.</em></h2><MagneticButton href={`mailto:${profile.email}`}>Start a conversation <ArrowUpRight size={15}/></MagneticButton></div></section>
  </div>;
}

function TagList({ items, className }) {
  return <div className={className}>
    {items.map((x, i) => (
      <motion.span
        key={x}
        initial={{ opacity: 0, y: 14, scale: 0.85 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.4, delay: i * 0.04, ease: "easeOut" }}
        whileHover={{ y: -3, scale: 1.05 }}
      >{x}</motion.span>
    ))}
  </div>;
}

function PageHero({kicker,title,sub}) {
  return <section className="page-hero">
    <motion.div className="page-hero-glow" animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.08, 1] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
    <div className="container">
      <motion.span className="eyebrow" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.5,ease:"easeOut"}}>{kicker}</motion.span>
      <motion.h1 initial={{opacity:0,y:36}} animate={{opacity:1,y:0}} transition={{duration:.7,delay:.1,ease:[0.16,1,0.3,1]}}>{title}</motion.h1>
      {sub && <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.28,ease:"easeOut"}}>{sub}</motion.p>}
    </div>
  </section>;
}

function About() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handlePhotoMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -10, y: px * 14 });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return <><PageHero kicker="01 / ABOUT" title={<>A researcher with a <em>builder's mindset.</em></>} sub="A Computer Science professional whose journey spans research, programming, web development, technical support and teaching."/>
  <section className="section-pad"><div className="container about-intro-grid">
    <motion.div
      className="about-photo-wrap"
      data-reveal="left"
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      onMouseMove={handlePhotoMove}
      onMouseLeave={resetTilt}
      style={{ perspective: 900 }}
    >
      <motion.div
        className="about-photo-ring"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="about-photo-tilt"
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <img src="/assets/profile.png" alt="Rokeya Shorna"/>
        <div><span>ROKEYA SHORNA</span><small>Computer Science & Engineering</small></div>
      </motion.div>
    </motion.div>
    <div><span className="eyebrow">PROFILE</span><h2 className="about-big" data-reveal>Building useful systems with <em>research-led thinking.</em></h2><p className="large-muted" data-reveal>{profile.summary}</p><TagList items={profile.interests} className="interest-list"/></div>
  </div></section>
  <section className="section-pad"><div className="container two-col">
    <div><SectionTitle number="01" eyebrow="EDUCATION" title="Foundations."/><div className="timeline">{education.map((e,i)=><motion.article key={i} data-reveal={i%2===0?"left":"right"} whileHover={{ x: i%2===0?6:-6 }} transition={{type:"spring",stiffness:300,damping:20}}><motion.span initial={{opacity:0,scale:.6}} whileInView={{opacity:1,scale:1}} viewport={{once:true,amount:.7}} transition={{type:"spring",stiffness:260,damping:16}} style={{display:"inline-block"}}>{e.period}</motion.span><h3>{e.degree}</h3><b>{e.institution}</b><p>Result: {e.result}. {e.detail}</p>{e.coursework && <TagList items={e.coursework} className="course-list"/>}</motion.article>)}</div></div>
    <motion.div className="about-card" data-reveal whileHover={{ y: -6 }} transition={{type:"spring",stiffness:260,damping:20}}><span className="eyebrow">COURSEWORK & INTERESTS</span><TagList items={coursework} className="course-list"/><div className="about-contact"><MapPin size={16}/>{profile.location}<br/><Mail size={16}/>{profile.email}<br/><span className="birth-line">Born {profile.birth}</span></div></motion.div>
  </div></section>
  <section className="section-pad light-section"><div className="container"><SectionTitle number="02" eyebrow="LEADERSHIP & COMMUNITY" title="Beyond the job title." text="Leadership, volunteering and community activities documented in the CV."/><div className="leadership-grid">{leadership.map((x,i)=><motion.article key={x[0]+x[1]} data-reveal={i%2===0?"left":"right"} whileHover={{ y: -8, scale: 1.015 }} transition={{type:"spring",stiffness:280,damping:22}}><motion.span initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.7}} transition={{duration:.4}}>0{String(i+1).padStart(2,'0')}</motion.span><small>{x[2]}</small><h3>{x[0]}</h3><b>{x[1]}</b><p>{x[3]}</p></motion.article>)}</div></div></section>
  <section className="section-pad"><div className="container"><SectionTitle number="03" eyebrow="WORKSHOPS & SEMINARS" title="Always learning."/><div className="workshop-grid">{workshops.map((w,i)=><motion.article key={w} data-reveal={i%2===0?"left":"right"} whileHover={{ y: -6, borderColor: "var(--accent)" }} transition={{type:"spring",stiffness:280,damping:22}}><motion.span initial={{opacity:0,rotate:-15,scale:.6}} whileInView={{opacity:1,rotate:0,scale:1}} viewport={{once:true,amount:.7}} transition={{type:"spring",stiffness:260,damping:16}} style={{display:"inline-block"}}>0{String(i+1).padStart(2,'0')}</motion.span><p>{w}</p></motion.article>)}</div></div></section>
  </>;
}

function Skills() {
  return <><PageHero kicker="02 / SKILLS" title={<>Tools for turning <em>questions into systems.</em></>} sub="A focused toolkit spanning programming, web technologies, databases, research and visual communication."/>
  <section className="section-pad"><div className="container skills-layout">{Object.entries(skills).map(([cat,items],i)=><motion.article className="skill-block" data-reveal={i%2===0?"left":"right"} key={cat} whileHover={{ y: -8, backgroundColor: "var(--surface)" }} transition={{type:"spring",stiffness:260,damping:22}}><motion.span className="skill-no" initial={{opacity:0,scale:.5}} whileInView={{opacity:1,scale:1}} viewport={{once:true,amount:.7}} transition={{type:"spring",stiffness:260,damping:16}} style={{display:"inline-block"}}>0{i+1}</motion.span><h3>{cat}</h3><TagList items={items} className="skill-tags"/></motion.article>)}</div></section>
  <section className="section-pad dark-panel"><div className="container split"><h2 data-reveal>Technical depth is useful.<br/><em>Curiosity is essential.</em></h2><p className="large-muted" data-reveal>I enjoy learning new tools when they help solve a real problem better, more clearly or more efficiently.</p></div></section></>;
}

function Projects() {
  const categories = [...new Set(projects.map(p => p.category))];
  return <><PageHero kicker="03 / PROJECTS" title={<>Selected work, <em>explained.</em></>} sub="Academic and software projects grounded in practical problems, research and user-focused implementation."/>
  <motion.div className="container projects-stats" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.6}} transition={{duration:.6,ease:"easeOut"}}>
    <div><Counter to={projects.length}/><span>Projects shipped</span></div>
    <div><Counter to={categories.length}/><span>Focus areas</span></div>
    <div><Counter to={projects.reduce((a,p)=>a+(p.stack?.length||0),0)}/><span>Technologies used</span></div>
  </motion.div>
  <section className="section-pad"><div className="container"><div className="project-grid projects-all">{projects.map((p,i)=><ProjectCard key={p.slug} project={p} index={i}/>)}</div></div></section></>;
}

function ProjectDetail() {
  const { slug } = useParams();
  const p = projects.find(x => x.slug === slug);
  if (!p) return <NotFound />;
  return <><PageHero kicker={`PROJECT / ${p.category}`} title={<>{p.title} <em>in detail.</em></>} sub={p.summary}/>
    <motion.section className="project-detail-hero" initial={{opacity:0,scale:1.04}} animate={{opacity:1,scale:1}} transition={{duration:.7,ease:[0.16,1,0.3,1]}}><div className="container"><img src={p.image} alt={p.title}/></div></motion.section>
    <section className="section-pad"><div className="container detail-grid">
      <motion.aside initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.4}} transition={{duration:.6,ease:"easeOut"}}><span className="eyebrow">TECHNOLOGY</span><TagList items={p.stack} className="detail-tags"/><span className="eyebrow detail-label">YEAR</span><p>{p.year}</p><span className="eyebrow detail-label">TEAM</span><p>{p.team}</p></motion.aside>
      <motion.article className="detail-copy" initial={{opacity:0,y:30}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{duration:.6,delay:.1,ease:"easeOut"}}><span className="eyebrow">01 / THE PROBLEM</span><h2>{p.problem}</h2><span className="eyebrow">02 / THE APPROACH</span><p>{p.solution}</p><span className="eyebrow">03 / OUTCOME</span><p>{p.outcome}</p><Link className="text-link" to="/projects">← Back to projects</Link></motion.article>
    </div></section>
  </>;
}function Experience() {
  return <><PageHero kicker="04 / EXPERIENCE" title={<>Work shaped by <em>responsibility.</em></>} sub="Professional experience across GIS-based development, web development, technical support and teaching."/>
  <section className="section-pad"><div className="container experience-list">{experiences.map((e,i)=><motion.article className="experience-item" data-reveal={i%2===0?"left":"right"} key={e.role} whileHover={{ x: i%2===0?8:-8 }} transition={{type:"spring",stiffness:260,damping:22}}><div className="exp-year">{e.period}</div><div><motion.span className="eyebrow" initial={{opacity:0,scale:.5}} whileInView={{opacity:1,scale:1}} viewport={{once:true,amount:.7}} transition={{type:"spring",stiffness:260,damping:16}} style={{display:"inline-block"}}>0{i+1}</motion.span><h2>{e.role}</h2><h4>{e.organization}</h4><p>{e.description}</p></div></motion.article>)}</div></section></>;
}

function Research() {
  return <><PageHero kicker="05 / RESEARCH" title={<>Questions become <em>evidence.</em></>} sub="Research interests and published work across machine learning, deep learning, Bangla NLP and data-driven methods."/>
  <section className="section-pad"><div className="container research-intro"><motion.div initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.4}} transition={{duration:.6,ease:"easeOut"}}><span className="eyebrow">RESEARCH INTERESTS</span><h2>Digital image processing.<br/>Pattern recognition.<br/><em>AI & machine learning.</em></h2></motion.div><motion.div animate={{ y: [0,-14,0] }} transition={{duration:6,repeat:Infinity,ease:"easeInOut"}}><ThreeOrb/></motion.div></div></section>
  <section className="section-pad light-section"><div className="container"><SectionTitle number="01" eyebrow="PUBLICATIONS" title="Published research."/><div className="publication-list">{publications.map((p,i)=><motion.article key={p.title} data-reveal={i%2===0?"left":"right"} whileHover={{ x: i%2===0?8:-8 }} transition={{type:"spring",stiffness:260,damping:22}}><motion.span initial={{opacity:0,scale:.5}} whileInView={{opacity:1,scale:1}} viewport={{once:true,amount:.7}} transition={{type:"spring",stiffness:260,damping:16}} style={{display:"inline-block"}}>0{i+1}</motion.span><div><h3>{p.title}</h3><p>{p.venue} • {p.year}</p><a href={p.doi} target="_blank" rel="noreferrer">View DOI ↗</a></div></motion.article>)}</div></div></section>
  <section className="section-pad"><div className="container"><SectionTitle number="02" eyebrow="AWARDS" title="Milestones."/><div className="award-grid">{awards.map((a,i)=><motion.div key={i} data-reveal={i%2===0?"left":"right"} whileHover={{ y: -6, scale: 1.02 }} transition={{type:"spring",stiffness:280,damping:22}}><motion.span initial={{opacity:0,rotate:-15,scale:.6}} whileInView={{opacity:1,rotate:0,scale:1}} viewport={{once:true,amount:.7}} transition={{type:"spring",stiffness:260,damping:16}} style={{display:"inline-block"}}>0{i+1}</motion.span><p>{a}</p></motion.div>)}</div></div></section>
  <section className="section-pad light-section"><div className="container research-extra-grid"><div data-reveal="left"><span className="eyebrow">HOBBIES & INTERESTS</span><h2 className="extra-title">Writing. Painting.<br/><em>Graphics & design.</em></h2><TagList items={hobbies} className="hobby-tags"/></div><div data-reveal="right"><span className="eyebrow">REFERENCES</span><div className="reference-list">{references.map((r,i)=><motion.article key={r[0]} whileHover={{ y: -6 }} transition={{type:"spring",stiffness:260,damping:20}}><h3>{r[0]}</h3><p>{r[1]}</p><a href={`mailto:${r[2]}`}>{r[2]} <ExternalLink size={13}/></a></motion.article>)}</div></div></div></section></>;
}

function Services() {
  const items = [
    ["01","Research & Data","Systematic literature review, quantitative and qualitative analysis, and research-oriented problem solving."],
    ["02","Web Development","Responsive websites and practical web applications using HTML, CSS, PHP, JavaScript and Bootstrap."],
    ["03","Machine Learning","Exploration of AI/ML methods with a focus on image processing, pattern recognition and intelligent systems."],
    ["04","Technical Support","Troubleshooting, maintenance and performance-focused technical assistance."]
  ];
  return <><PageHero kicker="06 / SERVICES" title={<>From idea to <em>working system.</em></>} sub="Areas where research thinking and implementation experience come together."/>
  <section className="section-pad"><div className="container service-list">{items.map(([n,t,d],i)=><motion.article key={n} data-reveal={i%2===0?"left":"right"} whileHover={{ x: i%2===0?8:-8, borderColor:"var(--accent)" }} transition={{type:"spring",stiffness:260,damping:22}}><motion.span initial={{opacity:0,scale:.5}} whileInView={{opacity:1,scale:1}} viewport={{once:true,amount:.7}} transition={{type:"spring",stiffness:260,damping:16}} style={{display:"inline-block"}}>{n}</motion.span><h2>{t}</h2><p>{d}</p><motion.span whileHover={{x:6,y:-6}} transition={{type:"spring",stiffness:300,damping:15}} style={{display:"inline-flex"}}><ArrowUpRight size={22}/></motion.span></motion.article>)}</div></section></>;
}

function Resume() {
  return <><PageHero kicker="07 / RESUME" title={<>A concise record of <em>the journey.</em></>} sub="A web version of the professional CV, with a print-friendly layout."/>
  <section className="resume-actions container"><motion.button className="magnetic-btn" onClick={()=>window.print()} whileHover={{scale:1.03}} whileTap={{scale:0.95}}><Download size={16}/> Print / Save PDF</motion.button><motion.a className="magnetic-btn secondary" href={`mailto:${profile.email}`} whileHover={{scale:1.03}} whileTap={{scale:0.95}}><Mail size={16}/> Contact</motion.a></section>
  <section className="resume-sheet container">
    <div className="resume-head"><div><h2>{profile.name}</h2><p>{profile.role}</p><span>{profile.email} • {profile.phone} • {profile.location}</span></div><div className="resume-mark">RS</div></div>
    <div className="resume-columns"><div>
      <ResumeSection title="Education">{education.map((e,i)=><div className="resume-entry" key={i}><b>{e.degree}</b><span>{e.period}</span><strong>{e.institution}</strong><p>CGPA / Result: {e.result}<br/>{e.detail}</p></div>)}</ResumeSection>
      <ResumeSection title="Experience">{experiences.map((e,i)=><div className="resume-entry" key={i}><b>{e.role}</b><span>{e.period}</span><strong>{e.organization}</strong><p>{e.description}</p></div>)}</ResumeSection>
      <ResumeSection title="Projects">{projects.map(p=><div className="resume-entry" key={p.slug}><b>{p.title}</b><span>{p.year} • {p.team}</span><p>{p.summary}</p></div>)}</ResumeSection>
    </div><div>
      <ResumeSection title="Technical Skills">{Object.entries(skills).map(([c,it])=><div className="skill-line" key={c}><b>{c}</b><p>{it.join(" • ")}</p></div>)}</ResumeSection>
      <ResumeSection title="Publications">{publications.map(p=><div className="resume-entry" key={p.title}><b>{p.title}</b><p>{p.venue}<br/>{p.doi}</p></div>)}</ResumeSection>
      <ResumeSection title="Awards & Achievements"><ul>{awards.map(a=><li key={a}>{a}</li>)}</ul></ResumeSection>
      <ResumeSection title="Leadership & Volunteer">{leadership.map(x=><div className="resume-entry" key={x[0]+x[1]}><b>{x[0]} — {x[1]}</b><span>{x[2]}</span><p>{x[3]}</p></div>)}</ResumeSection>
    </div></div>
  </section></>;
}

function ResumeSection({title,children}) { return <section className="resume-section"><h3>{title}</h3>{children}</section>; }

function Contact() {
  const [status,setStatus] = useState("");
  const [sending,setSending] = useState(false);
  async function submit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT;
    setSending(true);
    if (endpoint) {
      setStatus("Sending…");
      try {
        await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
        setStatus("Message sent successfully.");
        e.currentTarget.reset();
      } catch {
        setStatus("Something went wrong. Opening your email client instead…");
        openMailFallback(data);
      }
    } else {
      setStatus("Opening your email client with this message…");
      openMailFallback(data);
      e.currentTarget.reset();
    }
    setSending(false);
  }
  function openMailFallback(data) {
    const subject = encodeURIComponent(data.subject || "Portfolio contact");
    const body = encodeURIComponent(`${data.message || ""}\n\n— ${data.name || ""} (${data.email || ""})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  }
  return <><PageHero kicker="08 / CONTACT" title={<>Let's build something <em>meaningful.</em></>} sub="For research, development, collaboration or a thoughtful technology conversation, send a message."/>
  <section className="section-pad"><div className="container contact-grid"><div><span className="eyebrow">GET IN TOUCH</span><h2>Open to thoughtful<br/><em>conversations.</em></h2><motion.div className="contact-info" initial="hidden" whileInView="show" viewport={{once:true,amount:0.4}} variants={{hidden:{},show:{transition:{staggerChildren:0.08}}}}>
    <motion.a href={`mailto:${profile.email}`} variants={{hidden:{opacity:0,x:-20},show:{opacity:1,x:0}}} whileHover={{x:6}}><Mail/> {profile.email}</motion.a>
    <motion.a href={profile.linkedin} target="_blank" rel="noreferrer" variants={{hidden:{opacity:0,x:-20},show:{opacity:1,x:0}}} whileHover={{x:6}}><Linkedin/> LinkedIn</motion.a>
    <motion.a href={profile.github} target="_blank" rel="noreferrer" variants={{hidden:{opacity:0,x:-20},show:{opacity:1,x:0}}} whileHover={{x:6}}><Github/> GitHub</motion.a>
    <motion.span variants={{hidden:{opacity:0,x:-20},show:{opacity:1,x:0}}}><MapPin/> {profile.location}</motion.span>
  </motion.div></div>
  <motion.form className="contact-form" onSubmit={submit} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true, amount:0.3}} transition={{duration:.5,ease:"easeOut"}}><label>Name<input name="name" required placeholder="Your name"/></label><label>Email<input type="email" name="email" required placeholder="you@example.com"/></label><label>Subject<input name="subject" required placeholder="What would you like to discuss?"/></label><label>Message<textarea name="message" required rows="7" placeholder="Tell me a little about your idea..."/></label><motion.button className="magnetic-btn" type="submit" disabled={sending} whileHover={{scale:1.03}} whileTap={{scale:0.95}}>{sending ? "Sending…" : "Send message"} <ArrowUpRight size={16}/></motion.button><AnimatePresence>{status && <motion.p className="form-status" initial={{opacity:0,y:-6}} animate={{opacity:1,y:0}} exit={{opacity:0}}>{status}</motion.p>}</AnimatePresence></motion.form></div></section></>;
}

function NotFound() {
  return <section className="page-hero not-found"><div className="container">
    <motion.span className="eyebrow" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.5}}>404 / NOT FOUND</motion.span>
    <motion.h1 initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:.6,delay:.1,ease:[0.16,1,0.3,1]}}>This page <em>doesn't exist.</em></motion.h1>
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.5,delay:.3}}><MagneticButton to="/">Back home</MagneticButton></motion.div>
  </div></section>;
}

export default function App() {
  const [theme,setTheme] = useState(localStorage.getItem("theme") || "dark");
  useEffect(()=>{ document.documentElement.dataset.theme = theme; localStorage.setItem("theme",theme); },[theme]);
  return <Layout theme={theme} setTheme={setTheme}/>;
}
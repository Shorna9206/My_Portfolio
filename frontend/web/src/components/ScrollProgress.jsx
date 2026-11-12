import { useEffect, useState } from "react";
export default function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => setP(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight));
    window.addEventListener("scroll", fn, {passive:true}); fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div className="scroll-progress"><span style={{transform:`scaleX(${p})`}}/></div>;
}
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { Activity, BookOpen, BriefcaseBusiness, Check, ChevronRight, CircleUserRound, ExternalLink, FileText, GraduationCap, LayoutDashboard, LogOut, RefreshCw, Save, ShieldCheck, Sparkles, Users, Wrench, Upload, Copy } from "lucide-react";
import * as defaults from "../../src/data/portfolio.js";
import { auth, db, configured } from "./firebase";

const SECTIONS = [
  { key: "profile", label: "Profile & Contact", icon: CircleUserRound, type: "object", description: "Name, title, contact details, social links and introduction." },
  { key: "education", label: "Education", icon: GraduationCap, type: "array", description: "Degrees, institutions, periods and academic results." },
  { key: "experiences", label: "Experience", icon: BriefcaseBusiness, type: "array", description: "Roles, organizations, dates and descriptions." },
  { key: "projects", label: "Projects", icon: Wrench, type: "array", description: "Portfolio projects, case studies, images and technology stacks." },
  { key: "skills", label: "Skills", icon: Sparkles, type: "object", description: "Skill groups and their values." },
  { key: "publications", label: "Publications", icon: BookOpen, type: "array", description: "Research publications, venues, years and DOI links." },
  { key: "awards", label: "Awards", icon: ShieldCheck, type: "array", description: "Awards, certificates and achievements." },
  { key: "workshops", label: "Workshops", icon: Activity, type: "array", description: "Training, workshops and seminars." },
  { key: "leadership", label: "Leadership & Volunteering", icon: Users, type: "array", description: "Community roles, initiatives and contributions." },
  { key: "references", label: "References", icon: FileText, type: "array", description: "Professional references and contact details." },
  { key: "coursework", label: "Coursework", icon: BookOpen, type: "array", description: "Relevant academic coursework." },
  { key: "hobbies", label: "Interests", icon: Sparkles, type: "array", description: "Personal interests and hobbies." },
];
const fallback = Object.fromEntries(SECTIONS.map(s => [s.key, defaults[s.key]]));
const pretty = (value) => JSON.stringify(value, null, 2);

export default function AdminApp() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [active, setActive] = useState("profile");
  const [content, setContent] = useState(fallback);
  const [draft, setDraft] = useState(pretty(fallback.profile));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [lastSaved, setLastSaved] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const selected = SECTIONS.find(s => s.key === active) || SECTIONS[0];

  useEffect(() => {
    if (!configured) { setAuthReady(true); return; }
    return onAuthStateChanged(auth, async current => {
      setUser(current); setAuthorized(false); setAuthReady(true);
      if (!current) return;
      try {
        const token = await current.getIdTokenResult(true);
        if (token.claims.admin !== true) { setError("This account is not authorized as an administrator. Ask the project owner to grant the admin custom claim."); await signOut(auth); return; }
        setAuthorized(true); setError("");
      } catch (e) { setError(e.message || "Could not verify admin permissions."); await signOut(auth); }
    });
  }, []);

  useEffect(() => {
    if (!authorized || !db) return;
    return onSnapshot(doc(db, "portfolioContent", "main"), snap => {
      if (snap.exists()) {
        const remote = snap.data();
        const next = { ...fallback, ...remote };
        setContent(next); setDraft(pretty(next[active])); setLastSaved(remote.updatedAt?.toDate?.() || null);
      } else {
        setContent(fallback); setDraft(pretty(fallback[active]));
      }
    }, e => setError(`Could not load content: ${e.message}`));
  }, [authorized, active]);

  const stats = useMemo(() => [
    ["Projects", (content.projects || []).length], ["Experiences", (content.experiences || []).length],
    ["Publications", (content.publications || []).length], ["Content sections", SECTIONS.length]
  ], [content]);

  function selectSection(key) { setActive(key); setDraft(pretty(content[key] ?? fallback[key])); setMessage(""); setError(""); }
  async function login(e) {
    e.preventDefault(); setBusy(true); setError("");
    try { await signInWithEmailAndPassword(auth, email.trim(), password); setPassword(""); }
    catch (e) { setError(e.code === "auth/invalid-credential" ? "Email or password is incorrect." : e.message); }
    finally { setBusy(false); }
  }
  async function saveSection() {
    setError(""); setMessage("");
    let parsed;
    try { parsed = JSON.parse(draft); } catch { setError("JSON format is invalid. Fix the syntax before saving."); return; }
    if (selected.type === "array" && !Array.isArray(parsed)) { setError(`${selected.label} must be a JSON array [].`); return; }
    if (selected.type === "object" && (!parsed || Array.isArray(parsed) || typeof parsed !== "object")) { setError(`${selected.label} must be a JSON object {}.`); return; }
    setBusy(true);
    try {
      const next = { ...content, [active]: parsed };
      await setDoc(doc(db, "portfolioContent", "main"), { ...next, updatedAt: serverTimestamp(), updatedBy: user.email }, { merge: true });
      setContent(next); setDraft(pretty(parsed)); setMessage(`${selected.label} saved. The public portfolio will update automatically.`);
    } catch (e) { setError(`Save failed: ${e.message}`); }
    finally { setBusy(false); }
  }
  async function uploadImage(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploadError(""); setUploadedUrl(""); setError(""); setMessage("");
    if (!file.type.startsWith("image/")) { setUploadError("Choose an image file (PNG, JPG, WEBP, etc.)."); return; }
    if (file.size > 10 * 1024 * 1024) { setUploadError("Image must be 10 MB or smaller."); return; }
    setUploading(true);
    try {
      const idToken = await user.getIdToken();
      const signedResponse = await fetch("/api/cloudinary-signature", {
        method: "POST", headers: { Authorization: `Bearer ${idToken}` }
      });
      const signed = await signedResponse.json();
      if (!signedResponse.ok) throw new Error(signed.error || "Could not authorize image upload.");
      const body = new FormData();
      body.append("file", file);
      body.append("api_key", signed.apiKey);
      body.append("timestamp", String(signed.timestamp));
      body.append("folder", signed.folder);
      body.append("signature", signed.signature);
      const response = await fetch(`https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`, { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "Cloudinary upload failed.");
      setUploadedUrl(result.secure_url || "");
      setMessage("Image uploaded. Copy its secure URL into the image field in the JSON editor, then save changes.");
    } catch (e) {
      setUploadError(e.message || "Image upload failed.");
    } finally { setUploading(false); }
  }

  async function copyUploadedUrl() {
    try { await navigator.clipboard.writeText(uploadedUrl); setMessage("Image URL copied. Paste it into the relevant image field."); }
    catch { setUploadError("Clipboard access was blocked. Select and copy the URL manually."); }
  }

  async function seedAll() {
    const ok = window.confirm("Publish the portfolio's bundled default content to Firestore? This overwrites all editable sections with the current source values.");
    if (!ok) return;
    setBusy(true); setError("");
    try { await setDoc(doc(db, "portfolioContent", "main"), { ...fallback, updatedAt: serverTimestamp(), updatedBy: user.email }); setMessage("Default portfolio content published to Firestore."); }
    catch (e) { setError(`Publish failed: ${e.message}`); }
    finally { setBusy(false); }
  }

  if (!configured) return <div className="setup-screen"><div className="setup-card"><div className="brand-mark">RS</div><p className="eyebrow">ADMIN SETUP REQUIRED</p><h1>Connect Firebase first.</h1><p>Add the Firebase web app values to <code>admin-panel/.env</code> and the public site's root <code>.env</code>. See <code>ADMIN-SETUP.md</code>.</p></div></div>;
  if (!authReady) return <div className="loading-screen"><div className="spinner"/> Verifying session…</div>;
  if (!user || !authorized) return <div className="login-screen"><div className="login-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="login-copy"><span className="eyebrow">ROKEYA SHORNA / DIGITAL SPACE</span><h1>Make your work<br/><em>tell its story.</em></h1><p>A private workspace to keep your portfolio accurate, current and entirely yours.</p><div className="login-foot"><ShieldCheck size={15}/> Protected by Firebase Authentication + admin claims</div></div></div><form className="login-card" onSubmit={login}><div className="brand-mark">RS</div><span className="eyebrow">CONTENT STUDIO</span><h2>Welcome back.</h2><p className="muted">Sign in with your authorized administrator account.</p><label>Email address<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/></label>{error && <div className="notice error">{error}</div>}<button className="primary-btn full" disabled={busy}>{busy ? "Signing in…" : "Sign in securely"}<ChevronRight size={17}/></button><p className="login-note">Access is restricted to accounts with the Firebase <code>admin: true</code> custom claim.</p></form></div>;

  return <div className="admin-shell"><aside className="sidebar"><a className="brand" href="#top"><span className="brand-mark">RS</span><span><b>SHORNA</b><small>PORTFOLIO STUDIO</small></span></a><div className="side-label">WORKSPACE</div><button className={`nav-item ${active === "dashboard" ? "active" : ""}`} onClick={()=>selectSection("profile")}><LayoutDashboard size={17}/> Overview</button><div className="side-label">CONTENT MANAGEMENT</div>{SECTIONS.map(item=>{const Icon=item.icon;return <button key={item.key} className={`nav-item ${active===item.key?"active":""}`} onClick={()=>selectSection(item.key)}><Icon size={17}/><span>{item.label}</span>{active===item.key&&<span className="nav-dot"/>}</button>})}<div className="sidebar-bottom"><div className="user-chip"><span className="avatar">{(user.email||"A")[0].toUpperCase()}</span><span><b>{user.email}</b><small>Administrator</small></span></div><button className="nav-item logout" onClick={()=>signOut(auth)}><LogOut size={17}/> Sign out</button></div></aside>
    <main className="main-area" id="top"><header className="topbar"><div><span className="eyebrow">CONTENT MANAGEMENT / LIVE</span><h1>{selected.label}</h1></div><div className="top-actions"><a className="ghost-btn" href={import.meta.env.VITE_PUBLIC_SITE_URL || "https://example.com"} target="_blank" rel="noreferrer"><ExternalLink size={15}/> View website</a><span className="status-pill"><i/> Connected</span></div></header>
    <section className="welcome-row"><div><p className="welcome-kicker">YOUR PORTFOLIO, YOUR STORY</p><h2>Good to see you again.</h2><p className="muted">Edit content here. Published changes sync to the public website through Firestore.</p></div><div className="welcome-icon"><Sparkles size={23}/></div></section>
    <section className="stats-grid">{stats.map(([label,value],i)=><div className="stat-card" key={label}><span>{label}</span><strong>{value}</strong><small>{i===3?"Editable areas":"Currently published"}</small></div>)}</section>
    <section className="editor-card"><div className="editor-heading"><div><span className="eyebrow">CONTENT EDITOR</span><h2>{selected.label}</h2><p>{selected.description}</p></div><div className="editor-badge"><FileText size={15}/> JSON editor</div></div><div className="editor-tools"><span><i className="live-dot"/> Editing <b>{selected.key}</b></span><button className="ghost-btn" onClick={()=>setDraft(pretty(content[active] ?? fallback[active]))}><RefreshCw size={14}/> Reset draft</button></div>
    <div className="upload-panel"><div><strong><Upload size={15}/> Cloudinary image upload</strong><p>Upload a portfolio image securely (max 10 MB). Then copy the secure URL into the image field in this section's JSON.</p></div><label className="ghost-btn upload-label"><Upload size={14}/>{uploading ? "Uploading…" : "Choose image"}<input type="file" accept="image/*" onChange={uploadImage} disabled={uploading} hidden/></label></div>
    {uploadedUrl && <div className="uploaded-url"><input aria-label="Uploaded image URL" readOnly value={uploadedUrl}/><button className="ghost-btn" onClick={copyUploadedUrl}><Copy size={14}/> Copy URL</button></div>}
    {uploadError && <div className="notice error">{uploadError}</div>}
    <textarea className="code-editor" spellCheck="false" value={draft} onChange={e=>setDraft(e.target.value)} aria-label={`${selected.label} JSON editor`}/><div className="editor-footer"><span className="muted">Use valid JSON. Keep the existing field names to preserve the public layout.</span><button className="primary-btn" disabled={busy} onClick={saveSection}><Save size={16}/>{busy?"Saving…":"Save changes"}</button></div>{error && <div className="notice error">{error}</div>}{message && <div className="notice success"><Check size={16}/>{message}</div>}</section>
    <section className="bottom-grid"><div className="info-card"><div className="info-icon"><ShieldCheck size={18}/></div><div><h3>Secure by design</h3><p>Admin access requires a Firebase custom claim. Firestore rules must also enforce that claim before accepting writes.</p></div></div><div className="info-card"><div className="info-icon"><RefreshCw size={18}/></div><div><h3>Live publishing</h3><p>The public site listens to <code>portfolioContent/main</code> and updates when saved changes arrive.</p></div></div></section>
    <div className="danger-zone"><div><h3>Initial publishing</h3><p>Use this once to create the main Firestore document from the portfolio's existing local content.</p></div><button className="ghost-btn" disabled={busy} onClick={seedAll}>Publish default content</button></div>
    <footer className="admin-footer">© {new Date().getFullYear()} Rokeya Shorna · Private content studio <span>SECURE WORKSPACE</span></footer></main></div>;
}

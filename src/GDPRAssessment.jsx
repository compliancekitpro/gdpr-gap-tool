import { useState, useEffect } from "react";

const CATEGORIES = [
  {
    id: "lawful_basis",
    title: "Lawful Basis & Transparency",
    icon: "⚖️",
    weight: 20,
    questions: [
      { id: "lb1", text: "We have identified a lawful basis for every type of data processing we carry out", risk: "high" },
      { id: "lb2", text: "We have a publicly available Privacy Policy written in plain language", risk: "high" },
      { id: "lb3", text: "We provide privacy information to individuals at the time of data collection", risk: "high" },
      { id: "lb4", text: "Where we rely on consent, it is freely given, specific, informed, and unambiguous", risk: "high" },
      { id: "lb5", text: "We do not use pre-ticked consent boxes or consent bundled with T&Cs", risk: "medium" },
      { id: "lb6", text: "We have a process to record and manage consent preferences", risk: "medium" },
    ],
  },
  {
    id: "data_minimisation",
    title: "Data Minimisation & Retention",
    icon: "🗄️",
    weight: 15,
    questions: [
      { id: "dm1", text: "We only collect personal data that is necessary for our stated purpose", risk: "high" },
      { id: "dm2", text: "We have a documented data retention schedule", risk: "medium" },
      { id: "dm3", text: "We regularly review and delete data that is no longer needed", risk: "medium" },
      { id: "dm4", text: "We have processes to ensure personal data is kept accurate and up to date", risk: "low" },
      { id: "dm5", text: "We can securely delete or anonymise data on request", risk: "medium" },
    ],
  },
  {
    id: "individual_rights",
    title: "Individual Rights",
    icon: "🧑‍⚖️",
    weight: 20,
    questions: [
      { id: "ir1", text: "We have a documented process for handling Subject Access Requests (SARs)", risk: "high" },
      { id: "ir2", text: "We can respond to SARs within 30 calendar days", risk: "high" },
      { id: "ir3", text: "We have a process for handling erasure (right to be forgotten) requests", risk: "high" },
      { id: "ir4", text: "We can provide data in a portable, machine-readable format when requested", risk: "medium" },
      { id: "ir5", text: "We have a process for individuals to object to direct marketing", risk: "medium" },
      { id: "ir6", text: "We log and track all rights requests and our responses", risk: "medium" },
    ],
  },
  {
    id: "security",
    title: "Security Measures",
    icon: "🔐",
    weight: 25,
    questions: [
      { id: "sec1", text: "We use encryption for personal data in transit (HTTPS/TLS)", risk: "high" },
      { id: "sec2", text: "We use encryption for personal data at rest", risk: "high" },
      { id: "sec3", text: "We have access controls — only authorised staff can access personal data", risk: "high" },
      { id: "sec4", text: "We use strong password policies and multi-factor authentication (MFA)", risk: "high" },
      { id: "sec5", text: "We have a documented data breach response procedure", risk: "high" },
      { id: "sec6", text: "We can detect and report data breaches to authorities within 72 hours", risk: "high" },
      { id: "sec7", text: "We conduct regular security testing and vulnerability assessments", risk: "medium" },
      { id: "sec8", text: "We have a process to securely delete data when no longer needed", risk: "medium" },
    ],
  },
  {
    id: "third_parties",
    title: "Third Parties & Transfers",
    icon: "🤝",
    weight: 10,
    questions: [
      { id: "tp1", text: "We have a Data Processing Agreement (DPA) with all third-party processors", risk: "high" },
      { id: "tp2", text: "We have assessed the security practices of all third-party processors", risk: "medium" },
      { id: "tp3", text: "Any international data transfers have appropriate safeguards (SCCs, adequacy)", risk: "high" },
      { id: "tp4", text: "We maintain an up-to-date list of all vendors and sub-processors", risk: "medium" },
    ],
  },
  {
    id: "governance",
    title: "Governance & Accountability",
    icon: "📋",
    weight: 10,
    questions: [
      { id: "gov1", text: "We maintain a Record of Processing Activities (ROPA) under GDPR Art. 30", risk: "high" },
      { id: "gov2", text: "We conduct DPIAs for high-risk processing activities", risk: "medium" },
      { id: "gov3", text: "We provide GDPR training to all staff who handle personal data", risk: "medium" },
      { id: "gov4", text: "We review and update our data protection practices at least annually", risk: "low" },
      { id: "gov5", text: "Senior management are aware of and support GDPR compliance efforts", risk: "low" },
    ],
  },
  {
    id: "website",
    title: "Website & Marketing",
    icon: "🌐",
    weight: 10,
    questions: [
      { id: "web1", text: "Our website has a compliant Cookie Policy and consent banner", risk: "high" },
      { id: "web2", text: "Non-essential cookies are not set before user consent is obtained", risk: "high" },
      { id: "web3", text: "Our email marketing includes a clear and easy unsubscribe mechanism", risk: "medium" },
      { id: "web4", text: "We maintain a suppression list of opted-out contacts", risk: "medium" },
      { id: "web5", text: "All marketing communications clearly identify who they are from", risk: "low" },
    ],
  },
];

const STATUS = {
  yes: { label: "Yes", color: "#10B981", bg: "#D1FAE5", score: 1 },
  partial: { label: "Partial", color: "#F59E0B", bg: "#FEF3C7", score: 0.5 },
  no: { label: "No", color: "#EF4444", bg: "#FEE2E2", score: 0 },
  na: { label: "N/A", color: "#6B7280", bg: "#F3F4F6", score: 1 },
};

const RISK_COLOR = { high: "#EF4444", medium: "#F59E0B", low: "#10B981" };
const RISK_BG = { high: "#FEE2E2", medium: "#FEF3C7", low: "#D1FAE5" };

function getRiskLevel(score) {
  if (score >= 80) return { label: "Low Risk", color: "#10B981", bg: "#D1FAE5", desc: "Your GDPR posture is strong. Focus on maintaining and documenting your practices." };
  if (score >= 60) return { label: "Moderate Risk", color: "#F59E0B", bg: "#FEF3C7", desc: "Some gaps exist that should be addressed. Prioritise high-risk items first." };
  if (score >= 40) return { label: "Elevated Risk", color: "#EF4444", bg: "#FEE2E2", desc: "Significant compliance gaps detected. Immediate action recommended on critical items." };
  return { label: "Critical Risk", color: "#DC2626", bg: "#FEF2F2", desc: "Major GDPR gaps that could result in regulatory action. Urgent remediation required." };
}

function RadialScore({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const risk = getRiskLevel(score);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <defs>
          <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={risk.color} />
            <stop offset="100%" stopColor={risk.color + "99"} />
          </linearGradient>
        </defs>
        <circle cx="70" cy="70" r={r} fill="none" stroke="#E5E7EB" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="10"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
        <text x="70" y="65" textAnchor="middle" fontSize="28" fontWeight="800" fill={risk.color} fontFamily="Georgia, serif">{score}</text>
        <text x="70" y="83" textAnchor="middle" fontSize="11" fill="#6B7280" fontFamily="Georgia, serif">/ 100</text>
      </svg>
      <div style={{
        background: risk.bg, color: risk.color,
        fontWeight: 700, fontSize: 13, padding: "4px 14px",
        borderRadius: 20, border: `1px solid ${risk.color}40`
      }}>{risk.label}</div>
    </div>
  );
}

function CategoryBar({ cat, answers }) {
  const qs = cat.questions;
  const answered = qs.filter(q => answers[q.id]);
  const score = qs.length === 0 ? 0 :
    Math.round((qs.reduce((sum, q) => sum + (STATUS[answers[q.id]]?.score ?? 0), 0) / qs.length) * 100);
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span style={{ fontSize: 12, color: "#374151", fontWeight: 600 }}>{cat.icon} {cat.title}</span>
        <span style={{ fontSize: 12, color, fontWeight: 700 }}>{score}%</span>
      </div>
      <div style={{ background: "#E5E7EB", borderRadius: 4, height: 6, overflow: "hidden" }}>
        <div style={{
          width: `${score}%`, height: "100%", background: color,
          borderRadius: 4, transition: "width 0.8s ease"
        }} />
      </div>
      <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>
        {answered.length}/{qs.length} answered
      </div>
    </div>
  );
}

export default function GDPRAssessment() {
  const [answers, setAnswers] = useState({});
  const [activeCategory, setActiveCategory] = useState(0);
  const [view, setView] = useState("assess"); // assess | results
  const [companyName, setCompanyName] = useState("");
  const [animIn, setAnimIn] = useState(true);

  const allQuestions = CATEGORIES.flatMap(c => c.questions);
  const answeredCount = Object.keys(answers).length;
  const totalCount = allQuestions.length;
  const progress = Math.round((answeredCount / totalCount) * 100);

  const overallScore = totalCount === 0 ? 0 : Math.round(
    (allQuestions.reduce((sum, q) => sum + (STATUS[answers[q.id]]?.score ?? 0), 0) / totalCount) * 100
  );

  const gaps = allQuestions
    .filter(q => answers[q.id] === "no" || answers[q.id] === "partial")
    .sort((a, b) => {
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.risk] - order[b.risk];
    });

  const risk = getRiskLevel(overallScore);

  function setAnswer(qId, val) {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  }

  function switchCategory(idx) {
    setAnimIn(false);
    setTimeout(() => { setActiveCategory(idx); setAnimIn(true); }, 150);
  }

  const cat = CATEGORIES[activeCategory];
  const catAnswered = cat.questions.filter(q => answers[q.id]).length;
  const catComplete = catAnswered === cat.questions.length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
      fontFamily: "'Georgia', 'Times New Roman', serif",
      color: "#F8FAFC",
      padding: "0 0 60px 0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #1E3A5F 0%, #1B2A4A 100%)",
        borderBottom: "2px solid #2E6BE6",
        padding: "20px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
      }}>
        <div>
          <div style={{ fontSize: 11, color: "#60A5FA", letterSpacing: 3, textTransform: "uppercase", marginBottom: 2, fontFamily: "Helvetica, sans-serif" }}>
            GDPR Compliance Kit
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#F1F5F9" }}>
            Gap Assessment Tool
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#94A3B8", fontFamily: "Helvetica, sans-serif" }}>Progress</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#60A5FA" }}>{progress}%</div>
          </div>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid #2E6BE6", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <svg width="48" height="48" viewBox="0 0 48 48" style={{ position: "absolute", top: -3, left: -3 }}>
              <circle cx="27" cy="27" r="21" fill="none" stroke="#1E293B" strokeWidth="3" />
              <circle cx="27" cy="27" r="21" fill="none" stroke="#2E6BE6"
                strokeWidth="3"
                strokeDasharray={`${(progress / 100) * 132} 132`}
                strokeLinecap="round"
                transform="rotate(-90 27 27)"
                style={{ transition: "stroke-dasharray 0.5s ease" }}
              />
            </svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#60A5FA", zIndex: 1 }}>{answeredCount}</span>
          </div>
          {view === "assess" ? (
            <button onClick={() => setView("results")} style={{
              background: "linear-gradient(135deg, #2E6BE6, #1D4ED8)",
              color: "white", border: "none", borderRadius: 8,
              padding: "10px 20px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "Helvetica, sans-serif",
              boxShadow: "0 4px 12px rgba(46,107,230,0.4)",
              transition: "transform 0.1s",
            }}>View Results →</button>
          ) : (
            <button onClick={() => setView("assess")} style={{
              background: "transparent", color: "#60A5FA",
              border: "1px solid #2E6BE6", borderRadius: 8,
              padding: "10px 20px", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "Helvetica, sans-serif",
            }}>← Back to Assessment</button>
          )}
        </div>
      </div>

      {view === "assess" ? (
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "260px 1fr", gap: 24 }}>
          {/* Sidebar */}
          <div>
            {/* Score card */}
            <div style={{
              background: "rgba(30,58,95,0.6)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(46,107,230,0.3)", borderRadius: 16,
              padding: "24px 16px", marginBottom: 16, textAlign: "center"
            }}>
              <div style={{ fontSize: 11, color: "#94A3B8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontFamily: "Helvetica, sans-serif" }}>Live Score</div>
              <RadialScore score={answeredCount > 0 ? overallScore : 0} />
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 12, fontFamily: "Helvetica, sans-serif" }}>{risk.desc}</div>
            </div>

            {/* Category nav */}
            <div style={{
              background: "rgba(30,58,95,0.6)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(46,107,230,0.2)", borderRadius: 16,
              padding: 16, marginBottom: 16
            }}>
              <div style={{ fontSize: 11, color: "#94A3B8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontFamily: "Helvetica, sans-serif" }}>Categories</div>
              {CATEGORIES.map((c, i) => {
                const done = c.questions.filter(q => answers[q.id]).length;
                const isActive = i === activeCategory;
                return (
                  <button key={c.id} onClick={() => switchCategory(i)} style={{
                    width: "100%", textAlign: "left", background: isActive ? "rgba(46,107,230,0.2)" : "transparent",
                    border: isActive ? "1px solid rgba(46,107,230,0.5)" : "1px solid transparent",
                    borderRadius: 8, padding: "8px 10px", marginBottom: 4,
                    cursor: "pointer", color: isActive ? "#93C5FD" : "#CBD5E1",
                    fontSize: 12, fontFamily: "Helvetica, sans-serif", fontWeight: isActive ? 700 : 400,
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    transition: "all 0.2s"
                  }}>
                    <span>{c.icon} {c.title}</span>
                    <span style={{
                      fontSize: 10, background: done === c.questions.length ? "#10B981" : done > 0 ? "#F59E0B" : "#374151",
                      color: "white", borderRadius: 10, padding: "1px 7px", minWidth: 28, textAlign: "center"
                    }}>{done}/{c.questions.length}</span>
                  </button>
                );
              })}
            </div>

            {/* Category scores */}
            <div style={{
              background: "rgba(30,58,95,0.6)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(46,107,230,0.2)", borderRadius: 16,
              padding: 16
            }}>
              <div style={{ fontSize: 11, color: "#94A3B8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12, fontFamily: "Helvetica, sans-serif" }}>Breakdown</div>
              {CATEGORIES.map(c => <CategoryBar key={c.id} cat={c} answers={answers} />)}
            </div>
          </div>

          {/* Main questions panel */}
          <div style={{
            background: "rgba(30,58,95,0.4)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(46,107,230,0.2)", borderRadius: 16,
            padding: "28px 32px",
            opacity: animIn ? 1 : 0,
            transform: animIn ? "translateY(0)" : "translateY(8px)",
            transition: "opacity 0.15s, transform 0.15s"
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#F1F5F9" }}>
                  {cat.icon} {cat.title}
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4, fontFamily: "Helvetica, sans-serif" }}>
                  {catAnswered} of {cat.questions.length} questions answered
                  {catComplete && <span style={{ color: "#10B981", marginLeft: 8 }}>✓ Complete</span>}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "#60A5FA", background: "rgba(46,107,230,0.15)", padding: "4px 12px", borderRadius: 20, fontFamily: "Helvetica, sans-serif" }}>
                Weight: {cat.weight}%
              </div>
            </div>

            {cat.questions.map((q, qi) => {
              const current = answers[q.id];
              return (
                <div key={q.id} style={{
                  background: current ? "rgba(15,23,42,0.6)" : "rgba(15,23,42,0.3)",
                  border: `1px solid ${current ? "rgba(46,107,230,0.4)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 12, padding: "16px 20px", marginBottom: 12,
                  transition: "all 0.2s"
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      minWidth: 24, height: 24, borderRadius: "50%",
                      background: current ? "rgba(46,107,230,0.3)" : "rgba(100,116,139,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: current ? "#93C5FD" : "#64748B",
                      fontFamily: "Helvetica, sans-serif", flexShrink: 0, marginTop: 1
                    }}>{qi + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: "#E2E8F0", lineHeight: 1.5, marginBottom: 6 }}>{q.text}</div>
                      <span style={{
                        fontSize: 10, background: RISK_BG[q.risk], color: RISK_COLOR[q.risk],
                        padding: "2px 8px", borderRadius: 10, fontFamily: "Helvetica, sans-serif", fontWeight: 700
                      }}>{q.risk.toUpperCase()} RISK</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, paddingLeft: 36 }}>
                    {Object.entries(STATUS).map(([key, s]) => (
                      <button key={key} onClick={() => setAnswer(q.id, key)} style={{
                        padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700,
                        fontFamily: "Helvetica, sans-serif", cursor: "pointer",
                        background: current === key ? s.bg : "rgba(30,41,59,0.8)",
                        color: current === key ? s.color : "#94A3B8",
                        border: current === key ? `1.5px solid ${s.color}` : "1px solid rgba(100,116,139,0.3)",
                        transition: "all 0.15s",
                        transform: current === key ? "scale(1.05)" : "scale(1)"
                      }}>{s.label}</button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
              <button onClick={() => switchCategory(Math.max(0, activeCategory - 1))}
                disabled={activeCategory === 0}
                style={{
                  background: "transparent", color: activeCategory === 0 ? "#374151" : "#60A5FA",
                  border: `1px solid ${activeCategory === 0 ? "#374151" : "#2E6BE6"}`,
                  borderRadius: 8, padding: "10px 20px", fontSize: 13,
                  cursor: activeCategory === 0 ? "not-allowed" : "pointer",
                  fontFamily: "Helvetica, sans-serif", fontWeight: 600
                }}>← Previous</button>
              {activeCategory < CATEGORIES.length - 1 ? (
                <button onClick={() => switchCategory(activeCategory + 1)} style={{
                  background: "linear-gradient(135deg, #2E6BE6, #1D4ED8)",
                  color: "white", border: "none", borderRadius: 8,
                  padding: "10px 20px", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "Helvetica, sans-serif",
                  boxShadow: "0 4px 12px rgba(46,107,230,0.4)"
                }}>Next Section →</button>
              ) : (
                <button onClick={() => setView("results")} style={{
                  background: "linear-gradient(135deg, #10B981, #059669)",
                  color: "white", border: "none", borderRadius: 8,
                  padding: "10px 20px", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", fontFamily: "Helvetica, sans-serif",
                  boxShadow: "0 4px 12px rgba(16,185,129,0.4)"
                }}>View My Results →</button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* RESULTS VIEW */
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
          {/* Company name input */}
          <div style={{
            background: "rgba(30,58,95,0.5)", border: "1px solid rgba(46,107,230,0.3)",
            borderRadius: 16, padding: "20px 28px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 16
          }}>
            <span style={{ fontSize: 14, color: "#94A3B8", fontFamily: "Helvetica, sans-serif", whiteSpace: "nowrap" }}>Company Name:</span>
            <input value={companyName} onChange={e => setCompanyName(e.target.value)}
              placeholder="Enter your company name for the report..."
              style={{
                flex: 1, background: "rgba(15,23,42,0.6)", border: "1px solid rgba(46,107,230,0.3)",
                borderRadius: 8, padding: "10px 14px", color: "#F1F5F9", fontSize: 14,
                fontFamily: "Georgia, serif", outline: "none"
              }} />
          </div>

          {/* Score hero */}
          <div style={{
            background: "linear-gradient(135deg, rgba(30,58,95,0.8), rgba(15,23,42,0.9))",
            border: `1px solid ${risk.color}40`,
            borderRadius: 20, padding: "40px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 40,
            boxShadow: `0 0 60px ${risk.color}20`
          }}>
            <RadialScore score={overallScore} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: "#94A3B8", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontFamily: "Helvetica, sans-serif" }}>
                GDPR Compliance Assessment
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#F1F5F9", marginBottom: 8 }}>
                {companyName || "Your Organisation"}
              </div>
              <div style={{ fontSize: 15, color: "#CBD5E1", marginBottom: 16, lineHeight: 1.6 }}>
                {risk.desc}
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ textAlign: "center", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "10px 20px" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#10B981" }}>
                    {allQuestions.filter(q => answers[q.id] === "yes").length}
                  </div>
                  <div style={{ fontSize: 11, color: "#6EE7B7", fontFamily: "Helvetica, sans-serif" }}>Compliant</div>
                </div>
                <div style={{ textAlign: "center", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: 10, padding: "10px 20px" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#F59E0B" }}>
                    {allQuestions.filter(q => answers[q.id] === "partial").length}
                  </div>
                  <div style={{ fontSize: 11, color: "#FCD34D", fontFamily: "Helvetica, sans-serif" }}>Partial</div>
                </div>
                <div style={{ textAlign: "center", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 20px" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#EF4444" }}>
                    {allQuestions.filter(q => answers[q.id] === "no").length}
                  </div>
                  <div style={{ fontSize: 11, color: "#FCA5A5", fontFamily: "Helvetica, sans-serif" }}>Gaps</div>
                </div>
                <div style={{ textAlign: "center", background: "rgba(107,114,128,0.1)", border: "1px solid rgba(107,114,128,0.3)", borderRadius: 10, padding: "10px 20px" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#9CA3AF" }}>
                    {totalCount - answeredCount}
                  </div>
                  <div style={{ fontSize: 11, color: "#D1D5DB", fontFamily: "Helvetica, sans-serif" }}>Unanswered</div>
                </div>
              </div>
            </div>
          </div>

          {/* Category breakdown */}
          <div style={{
            background: "rgba(30,58,95,0.4)", border: "1px solid rgba(46,107,230,0.2)",
            borderRadius: 16, padding: "28px", marginBottom: 24
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", marginBottom: 20 }}>
              Score by Category
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {CATEGORIES.map(c => {
                const score = Math.round(
                  (c.questions.reduce((sum, q) => sum + (STATUS[answers[q.id]]?.score ?? 0), 0) / c.questions.length) * 100
                );
                const color = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
                const gaps = c.questions.filter(q => answers[q.id] === "no").length;
                return (
                  <div key={c.id} style={{
                    background: "rgba(15,23,42,0.5)", borderRadius: 12,
                    padding: "16px 18px", border: "1px solid rgba(255,255,255,0.06)"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0" }}>{c.icon} {c.title}</span>
                      <span style={{ fontSize: 16, fontWeight: 800, color }}>{score}%</span>
                    </div>
                    <div style={{ background: "#1E293B", borderRadius: 4, height: 8, overflow: "hidden", marginBottom: 6 }}>
                      <div style={{ width: `${score}%`, height: "100%", background: color, borderRadius: 4, transition: "width 1s ease" }} />
                    </div>
                    <div style={{ fontSize: 11, color: "#64748B", fontFamily: "Helvetica, sans-serif" }}>
                      {gaps > 0 ? <span style={{ color: "#EF4444" }}>⚠ {gaps} gap{gaps > 1 ? "s" : ""} identified</span> : <span style={{ color: "#10B981" }}>✓ No critical gaps</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Priority action plan */}
          {gaps.length > 0 && (
            <div style={{
              background: "rgba(30,58,95,0.4)", border: "1px solid rgba(46,107,230,0.2)",
              borderRadius: 16, padding: "28px", marginBottom: 24
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", marginBottom: 6 }}>
                📋 Priority Action Plan
              </div>
              <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20, fontFamily: "Helvetica, sans-serif" }}>
                {gaps.length} items require attention — sorted by risk level
              </div>
              {gaps.map((q, i) => {
                const catName = CATEGORIES.find(c => c.questions.find(qq => qq.id === q.id))?.title;
                return (
                  <div key={q.id} style={{
                    display: "flex", alignItems: "flex-start", gap: 14,
                    padding: "14px 16px", borderRadius: 10, marginBottom: 8,
                    background: answers[q.id] === "no" ? "rgba(239,68,68,0.06)" : "rgba(245,158,11,0.06)",
                    border: `1px solid ${answers[q.id] === "no" ? "rgba(239,68,68,0.2)" : "rgba(245,158,11,0.2)"}`,
                  }}>
                    <div style={{
                      minWidth: 28, height: 28, borderRadius: "50%",
                      background: answers[q.id] === "no" ? "#EF4444" : "#F59E0B",
                      color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, fontFamily: "Helvetica, sans-serif", flexShrink: 0
                    }}>{i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: "#E2E8F0", marginBottom: 4 }}>{q.text}</div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <span style={{
                          fontSize: 10, background: RISK_BG[q.risk], color: RISK_COLOR[q.risk],
                          padding: "2px 8px", borderRadius: 10, fontFamily: "Helvetica, sans-serif", fontWeight: 700
                        }}>{q.risk.toUpperCase()} RISK</span>
                        <span style={{
                          fontSize: 10, color: "#94A3B8", background: "rgba(100,116,139,0.15)",
                          padding: "2px 8px", borderRadius: 10, fontFamily: "Helvetica, sans-serif"
                        }}>{catName}</span>
                        <span style={{
                          fontSize: 10,
                          color: answers[q.id] === "no" ? "#FCA5A5" : "#FCD34D",
                          background: answers[q.id] === "no" ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                          padding: "2px 8px", borderRadius: 10, fontFamily: "Helvetica, sans-serif"
                        }}>{answers[q.id] === "no" ? "Not implemented" : "Partially implemented"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Recommended documents */}
          <div style={{
            background: "linear-gradient(135deg, rgba(46,107,230,0.15), rgba(30,58,95,0.5))",
            border: "1px solid rgba(46,107,230,0.4)",
            borderRadius: 16, padding: "28px"
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#F1F5F9", marginBottom: 6 }}>
              📦 Recommended Templates for Your Gaps
            </div>
            <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 20, fontFamily: "Helvetica, sans-serif" }}>
              Based on your assessment, the following documents from the GDPR Kit will help close your gaps:
            </div>
            {[
              { doc: "Privacy Policy Template", trigger: ["lb1","lb2","lb3"], icon: "01" },
              { doc: "Cookie Policy Template", trigger: ["web1","web2"], icon: "02" },
              { doc: "Data Processing Agreement", trigger: ["tp1","tp2","tp4"], icon: "03" },
              { doc: "Subject Access Request Template", trigger: ["ir1","ir2","ir3","ir6"], icon: "04" },
              { doc: "Data Breach Notification Template", trigger: ["sec5","sec6"], icon: "05" },
              { doc: "GDPR Compliance Checklist", trigger: ["gov1","gov2","gov3","gov4"], icon: "06" },
            ].map(item => {
              const needed = item.trigger.some(id => answers[id] === "no" || answers[id] === "partial" || !answers[id]);
              return (
                <div key={item.doc} style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 16px", borderRadius: 10, marginBottom: 8,
                  background: needed ? "rgba(46,107,230,0.1)" : "rgba(16,185,129,0.05)",
                  border: `1px solid ${needed ? "rgba(46,107,230,0.3)" : "rgba(16,185,129,0.2)"}`,
                  opacity: needed ? 1 : 0.5
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: needed ? "rgba(46,107,230,0.2)" : "rgba(16,185,129,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, color: needed ? "#93C5FD" : "#6EE7B7",
                    fontFamily: "Helvetica, sans-serif"
                  }}>{item.icon}</div>
                  <div style={{ flex: 1, fontSize: 13, color: "#E2E8F0" }}>{item.doc}</div>
                  <div style={{
                    fontSize: 11, fontFamily: "Helvetica, sans-serif", fontWeight: 700,
                    color: needed ? "#93C5FD" : "#6EE7B7",
                    background: needed ? "rgba(46,107,230,0.15)" : "rgba(16,185,129,0.1)",
                    padding: "3px 10px", borderRadius: 10
                  }}>{needed ? "Recommended" : "✓ Covered"}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

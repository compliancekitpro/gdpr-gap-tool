import GDPRAssessment from './GDPRAssessment.jsx'

// ─── ETSY CTA BANNER ──────────────────────────────────────────────────────────
// Replace YOUR_ETSY_SHOP_URL with your actual Etsy listing URL before deploying
const ETSY_FULL_KIT_URL = "https://compliancekitpro.etsy.com"
const ETSY_SAAS_BUNDLE_URL = "https://compliancekitpro.etsy.com"

function CTABanner() {
  return (
    <div style={{
      background: "linear-gradient(90deg, #1B2A4A 0%, #1E3A5F 100%)",
      borderTop: "2px solid #2E6BE6",
      padding: "28px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 20,
    }}>
      <div>
        <div style={{ fontSize: 11, color: "#60A5FA", letterSpacing: 3, fontFamily: "Arial, sans-serif", textTransform: "uppercase", marginBottom: 6 }}>
          GDPR Compliance Kit
        </div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#F1F5F9", fontFamily: "Georgia, serif", marginBottom: 4 }}>
          Ready to close your compliance gaps?
        </div>
        <div style={{ fontSize: 14, color: "#94A3B8", fontFamily: "Arial, sans-serif" }}>
          Get all 6 fillable PDF templates + this assessment tool — instant download on Etsy
        </div>
      </div>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <a href={ETSY_FULL_KIT_URL} target="_blank" rel="noopener noreferrer" style={{
          background: "linear-gradient(135deg, #2E6BE6, #1D4ED8)",
          color: "white", textDecoration: "none", borderRadius: 10,
          padding: "12px 24px", fontSize: 14, fontWeight: 700,
          fontFamily: "Arial, sans-serif",
          boxShadow: "0 4px 16px rgba(46,107,230,0.4)",
          display: "inline-block",
        }}>
          Get Full Kit — $30 →
        </a>
        <a href={ETSY_SAAS_BUNDLE_URL} target="_blank" rel="noopener noreferrer" style={{
          background: "transparent",
          color: "#C4B5FD", textDecoration: "none", borderRadius: 10,
          padding: "12px 24px", fontSize: 14, fontWeight: 700,
          fontFamily: "Arial, sans-serif",
          border: "1px solid rgba(139,92,246,0.4)",
          display: "inline-block",
        }}>
          SaaS Bundle — $52
        </a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <GDPRAssessment />
      </div>
      <CTABanner />
    </div>
  )
}

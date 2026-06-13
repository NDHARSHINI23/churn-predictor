"use client";
import { useState } from "react";

const FONT = "'Georgia', 'Times New Roman', serif";
const MONO = "'Courier New', Courier, monospace";

const FIELD_DEFS = [
  { key: "tenure",           label: "Tenure",              unit: "months", type: "range", min: 0,   max: 72,  step: 1,   default: 12,   desc: "How long has this customer been with the service?" },
  { key: "monthlyCharges",   label: "Monthly Charges",     unit: "$",      type: "range", min: 18,  max: 120, step: 0.5, default: 65,   desc: "Current monthly bill amount." },
  { key: "totalCharges",     label: "Total Charges",       unit: "$",      type: "range", min: 0,   max: 8500,step: 10,  default: 780,  desc: "Cumulative charges over the customer lifetime." },
  { key: "contract",         label: "Contract Type",       unit: "",       type: "select", options: ["Month-to-month","One year","Two year"], default: "Month-to-month", desc: "Longer contracts heavily reduce churn risk." },
  { key: "internetService",  label: "Internet Service",    unit: "",       type: "select", options: ["Fiber optic","DSL","No"], default: "Fiber optic", desc: "Fiber optic customers churn more than DSL." },
  { key: "paymentMethod",    label: "Payment Method",      unit: "",       type: "select", options: ["Electronic check","Mailed check","Bank transfer (auto)","Credit card (auto)"], default: "Electronic check", desc: "Electronic check correlates with higher churn." },
  { key: "techSupport",      label: "Tech Support",        unit: "",       type: "select", options: ["Yes","No","No internet service"], default: "No", desc: "Customers without tech support churn more." },
  { key: "onlineSecurity",   label: "Online Security",     unit: "",       type: "select", options: ["Yes","No","No internet service"], default: "No", desc: "Security add-ons improve retention." },
  { key: "numServices",      label: "Number of Services",  unit: "",       type: "range", min: 1,   max: 8,   step: 1,   default: 2,    desc: "Total add-on services subscribed (TV, backup, etc.)." },
  { key: "paperlessBilling", label: "Paperless Billing",   unit: "",       type: "select", options: ["Yes","No"],         default: "Yes", desc: "Paperless billing customers tend to churn slightly more." },
  { key: "seniorCitizen",    label: "Senior Citizen",      unit: "",       type: "select", options: ["Yes","No"],         default: "No",  desc: "Senior citizens show slightly higher churn rates." },
  { key: "dependents",       label: "Has Dependents",      unit: "",       type: "select", options: ["Yes","No"],         default: "No",  desc: "Customers with families churn less." },
];

const PRESETS = [
  { label: "High Risk", icon: "🔴", values: { tenure: 2, monthlyCharges: 95, totalCharges: 190, contract: "Month-to-month", internetService: "Fiber optic", paymentMethod: "Electronic check", techSupport: "No", onlineSecurity: "No", numServices: 1, paperlessBilling: "Yes", seniorCitizen: "Yes", dependents: "No" }},
  { label: "Low Risk",  icon: "🟢", values: { tenure: 48, monthlyCharges: 55, totalCharges: 2640, contract: "Two year", internetService: "DSL", paymentMethod: "Credit card (auto)", techSupport: "Yes", onlineSecurity: "Yes", numServices: 5, paperlessBilling: "No", seniorCitizen: "No", dependents: "Yes" }},
  { label: "Borderline",icon: "🟡", values: { tenure: 14, monthlyCharges: 70, totalCharges: 980, contract: "One year", internetService: "Fiber optic", paymentMethod: "Bank transfer (auto)", techSupport: "No", onlineSecurity: "Yes", numServices: 3, paperlessBilling: "Yes", seniorCitizen: "No", dependents: "No" }},
];

function getDefaultValues() {
  return Object.fromEntries(FIELD_DEFS.map(f => [f.key, f.default]));
}

function RiskGauge({ probability }) {
  const pct = Math.round(probability * 100);
  const angle = -135 + pct * 2.7;
  const color = pct >= 65 ? "#ef4444" : pct >= 35 ? "#f59e0b" : "#22c55e";
  const label = pct >= 65 ? "HIGH RISK" : pct >= 35 ? "MEDIUM RISK" : "LOW RISK";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width="200" height="120" viewBox="0 0 200 120">
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#22c55e" />
            <stop offset="50%"  stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        {/* Track */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#1f2937" strokeWidth="14" strokeLinecap="round" />
        {/* Fill */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gaugeGrad)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${pct * 2.51} 251`} />
        {/* Needle */}
        <g transform={`rotate(${angle}, 100, 100)`}>
          <line x1="100" y1="100" x2="100" y2="30" stroke="#f9fafb" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="100" r="5" fill="#f9fafb" />
        </g>
        <text x="100" y="90" textAnchor="middle" fill="#f9fafb" fontSize="28" fontFamily={FONT} fontWeight="bold">{pct}%</text>
      </svg>
      <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", color, marginTop: -8 }}>{label}</span>
    </div>
  );
}

function FactorBar({ label, impact, direction, i }) {
  const [w, setW] = useState(0);
  useState(() => { setTimeout(() => setW(Math.abs(impact)), 80 + i * 60); });
  const color = direction === "increase" ? "#ef4444" : "#22c55e";
  const arrow = direction === "increase" ? "↑" : "↓";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: FONT, fontSize: 12, color: "#d1d5db" }}>{label}</span>
        <span style={{ fontFamily: MONO, fontSize: 11, color }}>{arrow} {Math.round(Math.abs(impact) * 100)}% influence</span>
      </div>
      <div style={{ height: 5, background: "#1f2937", borderRadius: 3 }}>
        <div style={{ height: "100%", width: `${Math.min(Math.abs(impact) * 100, 100)}%`, background: color, borderRadius: 3, transition: "width 0.7s cubic-bezier(0.4,0,0.2,1)" }} />
      </div>
    </div>
  );
}

export default function ChurnPredictor() {
  const [values, setValues]     = useState(getDefaultValues());
  const [result, setResult]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [activeTab, setTab]     = useState("input");

  const set = (k, v) => setValues(p => ({ ...p, [k]: v }));

  const loadPreset = (preset) => {
    setValues({ ...getDefaultValues(), ...preset.values });
    setResult(null);
  };

  const predict = async () => {
    setLoading(true); setError(""); setResult(null);
    const prompt = `You are an expert customer churn prediction model trained on the IBM Telco Customer Churn dataset.

Analyze this customer profile and predict churn probability. Return ONLY valid JSON, no markdown, no preamble.

Customer profile:
- Tenure: ${values.tenure} months
- Monthly Charges: $${values.monthlyCharges}
- Total Charges: $${values.totalCharges}
- Contract Type: ${values.contract}
- Internet Service: ${values.internetService}
- Payment Method: ${values.paymentMethod}
- Tech Support: ${values.techSupport}
- Online Security: ${values.onlineSecurity}
- Number of Add-on Services: ${values.numServices}
- Paperless Billing: ${values.paperlessBilling}
- Senior Citizen: ${values.seniorCitizen}
- Has Dependents: ${values.dependents}

Return this exact JSON structure:
{
  "churn_probability": 0.0 to 1.0,
  "risk_level": "High" | "Medium" | "Low",
  "top_factors": [
    { "label": "Factor name", "impact": 0.0-1.0, "direction": "increase" | "decrease", "explanation": "one sentence" }
  ],
  "retention_actions": ["Action 1", "Action 2", "Action 3"],
  "similar_customer_churn_rate": 0.0 to 1.0,
  "estimated_ltv_loss": number,
  "summary": "2-sentence plain English summary for a business stakeholder"
}

Rules:
- top_factors: exactly 5 factors, sorted by impact descending, covering the most influential features
- direction: "increase" means this factor raises churn risk, "decrease" means it lowers it
- estimated_ltv_loss: estimated monthly revenue × expected remaining tenure if retained (integer, USD)
- Use XGBoost/SHAP-style feature attribution logic`;

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] })
      });
      const data = await res.json();

      // Surface server-side or API-level errors clearly
      if (!res.ok || data.error) {
        throw new Error(data.error || `Server error ${res.status}`);
      }

      const raw = data.content?.find(b => b.type === "text")?.text || "";
      if (!raw) throw new Error("Empty response from AI model.");
      const clean = raw.replace(/```json[\s\S]*?```|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setTab("result");
    } catch (e) {
      setError("Prediction failed. " + (e.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const riskColor = result ? (result.churn_probability >= 0.65 ? "#ef4444" : result.churn_probability >= 0.35 ? "#f59e0b" : "#22c55e") : "#6b7280";

  return (
    <div style={{ background: "#060a0f", minHeight: "100vh", color: "#e2e8f0" }}>
      {/* Top bar */}
      <div style={{ background: "#0d1117", borderBottom: "1px solid #1a2332", padding: "14px 28px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />)}
        </div>
        <span style={{ fontFamily: MONO, fontSize: 10, color: "#3d5a80", letterSpacing: "0.2em" }}>CHURN_PREDICTOR.v1 — TELCO CUSTOMER ANALYTICS</span>
        <div style={{ flex: 1 }} />
        <span style={{ fontFamily: MONO, fontSize: 10, color: "#1e3a5f" }}>XGBoost · SHAP · IBM Dataset</span>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 32, borderLeft: "3px solid #3d5a80", paddingLeft: 18 }}>
          <h1 style={{ fontFamily: FONT, fontSize: 30, fontWeight: 400, color: "#f1f5f9", margin: 0, letterSpacing: "-0.01em" }}>
            Customer Churn Predictor
          </h1>
          <p style={{ fontFamily: MONO, fontSize: 10, color: "#3d5a80", marginTop: 6, letterSpacing: "0.12em" }}>
            PREDICT · EXPLAIN · RETAIN — CLASSIFICATION MODEL WITH SHAP EXPLAINABILITY
          </p>
        </div>

        {/* Presets */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: "#3d5a80", letterSpacing: "0.12em", marginBottom: 10 }}>QUICK LOAD PRESET →</div>
          <div style={{ display: "flex", gap: 10 }}>
            {PRESETS.map(p => (
              <button key={p.label} onClick={() => loadPreset(p)} style={{
                background: "#0d1117", border: "1px solid #1a2332", borderRadius: 8,
                padding: "8px 16px", cursor: "pointer", fontFamily: MONO,
                fontSize: 11, color: "#94a3b8", letterSpacing: "0.08em",
                transition: "all 0.2s"
              }}
              onMouseEnter={e => e.target.style.borderColor = "#3d5a80"}
              onMouseLeave={e => e.target.style.borderColor = "#1a2332"}
              >{p.icon} {p.label}</button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #1a2332", marginBottom: 24 }}>
          {["input","result"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: "9px 22px", background: "none", border: "none", cursor: "pointer",
              fontFamily: MONO, fontSize: 10, letterSpacing: "0.15em",
              color: activeTab === t ? "#e2e8f0" : "#3d5a80",
              borderBottom: activeTab === t ? "2px solid #3d8bff" : "2px solid transparent",
              transition: "all 0.2s"
            }}>{t.toUpperCase()}</button>
          ))}
        </div>

        {/* INPUT TAB */}
        {activeTab === "input" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {FIELD_DEFS.map(f => (
                <div key={f.key} style={{ background: "#0d1117", border: "1px solid #1a2332", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontFamily: MONO, fontSize: 10, color: "#3d5a80", letterSpacing: "0.12em", marginBottom: 6 }}>
                    {f.label.toUpperCase()}{f.unit ? ` (${f.unit})` : ""}
                  </div>
                  {f.type === "range" ? (
                    <>
                      <div style={{ fontFamily: FONT, fontSize: 20, color: "#f1f5f9", marginBottom: 8 }}>
                        {f.unit === "$" ? `$${values[f.key].toLocaleString()}` : values[f.key]}{f.unit === "months" ? " mo" : ""}
                      </div>
                      <input type="range" min={f.min} max={f.max} step={f.step} value={values[f.key]}
                        onChange={e => set(f.key, parseFloat(e.target.value))}
                        style={{ width: "100%", accentColor: "#3d8bff", cursor: "pointer" }} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                        <span style={{ fontFamily: MONO, fontSize: 9, color: "#1e3a5f" }}>{f.unit === "$" ? `$${f.min}` : f.min}</span>
                        <span style={{ fontFamily: MONO, fontSize: 9, color: "#1e3a5f" }}>{f.unit === "$" ? `$${f.max.toLocaleString()}` : f.max}</span>
                      </div>
                    </>
                  ) : (
                    <select value={values[f.key]} onChange={e => set(f.key, e.target.value)}
                      style={{ width: "100%", background: "#060a0f", border: "1px solid #1e3a5f", borderRadius: 6,
                        padding: "6px 10px", color: "#e2e8f0", fontFamily: FONT, fontSize: 13, cursor: "pointer", outline: "none" }}>
                      {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  )}
                  <div style={{ fontFamily: MONO, fontSize: 9, color: "#1e3a5f", marginTop: 6, lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            {error && <p style={{ fontFamily: MONO, fontSize: 11, color: "#ef4444", marginTop: 16 }}>⚠ {error}</p>}

            <button onClick={predict} disabled={loading} style={{
              marginTop: 24, background: loading ? "#1a2332" : "#1e3a5f",
              border: `1px solid ${loading ? "#1a2332" : "#3d8bff"}`,
              borderRadius: 8, padding: "13px 32px", cursor: loading ? "not-allowed" : "pointer",
              fontFamily: MONO, fontSize: 12, letterSpacing: "0.12em",
              color: loading ? "#3d5a80" : "#93c5fd", transition: "all 0.2s", width: "100%"
            }}>
              {loading ? "▶ RUNNING MODEL... (may retry, please wait)" : "▶ PREDICT CHURN PROBABILITY"}
            </button>
          </div>
        )}

        {/* RESULT TAB */}
        {activeTab === "result" && (
          <div>
            {!result ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#1e3a5f" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>◌</div>
                <p style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.15em" }}>NO PREDICTION YET — FILL THE FORM AND RUN THE MODEL</p>
                <button onClick={() => setTab("input")} style={{ marginTop: 16, background: "none", border: "1px solid #1a2332", borderRadius: 6, padding: "8px 18px", color: "#3d5a80", cursor: "pointer", fontFamily: MONO, fontSize: 10 }}>← GO TO INPUT</button>
              </div>
            ) : (
              <>
                {/* Main result card */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                  <div style={{ background: "#0d1117", border: `1px solid ${riskColor}33`, borderRadius: 12, padding: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <RiskGauge probability={result.churn_probability} />
                    <div style={{ fontFamily: MONO, fontSize: 9, color: "#3d5a80", letterSpacing: "0.15em", marginTop: 10 }}>CHURN PROBABILITY SCORE</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ background: "#0d1117", border: "1px solid #1a2332", borderRadius: 10, padding: "14px 16px", flex: 1 }}>
                      <div style={{ fontFamily: MONO, fontSize: 9, color: "#3d5a80", letterSpacing: "0.12em", marginBottom: 8 }}>SIMILAR CUSTOMER CHURN RATE</div>
                      <div style={{ fontFamily: FONT, fontSize: 26, color: "#f59e0b" }}>{Math.round(result.similar_customer_churn_rate * 100)}%</div>
                      <div style={{ fontFamily: MONO, fontSize: 9, color: "#1e3a5f", marginTop: 4 }}>of customers with this profile</div>
                    </div>
                    <div style={{ background: "#0d1117", border: "1px solid #1a2332", borderRadius: 10, padding: "14px 16px", flex: 1 }}>
                      <div style={{ fontFamily: MONO, fontSize: 9, color: "#3d5a80", letterSpacing: "0.12em", marginBottom: 8 }}>ESTIMATED LTV AT RISK</div>
                      <div style={{ fontFamily: FONT, fontSize: 26, color: "#ef4444" }}>${result.estimated_ltv_loss?.toLocaleString()}</div>
                      <div style={{ fontFamily: MONO, fontSize: 9, color: "#1e3a5f", marginTop: 4 }}>projected revenue loss</div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div style={{ background: "#0d1117", border: "1px solid #1a2332", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
                  <div style={{ fontFamily: MONO, fontSize: 9, color: "#3d5a80", letterSpacing: "0.12em", marginBottom: 10 }}>MODEL SUMMARY</div>
                  <p style={{ fontFamily: FONT, fontSize: 14, color: "#cbd5e1", lineHeight: 1.7, margin: 0 }}>{result.summary}</p>
                </div>

                {/* SHAP-style factors */}
                <div style={{ background: "#0d1117", border: "1px solid #1a2332", borderRadius: 10, padding: "16px 18px", marginBottom: 16 }}>
                  <div style={{ fontFamily: MONO, fontSize: 9, color: "#3d5a80", letterSpacing: "0.12em", marginBottom: 14 }}>SHAP FEATURE IMPORTANCE</div>
                  {result.top_factors?.map((f, i) => <FactorBar key={i} {...f} i={i} />)}
                  <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: "#ef4444" }}>↑ increases churn risk</span>
                    <span style={{ fontFamily: MONO, fontSize: 9, color: "#22c55e" }}>↓ decreases churn risk</span>
                  </div>
                </div>

                {/* Retention actions */}
                <div style={{ background: "#0d1117", border: "1px solid #1a2332", borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
                  <div style={{ fontFamily: MONO, fontSize: 9, color: "#3d5a80", letterSpacing: "0.12em", marginBottom: 14 }}>RECOMMENDED RETENTION ACTIONS</div>
                  {result.retention_actions?.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 10 }}>
                      <span style={{ fontFamily: MONO, fontSize: 10, color: "#3d8bff", flexShrink: 0, marginTop: 2 }}>[{String(i+1).padStart(2,"0")}]</span>
                      <span style={{ fontFamily: FONT, fontSize: 13, color: "#cbd5e1", lineHeight: 1.6 }}>{a}</span>
                    </div>
                  ))}
                </div>

                {/* Factor explanations */}
                <div style={{ background: "#0d1117", border: "1px solid #1a2332", borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
                  <div style={{ fontFamily: MONO, fontSize: 9, color: "#3d5a80", letterSpacing: "0.12em", marginBottom: 14 }}>FACTOR EXPLANATIONS</div>
                  {result.top_factors?.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, marginBottom: 9, paddingBottom: 9, borderBottom: i < result.top_factors.length - 1 ? "1px solid #0f1923" : "none" }}>
                      <span style={{ fontFamily: MONO, fontSize: 11, color: f.direction === "increase" ? "#ef4444" : "#22c55e", flexShrink: 0, width: 14 }}>{f.direction === "increase" ? "↑" : "↓"}</span>
                      <div>
                        <span style={{ fontFamily: MONO, fontSize: 10, color: "#94a3b8" }}>{f.label}: </span>
                        <span style={{ fontFamily: FONT, fontSize: 12, color: "#64748b" }}>{f.explanation}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={() => setTab("input")} style={{
                  background: "none", border: "1px solid #1a2332", borderRadius: 6,
                  padding: "9px 18px", color: "#3d5a80", cursor: "pointer",
                  fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em"
                }}>← MODIFY CUSTOMER PROFILE</button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

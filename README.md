# 📊 Customer Churn Predictor

A high-performance, AI-driven analytics dashboard built with **Next.js** and **Groq AI**. This application predicts the probability of a customer churning (canceling their service) based on behavioral and demographic data, providing real-time SHAP-style feature importance explanations.

![Churn Predictor Preview](https://raw.githubusercontent.com/NDHARSHINI23/churn-predictor/master/public/preview.png) *(Note: Add a screenshot later if available)*

---

## ⚡ Features

- **Real-time AI Inference:** Powered by Groq's Llama 3 for near-instant predictions.
- **Explainable AI (XAI):** Provides SHAP-style feature importance to show *why* a customer is at risk.
- **Dynamic Risk Gauge:** Visualizes churn probability from Low to High risk.
- **Interactive Scenarios:** Modify customer profiles (Tenure, Charges, Contract type) to see impact on retention.
- **Modern UI:** Sleek, dark-mode terminal-inspired aesthetics with glassmorphism.

---

## 🛠️ Tech Stack

- **Frontend:** [Next.js 15+](https://nextjs.org/) (App Router), React, Vanilla CSS.
- **AI Engine:** [Groq Cloud](https://console.groq.com/) (Llama-3.3-70b).
- **Deployment:** [Vercel](https://vercel.com/).

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/NDHARSHINI23/churn-predictor.git
cd churn-predictor
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory:
```env
GROQ_API_KEY=your_gsk_key_here
```
*You can get a free API key at [console.groq.com](https://console.groq.com).*

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub.
2. Link your GitHub repo to [Vercel](https://vercel.com).
3. **Crucial:** Add the `GROQ_API_KEY` to Vercel's **Environment Variables** in the project settings.
4. Deploy!

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Developed By

**[NDHARSHINI23](https://github.com/NDHARSHINI23)**

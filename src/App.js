import React, { useState } from "react";

const lawyers = {
  Criminal: [
    { name: "Adv. Rajesh Kumar", experience: "10 years" },
    { name: "Adv. Meena Sharma", experience: "7 years" },
  ],
  Family: [
    { name: "Adv. Anjali Singh", experience: "8 years" },
    { name: "Adv. Priya Reddy", experience: "5 years" },
  ],
  Consumer: [
    { name: "Adv. Ravi Patel", experience: "6 years" },
  ],
  Civil: [
    { name: "Adv. Arjun Das", experience: "12 years" },
  ],
};

function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: question }),
      });

      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Vidhi Saarathi AI</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={5}
          style={{ width: "100%", padding: "10px" }}
          placeholder="Describe your legal problem..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <br />
        <button type="submit" style={{ marginTop: "10px", padding: "10px 20px" }}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {result && !result.error && (
        <>
          <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
            <h3>Domain: {result.domain_guess}</h3>
            <p><strong>Urgency:</strong> {result.urgency}</p>
            <p><strong>AI Output:</strong><br />{result.ai_output}</p>
          </div>

          {/* Lawyer Dashboard - Conditional */}
          {lawyers[result.domain_guess] && (
            <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #007bff", borderRadius: "5px" }}>
              <h3>{result.domain_guess} Lawyers</h3>
              {lawyers[result.domain_guess].map((lawyer, idx) => (
                <div key={idx} style={{ marginBottom: "10px" }}>
                  <strong>{lawyer.name}</strong> - {lawyer.experience}
                  <br />
                  <button
                    style={{ marginTop: "5px", padding: "5px 10px" }}
                    onClick={() => alert(`Connecting to ${lawyer.name}...`)}
                  >
                    Connect
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {result && result.error && <p style={{ color: "red" }}>Error: {result.error}</p>}
    </div>
  );
}

export default App;

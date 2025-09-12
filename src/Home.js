import React, { useState } from "react";

function Home() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/classify", {
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
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>Describe your legal problem:</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={5}
          style={{ width: "100%", padding: "10px" }}
          placeholder="Enter your legal query..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <br />
        <button type="submit" style={{ marginTop: "10px", padding: "10px 20px" }}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "5px" }}>
          {result.error ? (
            <p style={{ color: "red" }}>Error: {result.error}</p>
          ) : (
            <>
              <h3>Domain: {result.domain_guess}</h3>
              <p><strong>Urgency:</strong> {result.urgency}</p>
              <p><strong>AI Output:</strong><br />{result.ai_output}</p>
              <button
                style={{ marginTop: "10px", padding: "8px 15px" }}
                onClick={() => alert("Pretend we connect you to a lawyer...")}
              >
                Connect to Lawyer
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
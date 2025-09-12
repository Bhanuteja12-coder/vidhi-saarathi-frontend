import React, { useState } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Dummy lawyers
  const lawyers = [
    { name: "Adv. Ramesh Kumar", specialty: "Criminal Law", contact: "ramesh@example.com" },
    { name: "Adv. Priya Sharma", specialty: "Family Law", contact: "priya@example.com" },
    { name: "Adv. Anil Joshi", specialty: "Consumer Law", contact: "anil@example.com" },
    { name: "Adv. Neha Singh", specialty: "Civil Law", contact: "neha@example.com" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { sender: "user", text: question };
    setChatHistory((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: question }),
      });

      if (!res.ok) {
        throw new Error("API error");
      }

      const data = await res.json();
      const aiMessage = {
        sender: "ai",
        text: `Domain: ${data.domain_guess}\nUrgency: ${data.urgency}\nAI Output: ${data.ai_output}`,
      };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMsg = { sender: "ai", text: `Error: ${err.message}` };
      setChatHistory((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", fontFamily: "Arial, sans-serif", height: "100vh" }}>
      {/* Chat Section */}
      <div style={{ flex: 2, padding: "20px", borderRight: "1px solid #ccc", display: "flex", flexDirection: "column" }}>
        <h1>Vidhi Saarathi AI</h1>

        <div style={{ flex: 1, overflowY: "auto", marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
          {chatHistory.length === 0 && <p style={{ color: "#888" }}>Start the conversation...</p>}
          {chatHistory.map((msg, idx) => (
            <div key={idx} style={{ margin: "10px 0", textAlign: msg.sender === "user" ? "right" : "left" }}>
              <div
                style={{
                  display: "inline-block",
                  padding: "10px",
                  borderRadius: "10px",
                  backgroundColor: msg.sender === "user" ? "#dcf8c6" : "#f1f0f0",
                  whiteSpace: "pre-line",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex" }}>
          <textarea
            rows={2}
            style={{ flex: 1, padding: "10px", resize: "none" }}
            placeholder="Type your legal query..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button type="submit" style={{ marginLeft: "10px", padding: "10px 20px" }}>
            {loading ? "Analyzing..." : "Send"}
          </button>
        </form>
      </div>

      {/* Lawyer Dashboard */}
      <div style={{ flex: 1, padding: "20px" }}>
        <h2>Lawyer Dashboard</h2>
        {lawyers.map((lawyer, idx) => (
          <div key={idx} style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" }}>
            <h4>{lawyer.name}</h4>
            <p><strong>Specialty:</strong> {lawyer.specialty}</p>
            <p><strong>Contact:</strong> {lawyer.contact}</p>
            <button
              onClick={() => alert(`Pretend connecting to ${lawyer.name}...`)}
              style={{ marginTop: "5px", padding: "8px 15px" }}
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

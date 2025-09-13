import React, { useState, useRef, useEffect } from "react";

function App() {
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState(null);
  const chatEndRef = useRef(null);

  const allLawyers = [
    { name: "Adv. Ramesh Kumar", specialty: "Criminal", contact: "ramesh@example.com" },
    { name: "Adv. Priya Sharma", specialty: "Family", contact: "priya@example.com" },
    { name: "Adv. Anil Joshi", specialty: "Consumer", contact: "anil@example.com" },
    { name: "Adv. Neha Singh", specialty: "Civil", contact: "neha@example.com" },
  ];

  // Scroll to bottom whenever chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

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

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setDomain(data.domain_guess);

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

  const filteredLawyers = domain
    ? allLawyers.filter((l) => l.specialty === domain)
    : [];

  const colors = {
    user: "#dcf8c6",
    ai: "#f1f0f0",
    bg: "#f5f6fa",
    card: "#fff",
    primary: "#4a90e2",
  };

  // Responsive container
  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    fontFamily: "Inter, sans-serif",
    height: "100vh",
    background: colors.bg,
    flexWrap: "wrap"
  };

  const chatStyle = {
    flex: "2 1 500px",
    display: "flex",
    flexDirection: "column",
    minWidth: "300px",
    position: "relative"
  };

  const chatHistoryStyle = {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
    background: colors.card,
    borderRadius: "10px",
    margin: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  };

  const lawyerStyle = {
    flex: "1 1 300px",
    padding: "20px",
    minWidth: "250px"
  };

  const inputContainerStyle = {
    display: "flex",
    position: "sticky",
    bottom: "0",
    background: colors.bg,
    padding: "10px 20px",
    borderTop: "1px solid #ccc",
    alignItems: "center",
    flexWrap: "wrap"
  };

  return (
    <div style={containerStyle}>
      {/* Chat Section */}
      <div style={chatStyle}>
        <h1 style={{ margin: "20px", color: colors.primary }}>Vidhi Saarathi AI</h1>
        <div style={chatHistoryStyle}>
          {chatHistory.length === 0 && <p style={{ color: "#888" }}>Start the conversation...</p>}
          {chatHistory.map((msg, idx) => (
            <div key={idx} style={{ margin: "10px 0", display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
              <div style={{
                padding: "10px 15px",
                borderRadius: "20px",
                backgroundColor: msg.sender === "user" ? colors.user : colors.ai,
                whiteSpace: "pre-line",
                maxWidth: "70%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        <form onSubmit={handleSubmit} style={inputContainerStyle}>
          <textarea
            rows={2}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              resize: "none",
              minWidth: "200px",
              marginBottom: "10px"
            }}
            placeholder="Type your legal query..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button type="submit" style={{
            marginLeft: "10px",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            background: colors.primary,
            color: "#fff",
            cursor: "pointer",
            transition: "0.2s",
            minWidth: "100px"
          }}>
            {loading ? "Analyzing..." : "Send"}
          </button>
        </form>
      </div>

      {/* Lawyer Dashboard */}
      <div style={lawyerStyle}>
        <h2 style={{ color: colors.primary }}>Lawyer Dashboard</h2>
        {domain ? (
          filteredLawyers.length > 0 ? (
            filteredLawyers.map((lawyer, idx) => (
              <div key={idx} style={{
                marginBottom: "15px",
                padding: "15px",
                borderRadius: "10px",
                background: colors.card,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.2s"
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                <h4>{lawyer.name}</h4>
                <span style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  background: colors.primary,
                  color: "#fff",
                  borderRadius: "5px",
                  fontSize: "12px",
                  marginBottom: "5px"
                }}>{lawyer.specialty}</span>
                <p style={{ margin: "5px 0" }}><strong>Contact:</strong> {lawyer.contact}</p>
                <button
                  onClick={() => alert(`Pretend connecting to ${lawyer.name}...`)}
                  style={{
                    marginTop: "5px",
                    padding: "8px 15px",
                    borderRadius: "8px",
                    border: "none",
                    background: colors.primary,
                    color: "#fff",
                    cursor: "pointer",
                    transition: "0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "#357ABD"}
                  onMouseLeave={e => e.currentTarget.style.background = colors.primary}
                >
                  Connect
                </button>
              </div>
            ))
          ) : (
            <p>No lawyer available for this domain yet.</p>
          )
        ) : (
          <p>Ask a query to see relevant lawyers.</p>
        )}
      </div>
    </div>
  );
}

export default App;
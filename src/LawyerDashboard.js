import React from "react";

const dummyQueries = [
  { user: "Rohit Sharma", query: "Phone not delivered", domain: "Consumer", urgency: "Medium", aiOutput: "Contact seller for refund" },
  { user: "Anita Verma", query: "Neighbor harassment", domain: "Civil", urgency: "High", aiOutput: "Legal action may be required" },
  { user: "Rajesh Kumar", query: "Receiving threats", domain: "Criminal", urgency: "High", aiOutput: "File police complaint immediately" }
];

function LawyerDashboard() {
  return (
    <div>
      <h2>Lawyer Dashboard</h2>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>User</th>
            <th>Query</th>
            <th>Domain</th>
            <th>Urgency</th>
            <th>AI Output</th>
          </tr>
        </thead>
        <tbody>
          {dummyQueries.map((q, idx) => (
            <tr key={idx}>
              <td>{q.user}</td>
              <td>{q.query}</td>
              <td>{q.domain}</td>
              <td>{q.urgency}</td>
              <td>{q.aiOutput}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LawyerDashboard;
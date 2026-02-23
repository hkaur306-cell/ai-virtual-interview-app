import { useState } from "react";

export default function App() {
  const [role, setRole] = useState("Software Engineer");
  const [type, setType] = useState("Behavioral");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL =
    "https://vite-react-sage-nine-49.vercel.app/api/openai";

  const generateQuestion = async () => {
    try {
      setLoading(true);

      const prompt = `Generate one ${type} interview question for a ${role}.`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log("QUESTION RESPONSE:", data);

      if (!response.ok) {
        setQuestion("Error: " + (data.error || "Request failed"));
      } else {
        setQuestion(data.choices?.[0]?.message?.content || "No question returned.");
      }
    } catch (error: any) {
      setQuestion("Fetch failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const evaluateAnswer = async () => {
    try {
      setLoading(true);

      const prompt = `
You are an interview evaluator.

Question: ${question}
Candidate Answer: ${answer}

Return:
1. Clarity Score (1-10)
2. Confidence Score (1-10)
3. STAR Score (1-10)
4. Strengths
5. Weaknesses
6. Improved sample answer
`;

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      console.log("EVALUATION RESPONSE:", data);

      if (!response.ok) {
        setFeedback("Error: " + (data.error || "Request failed"));
      } else {
        setFeedback(
          data.choices?.[0]?.message?.content || "No feedback returned."
        );
      }
    } catch (error: any) {
      setFeedback("Fetch failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>AI Virtual Interview Practice Assistant</h1>

      <div>
        <label>Job Role: </label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Software Engineer</option>
          <option>Data Analyst</option>
          <option>Marketing Intern</option>
          <option>Product Manager</option>
        </select>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Interview Type: </label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Behavioral</option>
          <option>Technical</option>
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={generateQuestion}>Generate Question</button>
      </div>

      {loading && <p>Loading...</p>}

      {question && (
        <div style={{ marginTop: 20 }}>
          <h3>Question:</h3>
          <p>{question}</p>

          <textarea
            rows={4}
            style={{ width: "100%" }}
            placeholder="Type your answer here..."
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />

          <div style={{ marginTop: 10 }}>
            <button onClick={evaluateAnswer}>Evaluate Answer</button>
          </div>
        </div>
      )}

      {feedback && (
        <div style={{ marginTop: 20 }}>
          <h3>AI Feedback:</h3>
          <pre>{feedback}</pre>
        </div>
      )}
    </div>
  );
}
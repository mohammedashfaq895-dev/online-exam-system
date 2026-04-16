import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

function App() {
  const [quizzes, setQuizzes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);

  useEffect(() => {
    axios.get(`${API}/quiz`).then(res => setQuizzes(res.data));
  }, []);

  const submitQuiz = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${API}/quiz/${selected._id}/submit`,
      { answers },
      { headers: { Authorization: token } }
    );

    setScore(res.data.score);
  };

  if (selected) {
    return (
      <div>
        <h2>{selected.title}</h2>
        {selected.questions.map((q, i) => (
          <div key={i}>
            <p>{q.question}</p>
            {q.options.map((opt, idx) => (
              <button key={idx} onClick={() => {
                const newAns = [...answers];
                newAns[i] = idx;
                setAnswers(newAns);
              }}>
                {opt}
              </button>
            ))}
          </div>
        ))}
        <button onClick={submitQuiz}>Submit</button>
        {score !== null && <h3>Score: {score}</h3>}
      </div>
    );
  }

  return (
    <div>
      <h1>Quizzes</h1>
      {quizzes.map(q => (
        <button key={q._id} onClick={() => setSelected(q)}>
          {q.title}
        </button>
      ))}
    </div>
  );
}

export default App;
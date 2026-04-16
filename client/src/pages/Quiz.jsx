import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const API = "/api";

function Quiz() {
  const { id } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);

  useEffect(() => {
    axios.get(`${API}/quiz/${id}`)
      .then(res => setQuiz(res.data))
      .catch(() => alert("Error loading quiz"));
  }, [id]);

  const submitQuiz = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${API}/quiz/${id}/submit`,
      { answers },
      { headers: { Authorization: token } }
    );

    setScore(res.data.score);
  };

  if (!quiz) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2>{quiz.title}</h2>

      {quiz.questions.map((q, i) => (
        <div key={i}>
          <p>{q.question}</p>

          {[q.option1, q.option2, q.option3, q.option4].map((opt, idx) => (
            <button
              key={idx}
              className={answers[i] === idx + 1 ? "selected" : ""}
              onClick={() => {
                const newAns = [...answers];
                newAns[i] = idx + 1;
                setAnswers(newAns);
              }}
            >
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

export default Quiz;
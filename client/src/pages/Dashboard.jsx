import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

function Dashboard() {
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/quiz`)
      .then(res => setQuizzes(res.data))
      .catch(() => alert("Error loading quizzes"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container">
      <h1>Quizzes</h1>

      <button onClick={logout}>Logout</button>

      <hr />

      {quizzes.map(q => (
        <button
          key={q.id}
          onClick={() => navigate(`/quiz/${q.id}`)}
        >
          {q.title}
        </button>
      ))}
    </div>
  );
}

export default Dashboard;
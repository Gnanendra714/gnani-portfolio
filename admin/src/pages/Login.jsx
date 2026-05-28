import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/login.css";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", formData);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful");

      navigate("/");
    } catch (error) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Admin Login</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;

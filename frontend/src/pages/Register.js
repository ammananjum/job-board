// src/Register.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("developer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useNavigate();

  const boxImages = [
    "https://i.pinimg.com/originals/d3/60/f1/d360f1827f7996e9e0a3ccb6f584c848.gif",
    "https://i.pinimg.com/originals/6d/5d/76/6d5d765d891750b7dde3b72a808a6c1b.gif",
    "https://i.pinimg.com/originals/44/d8/50/44d850794ff1968ca0b53cdafedf173c.gif",
    "https://i.pinimg.com/originals/67/b2/a9/67b2a9ba5e85822f237caae92111e938.gif",
    "https://i.pinimg.com/originals/df/39/2f/df392fb90619818047bf4f09e0adbc36.gif",
    "https://i.pinimg.com/originals/45/67/a8/4567a837b545d22b9dcde81ccd98b70e.gif",
  ];

  const pairs = [];
  for (let i = 0; i < boxImages.length; i += 2) {
    pairs.push(boxImages.slice(i, i + 2));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % pairs.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [pairs.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      setSuccess("Registration successful! Please login now.");
      setName("");
      setEmail("");
      setPassword("");
      setRole("developer");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  const goToLogin = () => navigate("/login");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-purple-300 to-black text-black flex flex-col">
      {/* Navbar */}
      <header className="p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="h-14 w-14 rounded-full border-4 border-purple-600 overflow-hidden flex items-center justify-center">
              <img src="/logoX.jpg" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <h1 className="text-3xl font-extrabold text-black">JobBoardX</h1>
          </div>
          {/* Centered nav links */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-8">
            {["Home", "Top Companies", "Method", "About", "Contact"].map((link) => (
              <button
                key={link}
                onClick={() =>
                  link === "Home"
                    ? navigate("/")
                    : window.scrollTo({
                        top: document.getElementById(link.toLowerCase())?.offsetTop,
                        behavior: "smooth",
                      })
                }
                className="text-black font-bold text-2xl hover:underline hover:underline-offset-4 hover:text-purple-700"
              >
                {link}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 md:px-12">
        {/* Left: Register form */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md bg-white bg-opacity-90 text-black p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-extrabold mb-4 text-center">Register</h2>

            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

            {success ? (
              <div className="text-center">
                <p className="text-green-600 mb-4">{success}</p>
                <button
                  onClick={goToLogin}
                  className="inline-block bg-black text-white py-3 px-6 rounded-full border-2 border-purple-600 font-semibold hover:bg-purple-600 transition"
                >
                  Login Now
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 border rounded text-black"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border rounded text-black"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border rounded text-black"
                  required
                />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-4 border rounded text-black"
                >
                  <option value="developer">Developer</option>
                  <option value="employer">Employer</option>
                </select>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-6 rounded-full border-2 border-purple-600 font-semibold hover:bg-purple-600 transition"
                >
                  Register
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right: Carousel */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)`, width: `${pairs.length * 100}%` }}
          >
            {pairs.map((pair, idx) => (
              <div key={idx} className="flex-shrink-0 flex justify-center items-center" style={{ width: "100%" }}>
                <div className="flex space-x-8">
                  {pair.map((src, i) => (
                    <div key={i} className="rounded-xl overflow-hidden shadow-2xl" style={{ width: "350px", height: "360px" }}>
                      <img src={src} alt={`Box ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;

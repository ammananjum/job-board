import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

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
    try {
      const { data } = await axios.post(
<<<<<<< HEAD
        "https://9ace0c41-d172-46f8-ad9f-22a593437d12-00-2jpuy195o8qc9.sisko.replit.dev/api/auth/login",
=======
        "http://localhost:5000/api/auth/login",
>>>>>>> 403ae7b (Update Login and Register pages)
        { email, password }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data._id);

      if (data.role === "employer") navigate("/employer-dashboard");
      else if (data.role === "developer") navigate("/developer-dashboard");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-purple-300 to-black text-black flex flex-col">
      {/* Navbar */}
      <header className="p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="h-14 w-14 rounded-full border-4 border-purple-600 overflow-hidden flex items-center justify-center">
              <img src="/logoX.jpg" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <h1 className="text-3xl font-extrabold text-black">JobBoardX</h1>
          </div>

          {/* Desktop menu */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-10">
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


          {/* Mobile menu icon */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-black text-2xl"
            >
              {menuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-2 bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col space-y-2">
            {["Home", "Top Companies", "Method", "About", "Contact"].map((link) => (
              <button
                key={link}
                onClick={() => {
                  setMenuOpen(false);
                  link === "Home"
                    ? navigate("/")
                    : window.scrollTo({
                        top: document.getElementById(link.toLowerCase())?.offsetTop,
                        behavior: "smooth",
                      });
                }}
                className="text-black font-bold text-lg hover:underline hover:underline-offset-4 hover:text-purple-700"
              >
                {link}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 md:px-12">
        {/* Left: Login form */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md bg-white bg-opacity-90 text-black p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-extrabold mb-4 text-center">Login</h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <button
                type="submit"
                className="w-full bg-black text-white py-3 px-6 rounded-full border-2 border-purple-600 font-semibold hover:bg-purple-600 transition"
              >
                Login
              </button>
            </form>
            <p className="mt-4 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-purple-700 font-bold hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Right: Carousel */}
        <div className="w-full md:w-1/2 flex items-center justify-center relative overflow-hidden">
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
              width: `${pairs.length * 100}%`,
            }}
          >
            {pairs.map((pair, idx) => (
              <div key={idx} className="flex-shrink-0 flex justify-center items-center" style={{ width: "100%" }}>
                <div className="flex space-x-8">
                  {pair.map((src, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden shadow-2xl"
                      style={{ width: "300px", height: "320px" }}
                    >
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

export default Login;

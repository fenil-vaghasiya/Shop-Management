import { useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // try {
    //   const data = await loginApi({ username, password });
    //   localStorage.setItem('token', data.token);
    //   window.location.href = '/';
    // } catch (err) {
    //   toast.error('Invalid username or password');
    // } finally {
    //   setLoading(false);
    // }

    // TEMP DEV LOGIN (NO BACKEND)
    if (username === "Admin" && password === "Admin@2003") {
      localStorage.setItem("token", "DEV_ADMIN_TOKEN");
      window.location.href = "/";
      return;
    }

    toast.error("Invalid username or password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <form
        onSubmit={handleLogin}
        className="
          w-full max-w-sm
          bg-white
          border border-slate-200
          rounded-xl
          p-6
          shadow-sm
          space-y-4
        "
      >
        {/* TITLE */}
        <h2 className="text-xl font-semibold text-slate-900 text-center">
          Login
        </h2>

        {/* USERNAME */}
        <input
          className="
            w-full p-3 rounded-lg
            border border-slate-300
            text-slate-900
            placeholder-slate-400
            focus:outline-none
            focus:ring-2 focus:ring-blue-600
          "
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* PASSWORD */}
        <input
          type="password"
          className="
            w-full p-3 rounded-lg
            border border-slate-300
            text-slate-900
            placeholder-slate-400
            focus:outline-none
            focus:ring-2 focus:ring-blue-600
          "
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* SUBMIT */}
        <button
          disabled={loading}
          type="submit"
          className="
            w-full
            bg-blue-700 hover:bg-blue-800
            text-white
            py-3
            rounded-lg
            font-semibold
            transition
            disabled:opacity-60
          "
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}

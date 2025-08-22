
import React, {useContext, useState } from "react";
import {  NavLink, useLocation, useNavigate} from "react-router-dom";
import { MdEmail, MdLock } from "react-icons/md";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import AuthContext from "../Contexts/AuthContext";
import useTitle from "../hooks/useTitle";


export default function Login() {
    useTitle("Login | FoodHive");
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(""); // Add error state
    // const navigate = useNavigate();
    const { loginWithEmailPassword,handelLoginWithGoogle } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous error
        try {
            await loginWithEmailPassword(email, password);
             navigate(location?.state ? location.state : "/" );
        } catch (err) {
            // Remove "Firebase:" prefix from error message if present
            const cleanedMessage = err.message?.replace(/^Firebase:\s*/, "") || "Login failed. Please try again.";
            setError(cleanedMessage);
        }
    };

    const handleGoogleLogin = () => {
        handelLoginWithGoogle();
        navigate(location?.state ? location.state : "/" );
    };

    return (
        <div
            className="flex justify-center items-center min-h-screen bg-cover bg-center"
            style={{
                backgroundImage:
                    "url(https://cdn.pixabay.com/photo/2019/09/12/15/21/resort-4471852_1280.jpg)",
            }}
        >
            <div className="w-full max-w-md bg-white/10 border-2 border-white/20 backdrop-blur-lg shadow-lg text-white rounded-xl p-8">
                <form onSubmit={handleLogin}>
                    <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-2 h-11 rounded-full bg-white text-gray-800 font-semibold shadow hover:bg-gray-100 transition mb-6"
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                    </button>
                    <div className="relative w-full h-12 mb-6">
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-full bg-transparent border-2 border-white/20 rounded-full text-white px-5 pr-12 text-base outline-none placeholder-white"
                        />
                        <MdEmail className="absolute right-5 top-1/2 -translate-y-1/2 text-xl" />
                    </div>
                    <div className="relative w-full h-12 mb-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-full bg-transparent border-2 border-white/20 rounded-full text-white px-5 pr-12 text-base outline-none placeholder-white"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-10 top-1/2 -translate-y-1/2 text-xl text-white focus:outline-none"
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? (
                                <AiOutlineEyeInvisible />
                            ) : (
                                <AiOutlineEye />
                            )}
                        </button>
                        <MdLock className="absolute right-5 top-1/2 -translate-y-1/2 text-xl" />
                    </div>
                    {/* Error message below password */}
                    {error && (
                        <div className="text-red-200 text-sm mb-4 px-2">{error}</div>
                    )}
                    <div className="flex justify-between text-sm mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="accent-white mr-2"
                            />
                            Remember me
                        </label>
                        <a href="#" className="hover:underline">
                            Forgot password?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="w-full h-11 rounded-full bg-white text-gray-800 font-semibold shadow hover:bg-gray-100 transition mb-4"
                    >
                        Login
                    </button>
                    <div className="text-center text-sm">
                        <p>
                            Don't have an account?{" "}
                            <NavLink to={'/register'} className="font-semibold hover:underline">
                                Register
                            </NavLink>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

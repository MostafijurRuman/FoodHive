import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaImage, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContexts from "../Contexts/AuthContext";



export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        photo: "",
        password: "",
    });
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const{registerWithEmailPassword, updateUserProfile,setUser}=useContext(AuthContexts)

    const { name, email, photo, password } = form;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        if (e.target.name === "password") {
            validatePassword(e.target.value);
        }
    };

    const validatePassword = (pwd) => {
        if (pwd.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            return false;
        }
        if (!/[A-Z]/.test(pwd)) {
            setPasswordError("Password must contain an uppercase letter.");
            return false;
        }
        if (!/[a-z]/.test(pwd)) {
            setPasswordError("Password must contain a lowercase letter.");
            return false;
        }
        setPasswordError("");
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        registerWithEmailPassword(email,password)
        .then((result)=>{
            const user = result.user;
            setUser(user);
                updateUserProfile({displayName:name, photoURL:photo})
                .then(()=>{
                    navigate("/")
                })
                .catch(err => console.log(err))
        })
        .catch((err)=>{
            console.log(err)
        })
    };

    return (
        <div
            className="flex justify-center items-center min-h-screen bg-cover bg-center"
            style={{
                backgroundImage:
                    "url(https://cdn.pixabay.com/photo/2020/01/17/16/42/food-4773380_1280.jpg)",
            }}
        >
            <ToastContainer />
            <div className="w-full max-w-md bg-white/10 border-2 border-white/20 backdrop-blur-lg shadow-lg text-white rounded-xl p-8">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-3xl font-bold text-center mb-8">Register</h1>
                    <div className="relative w-full h-12 mb-6">
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Name"
                            required
                            className="w-full h-full bg-transparent border-2 border-white/20 rounded-full text-white px-5 pr-12 text-base outline-none placeholder-white"
                        />
                        <FaUser className="absolute right-5 top-1/2 -translate-y-1/2 text-xl" />
                    </div>
                    <div className="relative w-full h-12 mb-6">
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Email"
                            required
                            className="w-full h-full bg-transparent border-2 border-white/20 rounded-full text-white px-5 pr-12 text-base outline-none placeholder-white"
                        />
                        <FaEnvelope className="absolute right-5 top-1/2 -translate-y-1/2 text-xl" />
                    </div>
                    <div className="relative w-full h-12 mb-6">
                        <input
                            type="text"
                            name="photo"
                            value={form.photo}
                            onChange={handleChange}
                            placeholder="Photo URL"
                            required
                            className="w-full h-full bg-transparent border-2 border-white/20 rounded-full text-white px-5 pr-12 text-base outline-none placeholder-white"
                        />
                        <FaImage className="absolute right-5 top-1/2 -translate-y-1/2 text-xl" />
                    </div>
                    <div className="relative w-full h-12 mb-2">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            required
                            className={`w-full h-full bg-transparent border-2 border-white/20 rounded-full text-white px-5 pr-12 text-base outline-none placeholder-white ${passwordError ? "border-red-400" : ""}`}
                        />
                        <FaLock className="absolute right-5 top-1/2 -translate-y-1/2 text-xl" />
                        <button
                            type="button"
                            tabIndex={-1}
                            className="absolute right-12 top-1/2 -translate-y-1/2 text-xl bg-transparent border-none outline-none"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {passwordError && (
                        <div className="mb-4 text-red-300 text-xs px-2">{passwordError}</div>
                    )}
                    <button
                        type="submit"
                        className="w-full h-11 rounded-full bg-white text-gray-800 font-semibold shadow hover:bg-gray-100 transition mb-4"
                    >
                        Register
                    </button>
                    <div className="text-center text-sm">
                        <p>
                            Already have an account?{" "}
                            <NavLink to={"/login"} className="font-semibold hover:underline">
                                Login
                            </NavLink>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

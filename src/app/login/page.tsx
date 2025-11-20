"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, registerUser } from "@/lib/api";


export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "register">("login");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");


    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setErr(""); 
        setLoading(true);
        try {
            if (mode === "login") {
                await login(username, password);
                router.push("/dashboard");
            }
            else {
                await registerUser(username, password);
                router.push("/login");
            }
        } catch (e: any) {
            setErr(e?.message || "Error");
        } finally { 
            setLoading(false); 
        }
    };


    return (
        <div className="mx-auto max-w-sm card">
            <h1 className="mb-2 text-xl font-semibold">{mode === "login" ? "Login" : "Register"}</h1>
            <form className="grid gap-3" onSubmit={onSubmit}>
                <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn" disabled={!username || !password || loading}>
                    {loading ? "Please wait…" : (mode === "login" ? "Login" : "Create account")}
                </button>
                {err && <p className="text-red-600 text-sm">{err}</p>}
            </form>
            <p className="mt-3 text-sm">
                {mode === "login" ? (
                    <>No account? <button className="underline" onClick={() => setMode("register")}>Register</button></>
                ) : (
                    <>Have an account? <button className="underline" onClick={() => setMode("login")}>Login</button></>
                )}
            </p>
        </div>
    );
}
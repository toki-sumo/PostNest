// src/app/signup/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const SignupPage = () => {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    const validatePassword = (password: string) => {
        const minLength = 8
        const hasUpper = /[A-Z]/.test(password)
        const hasLower = /[a-z]/.test(password)
        const hasNumber = /[0-9]/.test(password)

        // if (password.length < minLength) return "Password must be at least 8 characters"
        // if (!hasUpper) return "Password must include at least one uppercase letter"
        // if (!hasLower) return "Password must include at least one lowercase letter"
        // if (!hasNumber) return "Password must include at least one number"
        // if (password !== confirmPassword) {
        //     return ("パスワードが一致しません")
        // }
        return null // OK
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        const error = validatePassword(password)
        if (error) {
            setError(error)
            return
        }
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        })

        if (res.ok) {
            router.push("/dashboard") // サインインページに遷移
        } else {
            const data = await res.json()
            setError(data.message || "Signup failed")
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
            <form onSubmit={handleSignup} className="space-y-4">
                <p>メールアドレス</p>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full border p-2"
                    required
                />
                <p>パスワード（大文字・小文字・数値を含む8文字以上）</p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full border p-2"
                    required
                />
                <p>パスワード（確認）</p>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    className="w-full border p-2"
                    required
                />

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-700">
                    Sign Up
                </button>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    )
}

export default SignupPage

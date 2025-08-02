'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import OAuthButton from '@/components/ui/OAuthButton'

const SignupPage = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')

    const validatePassword = (password: string) => {
        const hasUpper = /[A-Z]/.test(password)
        const hasLower = /[a-z]/.test(password)
        const hasNumber = /[0-9]/.test(password)
        const minLength = 8

        if (password.length < minLength) return '8文字以上にしてください'
        if (!hasUpper || !hasLower || !hasNumber) return '英大文字・小文字・数字を含めてください'
        if (password !== confirmPassword) return 'パスワードが一致しません'

        return null
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        const error = validatePassword(password)
        if (error) {
            setError(error)
            return
        }

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        if (res.ok) {
            router.push('/dashboard')
        } else {
            const data = await res.json()
            setError(data.message || 'Signup failed')
        }
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded">
            <h1 className="text-2xl font-bold mb-6">新規登録</h1>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
                <OAuthButton provider="google" />
                <OAuthButton provider="github" />
            </div>

            <div className="flex items-center mb-6">
                <hr className="flex-grow border-gray-300" />
                <span className="mx-4 text-gray-500">または</span>
                <hr className="flex-grow border-gray-300" />
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
                <div>
                    <p className="mb-1">メールアドレス</p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <p className="mb-1">パスワード（大文字・小文字・数字を含む8文字以上）</p>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <p className="mb-1">パスワード（確認）</p>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    アカウントを作成
                </button>
            </form>

            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    )
}

export default SignupPage

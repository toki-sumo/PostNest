'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import OAuthButton from '@/components/ui/OAuthButton'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'
import BackgroundDecoration from '@/components/common/BackgroundDecoration'

const SignupPage = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState<{
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({})

    // パスワードの強度チェック
    const validatePassword = (password: string) => {
        const hasUpper = /[A-Z]/.test(password)
        const hasLower = /[a-z]/.test(password)
        const hasNumber = /[0-9]/.test(password)
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
        const minLength = 8

        if (password.length < minLength) {
            return 'パスワードは8文字以上で入力してください。'
        }
        if (!hasUpper || !hasLower || !hasNumber) {
            return '英大文字・小文字・数字を含めてください。'
        }
        if (!hasSpecial) {
            return '特殊文字（!@#$%^&*(),.?":{}|<>）を含めてください。'
        }

        return null
    }

    // フォーム全体のバリデーション
    const validateForm = () => {
        const errors: { email?: string; password?: string; confirmPassword?: string } = {}
        
        // メールアドレスのバリデーション
        if (!email.trim()) {
            errors.email = 'メールアドレスを入力してください。'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = '有効なメールアドレスを入力してください。'
        }
        
        // パスワードのバリデーション
        const passwordError = validatePassword(password)
        if (passwordError) {
            errors.password = passwordError
        }
        
        // パスワード確認のバリデーション
        if (password !== confirmPassword) {
            errors.confirmPassword = 'パスワードが一致しません。'
        }
        
        setValidationErrors(errors)
        return Object.keys(errors).length === 0
    }

    // エラーをクリア
    const clearErrors = () => {
        setError("")
        setValidationErrors({})
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // フォームバリデーション
        if (!validateForm()) {
            return
        }

        setIsLoading(true)
        clearErrors()

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.trim(), password }),
            })

            if (res.ok) {
                // サインアップ成功
                router.push('/dashboard')
                router.refresh()
            } else {
                const data = await res.json()
                
                switch (data.error) {
                    case 'UserAlreadyExists':
                        setError('このメールアドレスは既に使用されています。')
                        break
                    case 'InvalidEmail':
                        setError('無効なメールアドレスです。')
                        break
                    case 'WeakPassword':
                        setError('パスワードが弱すぎます。')
                        break
                    default:
                        setError('サインアップ中にエラーが発生しました。もう一度お試しください。')
                        break
                }
            }
        } catch (error) {
            setError('予期せぬエラーが発生しました。もう一度お試しください。')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <BackgroundDecoration />
            
            <div className="relative z-10 flex items-center justify-center min-h-screen">
                <div className="w-full max-w-md mx-auto p-6">
                    {/* サインアップフォーム */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-600/30 p-8">
                        {/* ヘッダー */}
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2">新規登録</h1>
                            <p className="text-slate-300">PostNestアカウントを作成</p>
                        </div>

                        {/* エラーメッセージ */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    {error}
                                </div>
                            </div>
                        )}

                        {/* サインアップフォーム */}
                        <form onSubmit={handleSignup} className="space-y-6">
                            {/* メールアドレス */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                                    <svg className="w-4 h-4 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                    </svg>
                                    メールアドレス
                                </label>
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="example@example.com"
                                    className="w-full px-4 py-3 border border-slate-600/30 rounded-xl shadow-sm bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                />
                                {validationErrors.email && (
                                    <p className="mt-2 text-sm text-red-400 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        {validationErrors.email}
                                    </p>
                                )}
                            </div>

                            {/* パスワード */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                                    <svg className="w-4 h-4 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    パスワード
                                </label>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="パスワードを入力"
                                    className="w-full px-4 py-3 border border-slate-600/30 rounded-xl shadow-sm bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                />
                                {validationErrors.password && (
                                    <p className="mt-2 text-sm text-red-400 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        {validationErrors.password}
                                    </p>
                                )}
                            </div>

                            {/* パスワード確認 */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center">
                                    <svg className="w-4 h-4 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    パスワード確認
                                </label>
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="パスワードを再入力"
                                    className="w-full px-4 py-3 border border-slate-600/30 rounded-xl shadow-sm bg-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                />
                                {validationErrors.confirmPassword && (
                                    <p className="mt-2 text-sm text-red-400 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                        </svg>
                                        {validationErrors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {/* サインアップボタン */}
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-green-500/25 transform hover:scale-105"
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Spinner size={4} />
                                        <span className="ml-3">登録中...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        <span>アカウント作成</span>
                                    </div>
                                )}
                            </Button>
                        </form>

                        {/* 区切り線 */}
                        <div className="my-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-600/30"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-slate-800/50 text-slate-400">または</span>
                                </div>
                            </div>
                        </div>

                        {/* OAuthボタン */}
                        <div className="space-y-3">
                            <OAuthButton
                                provider="google"
                                className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-slate-500/25 transform hover:scale-105"
                            />
                            <OAuthButton
                                provider="github"
                                className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-slate-500/25 transform hover:scale-105"
                            />
                        </div>

                        {/* ログインリンク */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-400 text-sm">
                                既にアカウントをお持ちの方は
                                <a
                                    href="/signin"
                                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 ml-1"
                                >
                                    ログイン
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupPage

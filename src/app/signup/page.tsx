'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import OAuthButton from '@/components/ui/OAuthButton'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'

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
                
                // サーバーからのエラーメッセージを処理
                switch (data.error) {
                    case 'EMAIL_ALREADY_EXISTS':
                        setError('このメールアドレスは既に使用されています。')
                        break
                    case 'INVALID_EMAIL':
                        setError('無効なメールアドレスです。')
                        break
                    case 'WEAK_PASSWORD':
                        setError('パスワードが弱すぎます。より強力なパスワードを設定してください。')
                        break
                    case 'VALIDATION_ERROR':
                        setError('入力内容に問題があります。確認してください。')
                        break
                    default:
                        setError(data.message || 'アカウント作成に失敗しました。もう一度お試しください。')
                        break
                }
            }
        } catch (error) {
            console.error('Signup error:', error)
            setError('予期しないエラーが発生しました。もう一度お試しください。')
        } finally {
            setIsLoading(false)
        }
    }

    // 入力フィールドの変更時にエラーをクリア
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
        if (validationErrors.email) {
            setValidationErrors(prev => ({ ...prev, email: undefined }))
        }
        if (error) clearErrors()
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value)
        if (validationErrors.password) {
            setValidationErrors(prev => ({ ...prev, password: undefined }))
        }
        if (error) clearErrors()
    }

    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmPassword(e.target.value)
        if (validationErrors.confirmPassword) {
            setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }))
        }
        if (error) clearErrors()
    }

    return (
        <div className="min-h-screen pt-20 bg-gray-50">
            <div className="max-w-md mx-auto p-6 border rounded-lg shadow-lg bg-white">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">新規登録</h1>

                {/* OAuthボタン */}
                <div className="flex flex-col space-y-3 mb-6">
                    <OAuthButton provider="google" />
                    <OAuthButton provider="github" />
                </div>

                {/* 仕切り線 */}
                <div className="flex items-center mb-6">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-4 text-gray-500 text-sm">または</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                {/* メールアドレス登録フォーム */}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <Input
                            type="email"
                            placeholder="メールアドレス"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            disabled={isLoading}
                            className={validationErrors.email ? 'border-red-500' : ''}
                        />
                        {validationErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                        )}
                    </div>

                    <div>
                        <Input
                            type="password"
                            placeholder="パスワード"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            disabled={isLoading}
                            className={validationErrors.password ? 'border-red-500' : ''}
                        />
                        {validationErrors.password && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.password}</p>
                        )}
                        <p className="text-gray-600 text-xs mt-1">
                            8文字以上、英大文字・小文字・数字・特殊文字を含む
                        </p>
                    </div>

                    <div>
                        <Input
                            type="password"
                            placeholder="パスワード（確認）"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                            disabled={isLoading}
                            className={validationErrors.confirmPassword ? 'border-red-500' : ''}
                        />
                        {validationErrors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
                        )}
                    </div>

                    {/* エラーメッセージ */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {/* 登録ボタン */}
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full flex items-center justify-center space-x-2"
                    >
                        {isLoading ? (
                            <>
                                <Spinner size={16} />
                                <span>アカウント作成中...</span>
                            </>
                        ) : (
                            'アカウントを作成'
                        )}
                    </Button>
                </form>

                {/* ログインリンク */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600 text-sm">
                        既にアカウントをお持ちの方は{' '}
                        <a 
                            href="/signin" 
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            こちら
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignupPage

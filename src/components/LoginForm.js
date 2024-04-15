import { Button } from 'flowbite-react'
import { signIn } from 'next-auth/react'
import { useRef, useState } from 'react'

function LoginForm() {
  const loginRef = useRef()
  const [loginError, setLoginError] = useState('')

  // 일반 로그인을 처리하는 함수
  const handleLogin = async (event) => {
    event.preventDefault()

    const email = loginRef.current['email'].value
    const password = loginRef.current['password'].value

    try {
      const res = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (data.error) {
        setLoginError(data.error)
      } else {
        // NextAuth session handling here
        console.log('Login successful:', data)
      }
    } catch (error) {
      setLoginError('Login failed')
      console.error('You have an error in your code!', error)
    }
  }

  // 소셜 로그인을 처리하는 함수
  const handleSocialLogin = (provider) => {
    signIn(provider)
  }

  return (
    <form onSubmit={handleLogin} ref={loginRef} className="flex max-w-md flex-col gap-4">
      <div>
        <label htmlFor="email">Your email</label>
        <input id="email" type="email" required />
      </div>
      <div>
        <label htmlFor="password">Your password</label>
        <input id="password" type="password" required />
      </div>
      {loginError && <p>{loginError}</p>}
      <Button type="submit" className="bg-yellow-400">
        Log in
      </Button>
      <Button onClick={() => handleSocialLogin('google')} className="bg-red-500">
        Log in with Google
      </Button>
      <Button onClick={() => handleSocialLogin('kakao')} className="bg-yellow-500">
        Log in with Kakao
      </Button>
      <Button onClick={() => handleSocialLogin('naver')} className="bg-green-500">
        Log in with Naver
      </Button>
    </form>
  )
}
export default LoginForm

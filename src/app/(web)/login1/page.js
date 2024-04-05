'use client'

import { fetchExtended } from '@/utils/fetchExtended'
import { Button, Label, TextInput } from 'flowbite-react'
import { useRef } from 'react'

function Component() {
  const loginRef = useRef()
  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      email: loginRef.current?.elements.email.value,
      password: loginRef.current?.elements.password.value,
    }
    await fetchExtended('/store/login', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (typeof window !== 'undefined') {
          if (data.error) {
            alert(data.error)
          } else {
            alert('Login success')
            sessionStorage.setItem('token', data['token'])
          }
        }
      })
  }

  return (
    //   중간정렬
    <form className="flex max-w-md flex-col gap-4" onSubmit={handleSubmit} ref={loginRef}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="email" value="Your email" />
        </div>
        <TextInput id="email" type="email" placeholder="name@flowbite.com" required />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="password" value="Your password" />
        </div>
        <TextInput id="password" type="password" required />
      </div>
      <Button type="submit">Submit</Button>
    </form>
  )
}

export default Component

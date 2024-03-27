'use client'

import { Alert as FlowbiteAlert } from 'flowbite-react'

export function CustomAlert({ type, message }) {
  return <FlowbiteAlert color={type}>{message}</FlowbiteAlert>
}

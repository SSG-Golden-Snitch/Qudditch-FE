'use client'

import { Amplify } from 'aws-amplify'
import awsExports from '@/aws-exports'

Amplify.configure(awsExports)

export default function FaceLayout({ children }) {
  return <>{children}</>
}

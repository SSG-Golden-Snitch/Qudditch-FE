import MobileNavbar from '@/components/MobileNavbar'
import '@aws-amplify/ui-react/styles.css'

export default function MainLayout({ children }) {
  return (
    <>
      {children}
      <MobileNavbar />
    </>
  )
}

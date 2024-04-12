import MobileNavbar from '@/components/MobileNavbar'

export default function MainLayout({ children }) {
  return (
    <>
      {children}
      <MobileNavbar />
    </>
  )
}

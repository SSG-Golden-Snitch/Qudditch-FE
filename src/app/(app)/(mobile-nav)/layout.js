import MobileNavbar from '@/components/MoblieNavbar'

export default function MainLayout({ children }) {
  return (
    <>
      {children}
      <MobileNavbar />
    </>
  )
}

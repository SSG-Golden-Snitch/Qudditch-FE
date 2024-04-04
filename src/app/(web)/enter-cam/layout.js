import CameraDevicesProvider from '@/providers/CameraDevicesProvider'

const EnterCamLayout = ({ children }) => {
  return <CameraDevicesProvider>{children}</CameraDevicesProvider>
}

export default EnterCamLayout

import Navbar from '@/components/Navbar'
import { ReactNode } from 'react'

const RootLayout = ({children}: {children: ReactNode}) => {
  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
    </>
  )
}

export default RootLayout
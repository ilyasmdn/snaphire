import React, { ReactNode } from 'react'

const layout = ({children}: {children: ReactNode}) => {
  return (
    <div className='flex flex-col items-center justify-center mx-auto min-h-screen bg-background max-w-7xl max-sm:px-4 max-sm:py-8'>
      {children}
    </div>
  )
}

export default layout
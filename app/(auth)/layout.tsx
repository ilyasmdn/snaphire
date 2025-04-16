"use client";
import React, { ReactNode, useEffect } from 'react'

const layout = ({children}: {children: ReactNode}) => {
    useEffect(() => {
      const savedTheme = localStorage.getItem("theme");
  
      if (savedTheme === "dark") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    }, []);
  return (
    <div className='flex flex-col items-center justify-center mx-auto min-h-screen bg-background max-w-7xl max-sm:px-4 max-sm:py-8'>
      {children}
    </div>
  )
}

export default layout
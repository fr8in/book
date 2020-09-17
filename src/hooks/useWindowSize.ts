import { useState, useEffect } from 'react'

const useWindowSize = () => {
  const isClient = typeof window === 'object'

  const getSize = () => {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined
    }
  }

  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(() => {
    if (!isClient) {
      return null
    }

    function handleResize () {
      setWindowSize(getSize())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isClient]) // Empty array ensures that effect is only run on mount and unmount

  return windowSize
}

export default useWindowSize

// Usage
// function App () {
//   const size = useWindowSize()

//   return (
//     <div>
//       {size.width}px / {size.height}px
//     </div>
//   )
// }

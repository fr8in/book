import { useState } from 'react'

const useShowHideWithRecord = (initial) => {
  const [object, setObject] = useState(initial)

  const handleShow = (visibleKey, title, dataKey, data) => {
    setObject({ ...object, [dataKey]: data, title: title, [visibleKey]: true })
  }
  const handleHide = () => {
    setObject(initial)
  }

  return { object, handleShow, handleHide }
}

export default useShowHideWithRecord

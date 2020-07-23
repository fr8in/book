import { useState } from 'react'

const useShowHideWithRecord = (initial) => {
  const [object, setObject] = useState(initial)

  const handleShow = (visibleKey, title, dataKey, data) => {
    setObject({ ...object, [dataKey]: data, title: title, [visibleKey]: true })
  }
  const handleHide = () => {
    /**
     * Warning: If multiple model (model inside model) required
     * use your own useState and method for the second and third ... models
     * this hook reset all state value to Initial
     * so this is always suitable for single Model
     * */
    setObject(initial)
  }

  return { object, handleShow, handleHide }
}

export default useShowHideWithRecord

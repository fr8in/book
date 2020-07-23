import { useState } from 'react'

const useShowHide = (initial) => {
  const [visible, setVisible] = useState(initial)
  const onShow = (value) => {
    setVisible({ ...visible, [value]: true })
  }
  const onHide = () => {
    /**
     * Warning: If multiple model required
     * use your own useState and method for the second and third ... models
     * this hook reset all state value to Initial
     * so this is always suitable for single Model
     * */
    setVisible(initial)
  }
  const onToggle = (value) => {
    setVisible({ ...visible, [value]: !visible.value })
  }

  return { visible, onShow, onHide, onToggle }
}

export default useShowHide

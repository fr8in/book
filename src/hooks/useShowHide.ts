import { useState } from 'react'

const useShowHide = (initial) => {
  const [visible, setVisible] = useState(initial)
  const onShow = (value) => {
    setVisible({ ...visible, [value]: true })
  }
  const onHide = (value) => {
    setVisible({ ...visible, [value]: false })
  }
  const onToggle = (value) => {
    setVisible({ ...visible, [value]: !visible.value })
  }

  return { visible, onShow, onHide, onToggle }
}

export default useShowHide

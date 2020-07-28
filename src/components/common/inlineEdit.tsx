import React, { useState, useEffect, useRef, useCallback } from 'react'
import useKeypress from '../../hooks/useKeypress'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import { EditOutlined } from '@ant-design/icons'
import { message } from 'antd'
function InlineEdit (props) {
  const [isInputActive, setIsInputActive] = useState(false)
  const [inputValue, setInputValue] = useState(props.text)
  const [width, setWidth] = useState(140)

  const wrapperRef = useRef(null)
  const textRef = useRef(null)
  const inputRef = useRef(null)

  const enter = useKeypress('Enter')
  const esc = useKeypress('Escape')

  const { onSetText, text ,error,success} = props

  // check to see if the user clicked outside of this component
  useOnClickOutside(wrapperRef, () => {
    if (isInputActive) {
      setInputValue(text)
      setIsInputActive(false)
    }
  })

  const onEnter = useCallback(() => {
    if (enter) {
      if (inputValue) {
        onSetText(inputValue, 'Update Successfully', null)
        setIsInputActive(false)
      } else {
        onSetText(inputValue, null, 'Enter Valid input')
      }
    }
  }, [enter, inputValue, onSetText])

  const onEsc = useCallback(() => {
    if (esc) {
      setInputValue(text)
      setIsInputActive(false)
    }
  }, [esc, text])

  // get width of text element
  useEffect(() => {
    setWidth(prev => textRef.current ? textRef.current.clientWidth : prev)
  }, [textRef.current])

  // focus the cursor in the input field on edit start
  useEffect(() => {
    if (isInputActive) { inputRef.current.focus() }
  }, [isInputActive])

  // watch the Enter and Escape key presses
  useEffect(() => {
    if (isInputActive) {
      onEnter() // if Enter is pressed, save the text and close the editor
      onEsc() // if Escape is pressed, revert the text and close the editor
    }
  }, [onEnter, onEsc, isInputActive])

  const handleInputChange = useCallback(e => {
    setInputValue(e.target.value)
  },
  [setInputValue]
  )

  const handleSpanClick = useCallback(() => setIsInputActive(true), [
    setIsInputActive
  ])

  return (
    <span className='inline-wrapper' ref={wrapperRef}>
      <span
        ref={textRef}
        onClick={handleSpanClick}
        className={`inline-text-copy ${
          !isInputActive ? 'active' : 'hidden'
        }`}
      >
        {text}
        <EditOutlined />
      </span>
      <input
        ref={inputRef}
        // set the width to the input length multiplied by the x height
        // it's not quite right but gets it close
        style={{ minWidth: width }}
        value={inputValue}
  
        onChange={handleInputChange}
        className={`inline-text-input ${
          isInputActive ? 'active' : 'hidden'
        }`}
      />

 {error && message.error(error, 2)}
 {success && message.success(success, 2)}
    </span>
  )
}

export default InlineEdit

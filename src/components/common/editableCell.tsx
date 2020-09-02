import { Input, Space } from 'antd'
import { useState } from 'react'
import { EditTwoTone, CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'

const EditableCell = (props) => {
  const { label, onSubmit } = props

  const initial = { selectType: false }
  const { visible, onHide, onShow } = useShowHide(initial)

  const [inputValue, setinputValue] = useState(label)

  const onChange = (e) => {
    setinputValue(e.target.value)
  }

  const handleSubmit = () => {
    onSubmit(inputValue)
    onHide()
  }

  return (
    <div>
      {!visible.selectType ? (
        <label>
          {label}{' '}
          <EditTwoTone onClick={() => onShow('selectType')} />
        </label>)
        : (
          <span>
            <Input
              size='small'
              defaultValue={inputValue}
              style={{ width: '40%' }}
              onChange={onChange}
            />
            {' '}
            <Space>
              <CheckCircleTwoTone onClick={handleSubmit} twoToneColor='#52c41a' />
              <CloseCircleTwoTone onClick={onHide} />
            </Space>
          </span>)}
    </div>
  )
}

export default EditableCell
import { Input, Space } from 'antd'
import { useState } from 'react'
import { EditTwoTone, CloseCircleTwoTone, CheckCircleOutlined } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'

const EditableCell = (props) => {
  const { label, onSubmit } = props

  const initial = { selectType: false }
  const { visible, onHide, onShow } = useShowHide(initial)

  const [inputValue, setinputValue] = useState(null)

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
              style={{ width: '40%' }}
              onChange={onChange}
            />
            {' '}
            <Space>
              <CheckCircleOutlined onClick={handleSubmit} />
              <CloseCircleTwoTone onClick={onHide} />
            </Space>
          </span>)}
    </div>
  )
}

export default EditableCell

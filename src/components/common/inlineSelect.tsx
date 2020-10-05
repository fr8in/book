import { Select } from 'antd'
import { EditTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'

const InlineSelect = (props) => {
  const { label, value, options, handleChange, style } = props

  const initial = { selectType: false }
  const { visible, onHide, onShow } = useShowHide(initial)

  const onChange = (value) => {
    handleChange(value)
    setTimeout(() => {
      onHide()
    }, 1000)
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
            <Select
              size='small'
              style={style || {}}
              placeholder='Select Type'
              options={options}
              value={value}
              onChange={onChange}
              optionFilterProp='label'
              showSearch
            />{' '}
            <CloseCircleTwoTone onClick={onHide} />
          </span>)}
    </div>
  )
}

export default InlineSelect

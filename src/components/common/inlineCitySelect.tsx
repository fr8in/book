import { EditTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import CitySelect from './citySelect'

const InlineSelect = (props) => {
  const { label, handleChange, partner_id } = props

  const initial = { selectType: false }
  const { visible, onHide, onShow } = useShowHide(initial)

  const onChange = (city_id) => {
    handleChange(partner_id, city_id)
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
            <CitySelect
              size='small'
              onChange={onChange}
              showSearch
              width='90%'
            />{' '}
            <CloseCircleTwoTone onClick={onHide} />
          </span>)}
    </div>
  )
}

export default InlineSelect

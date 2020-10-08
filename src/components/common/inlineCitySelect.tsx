import { EditTwoTone, CloseCircleTwoTone } from '@ant-design/icons'
import useShowHide from '../../hooks/useShowHide'
import CitySelect from './citySelect'
import EditAccess from './editAccess'

const InlineSelect = (props) => {
  const { label, handleChange, partner_id,edit_access } = props

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
          <EditAccess edit_access={edit_access} onEdit={() => onShow('selectType')} />
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

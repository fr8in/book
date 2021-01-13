import InlineEdit from '../common/inlineEdit'
import InlineSelect from '../common/inlineSelect'


function InsuranceUpdate(props) {
    const { text, edit_access, record, type, updateInsurance, select, options } = props

    const handleUpdate = (value) => {
        updateInsurance(value, record, type)
    }

    return (
        <>{select ?
            <InlineSelect
                value={text}
                label={text}
                options={options}
                handleChange={handleUpdate}
                edit_access={edit_access}
                style={{ width: '80%' }}
            /> :
            <InlineEdit
                edit_access={edit_access}
                text={text}
                onSetText={handleUpdate}
            />}
        </>
    )
}

export default InsuranceUpdate

import EditableCell from '../common/editableCell'
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

            <EditableCell
            label={text }
            onSubmit={handleUpdate}
            edit_access={edit_access}
          />
            }
        </>
    )
}

export default InsuranceUpdate

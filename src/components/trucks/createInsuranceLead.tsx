import React, { useContext } from 'react'
import { message, Modal } from 'antd'
import { useMutation, gql } from '@apollo/client'
import moment from 'moment'
import userContext from '../../lib/userContaxt'
import get from 'lodash/get'


const CreateInsuranceLead = (props) => {

    const { record, onHide, visible } = props
    console.log("props data", props)

    const context = useContext(userContext)

    const CREATE_LEAD = gql`mutation create_insurance_lead($truck_id: Int!, $partner_id: Int!, $created_at: timestamp, $created_by: String, $status_id: Int) {
        insert_insurance(objects: {truck_id: $truck_id, partner_id: $partner_id, created_at: $created_at, created_by: $created_by, status_id: $status_id}) {
          affected_rows
        }
      }`

    const [create_insurance_lead] = useMutation(CREATE_LEAD, {
        onError(error) { message.error(error.toString()) },
        onCompleted(data) {
            if (data.insert_insurance.affected_rows = 1) {
                message.success("Created Successfully")
                onHide()
            }
        }
    })

    const create_lead = () => {
        create_insurance_lead({
            variables: {
                truck_id: get(record, 'id', null),
                partner_id: get(record, 'partner.id', null),
                created_at: moment().format("YYYY-MM-DD HH:MM:ss"),
                created_by: context.email,
                status_id: 1
            }
        }
        )
    }

    return (
        <Modal
            visible={visible}
            onOk={create_lead}
            onCancel={() => onHide()}>
            <p>Insurance Lead will get created. Do you want to proceed ?</p>
        </Modal>
    )
}


export default CreateInsuranceLead
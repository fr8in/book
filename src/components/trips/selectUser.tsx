import React from 'react'
import { Col, Form, Select } from 'antd'
import { gql, useQuery } from '@apollo/client'

const CUSTOMER_BILLING_ADDRESS_FOR_INVOICE = gql`
query{
    customer_user{
      id
      name
    }
  }
  `

  const SelectUser = (props) => {
    
    const { loading, error, data } = useQuery(
      CUSTOMER_BILLING_ADDRESS_FOR_INVOICE,
      {

      }
    )
    var customer_user = [];
    if (!loading) {
        customer_user = data && data.customer_user
      }
      console.log('customeruser', customer_user)

    const customeruser = customer_user.map((data) => {
        return { value: data.id, label: data.name };
      })

    return(
        <Col sm={12}>
        <Form.Item
          label='Users'
          initialValue={name}
        >
          <Select placeholder='Select Users' options={customeruser}  />
        </Form.Item>
      </Col>
    )

}

export default SelectUser

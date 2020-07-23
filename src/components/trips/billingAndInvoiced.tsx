import React from "react";
import { Modal, Button,Input } from "antd";
//import data from '../../../mock/trip/tripDetail'
  const BillingAndInvoiced = (props) => {
    const { visible, onHide } = props

    return (
      <> 
       <Modal
      title={
          "Billing & Invoice-" 
        }
      visible={visible}
      onCancel={onHide}
      footer={[
        <Input placeholder='Email Address' />,
      <Button type="primary"> Send Email </Button>,
      <Button > Close </Button>,
       ]}
      >
<Input placeholder='Email Address' />,
        
        </Modal>
      </>
    );
  }


export default BillingAndInvoiced;
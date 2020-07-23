import React from 'react'
import { Modal, Button } from 'antd'

const DeletePO = (props) => {
  const { visible, onHide } = props
  const handleDelete = () => {
    console.log('PO Delete request!')
  }
  return (
    <>
      <Modal
        title='Delete PO'
        visible={visible}
        onCancel={onHide}
        footer={[
          <Button key='back' onClick={onHide}>No</Button>,
          <Button key='submit' type='primary' onClick={handleDelete}>Yes</Button>
        ]}
      >
         Are you sure to Delete PO?
      </Modal>
    </>
  )
}

export default DeletePO

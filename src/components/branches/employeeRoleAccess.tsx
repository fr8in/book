import { Modal, Row, Col, Select, Form, Button, Table, message } from 'antd'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useState, useContext } from 'react'
import get from 'lodash/get'
import { DeleteTwoTone } from '@ant-design/icons'

const ALL_ROLE_QUERY = gql`
query all_roles {
    role{
      id
      name
    }
  }
`
const ADD_EMPLOYEE_ROLE = gql`
mutation insert_employee_role($employee_id:Int, $role_id:Int){
    insert_employee_role(objects: {employee_id: $employee_id, role_id: $role_id}) {
      returning {
        id
      }
    }
  }
`
const DELETE_EMPLOYEE_ROLE = gql`
mutation delete_employee_role($id:Int){
    delete_employee_role(where:{id:{_eq:$id}}){
      returning{
        id
      }
    }
  }
`
const EmployeeRoleAccess = (props) => {

    const { visible, onHide, employee_data, title, edit_access_delete } = props
    const [role_id, setRole_id] = useState(null)


    const { loading, data, error } = useQuery(
        ALL_ROLE_QUERY,
        {
            fetchPolicy: 'cache-and-network',
            notifyOnNetworkStatusChange: true
        }
    )


    const [insert_employee_role] = useMutation(
        ADD_EMPLOYEE_ROLE,
        {
            onError(error) { message.error(error.toString()) },
            onCompleted() {
                message.success('Added!!')
                onHide()
            }
        }
    )

    const [delete_employee_role] = useMutation(
        DELETE_EMPLOYEE_ROLE,
        {
            onError(error) { message.error(error.toString()) },
            onCompleted() {
                message.success('Added!!')
                onHide()
            }
        }
    )
    if (loading) return null

    const roles = get(data, 'role', null)


    const role_list = roles.map((role) => {
        return { value: role.id, label: role.name }
    })
    const onChange = (value) => {
        setRole_id(value)
    }

    const onAddEmployeeRole = () => {
        insert_employee_role({
            variables: {
                role_id: role_id,
                employee_id: employee_data.id
            }
        })
    }

    const onDeleteEmployeeRole = (record) => {
        delete_employee_role({
            variables: {
                id:record.id
            }
        })
    }

    const EmployeeRole = [
        {
            title: 'Role',
            dataIndex: 'name',
            width: '60%',
            render: (text, record) => get(record, 'role.name', null)
        },
        {
            title: 'Action',
            width: '40%',
            render: (record) => {
        
                return (
                    <Button
                        type="link"
                        icon={<DeleteTwoTone twoToneColor='#eb2f96' />}
                     onClick={() => onDeleteEmployeeRole(record)} 
                    />)
            }
        },
    ]

    return (
        <Modal
            visible={visible}
            title={` ${title} `}
            onCancel={onHide}
            style={{ top: 2 }}
            width={500}
            footer={[]}
        >
            <Form.Item name='employee'>
                <Row gutter={10}>
                    <Col flex='auto'>
                        <Select
                            placeholder='Select Type'
                            options={role_list}
                            optionFilterProp='label'
                            onChange={onChange}
                            showSearch
                        />
                    </Col>
                    <Col flex='100px'>
                        <Button
                            key='submit'
                            type='primary'
                            onClick={onAddEmployeeRole}
                        >
                            Add Role
              </Button>
                    </Col>
                </Row>
            </Form.Item>
            <Table
                columns={EmployeeRole}
                dataSource={employee_data.employee_roles}
                size='small'
                pagination={false}
                scroll={{ x: 360 }}
                rowKey={(record) => record.id}

            />


        </Modal>


    )
}
export default EmployeeRoleAccess
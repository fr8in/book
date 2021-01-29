import { Table } from "antd"
import Modal from "antd/lib/modal/Modal"
import get from 'lodash/get';
import EmployeeList from './fr8employeeEdit';

const EmployeeListModal = (props) => {
    const { employeeData, visible, onHide, title, edit_access, customer_id } = props
    const branch_id = get(employeeData[0], 'branch_employee.branch.id', null)
    console.log('employeeData',employeeData)
    const column = [
        {
            title: 'Truck group',
            dataIndex: 'name',
            width: '50%',
            render: (text, record) => record.truck_type_group.name
        },
        {
            title: 'Employee',
            dataIndex: 'employee',
            width: '50%',
            render: (text,record) => 
               <EmployeeList
                        employee={record.branch_employee.employee.name}
                        customer_branch_employee_id={record.id}
                        edit_access={edit_access}
                        branch_id={branch_id}
                        customer_id={customer_id}
                        truck_type_group_id={record.truck_type_group_id}
                        onHide={onHide}
                    />
        }]

    return (
        <Modal
            visible={visible}
            title={`${title} Traffic`}
            onCancel={onHide}
            style={{ top: 2 }}
            width={700}
            footer={[]}
        >
            <Table
                columns={column}
                dataSource={employeeData}
                size='small'
                pagination={false}
            />
        </Modal>
    )
}

export default EmployeeListModal

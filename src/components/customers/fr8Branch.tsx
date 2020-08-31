import { Table } from "antd";
import get from 'lodash/get'
import EmployeeList from './fr8employeeEdit'

const Fr8Branch = (props) => {
const {fr8Branch} =props
console.log('customer_fr8Branch',fr8Branch)

const column = [
    {  
      title: "Branch Name",
      dataIndex: "name",
      width: "50%"
    },
    {
      title: "Traffic",
      width: "50%",
      render: (record) => {
        const branch_employee = get(record,'branch_employees',null)
        const customer_branch_employees = get(record,'branch_employees[0].customer_branch_employees[0]',null)
        const branch_employees = get(record,'branch_employees[0].customer_branch_employees[0].branch_employee.employee',null)
        const employee = get(record,'branch_employees[0].employee',null)
        const emp = (branch_employee ? (customer_branch_employees ? branch_employees && branch_employees.name : ( employee ? employee && employee.name : null)) : null  ) 
        return (
          <div>
            <span>{emp}&nbsp; </span>
           <EmployeeList 
           />
          </div>)
      }
    }
  ];

  return (
    <>
    <Table
      columns={column}
      dataSource={fr8Branch}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ x: 800 }}
      pagination={false}
      //loading={loading}
    />
    </>
  );
};

export default Fr8Branch;

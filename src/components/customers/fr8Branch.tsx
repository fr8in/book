import { Table } from "antd";
// import branchData from "../../../mock/customer/branch";


const Fr8Branch = (props) => {
const {customer_fr8Branch} =props
console.log('customer_fr8Branch',customer_fr8Branch)

 const branchemployees= customer_fr8Branch.map(element => element.branch_employees[0]  &&  element.branch_employees[0].employee && element.branch_employees[0].employee.name );
 console.log('branchemployees',branchemployees); 
 
 const branch= customer_fr8Branch.map(element => element.branch_employees[0]  &&  element.branch_employees[0].customer_branch_employees[0] && 
  element.branch_employees[0].customer_branch_employees[0] && element.branch_employees[0].customer_branch_employees[0].branch_employee && 
  element.branch_employees[0].customer_branch_employees[0].branch_employee.employee && element.branch_employees[0].customer_branch_employees[0].branch_employee.employee.name);
 console.log('branch',branch); 

 const emp = branch ? branchemployees : null
 console.log('emp',emp)

const fr8Branch = [
    {  
      title: "Branch Name",
      dataIndex: "name",
      width: "50%"
    },
    {
      title: "Traffic",
      dataIndex: "branchemployees",
      width: "50%",
      render: (record) => {
        return (emp)
      }
    },
  ];

  return (
    <Table
      columns={fr8Branch}
      dataSource={customer_fr8Branch}
      rowKey={(record) => record.id}
      size="small"
      scroll={{ x: 800 }}
      pagination={false}
      //loading={loading}
    />
  );
};

export default Fr8Branch;

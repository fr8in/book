import { Modal, Button,Checkbox,Row } from 'antd';
import React from 'react'
import {FilterOutlined} from '@ant-design/icons'

function onChange(e) {
    console.log(`checked = ${e.target.checked}`);
  }
class FilterModel extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
         <FilterOutlined />
        </Button>
        <Modal
          visible={this.state.visible}
          onCancel={this.handleCancel}
        >  
        <Row>  
        <Checkbox onChange={onChange}>All</Checkbox>
        </Row>
        <Row>
        <Checkbox onChange={onChange}>jay@fr8.in</Checkbox>
        </Row>
        </Modal>
      </div>
    );
  }
}

export default FilterModel 
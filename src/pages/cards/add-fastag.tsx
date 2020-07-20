import { Form, Input, Button, Select, Space } from "antd";
import React from "react";
import { FormInstance } from "antd/lib/form";

const { Option } = Select;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 7 },
};
const tailLayout = {
  wrapperCol: { offset: 9, span: 12 },
};

class AddFastag extends React.Component {
  formRef = React.createRef<FormInstance>();

  onFinish = (values) => {
    console.log(values);
  };

  onReset = () => {
    this.formRef.current.resetFields();
  };

  onFill = () => {
    this.formRef.current.setFieldsValue({
      note: "Hello world!",
      gender: "male",
    });
  };

  render() {
    return (
      <Form
        {...layout}
        ref={this.formRef}
        name="control-ref"
        onFinish={this.onFinish}
      >
        <br />
        <br />
        <br />
        <Form.Item name="Tag Id" label="Tag Id" rules={[{ required: true }]}>
          <Input placeholder="Tag Id" />
        </Form.Item>
        <Form.Item
          name="Confirm Tag Id"
          label="Confirm Tag Id"
          rules={[{ required: true }]}
        >
          <Input placeholder="Confirm Tag Id" />
        </Form.Item>
        <Form.Item name="Partner" label="Partner" rules={[{ required: true }]}>
          <Select placeholder="Select Partner" allowClear>
            <Option value="Not Found">Not Found</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="Truck Number"
          label="Truck Number"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select Truck" allowClear>
            <Option value="Not Found">Not Found</Option>
          </Select>
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.gender !== currentValues.gender
          }
        >
          {({ getFieldValue }) => {
            return getFieldValue("gender") === "other" ? (
              <Form.Item
                name="customizeGender"
                label="Customize Gender"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            ) : null;
          }}
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={this.onReset}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    );
  }
}

export default AddFastag;

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

const AddFastag = () => {
  return (
    <Form {...layout} name="control-ref">
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
      ></Form.Item>
      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button htmlType="button">Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default AddFastag;

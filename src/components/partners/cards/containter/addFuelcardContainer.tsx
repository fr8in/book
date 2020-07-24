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

const AddFuelCard = () => {
  return (
    <Form {...layout} name="control-ref">
      <br />
      <br />
      <br />
      <Form.Item
        label="Card Provider"
        name="Card Provider"
        rules={[{ required: true }]}
      >
        <Select placeholder="Select Card Provider" allowClear>
          <Option value="Not Found">Not Found</Option>
        </Select>
      </Form.Item>
      <Form.Item name="Partner" label="Partner" rules={[{ required: true }]}>
        <Select placeholder="Select Partner" allowClear>
          <Option value="Not Found">Not Found</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="Partner Number"
        label="Partner Number"
        rules={[{ required: true }]}
      >
        <Input placeholder="Partner Number" />
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

export default AddFuelCard;

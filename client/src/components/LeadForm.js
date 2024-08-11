import React, { useEffect } from "react";
import { Form, Input, Button, Select, Row, Col, Space } from "antd";
import "./leadForm.css"
const { Option } = Select;

const LeadForm = ({ onSave, onClose, initialData }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSave(values);
      form.resetFields();
    });
  };

  return (
    <Form form={form} layout="vertical">
      <Row>
        <Col span={24}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input placeholder="Please Enter Name" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter the email" }]}
          >
            <Input placeholder="Please Enter Email" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="number"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter the phone number" },
            ]}
          >
            <Input placeholder="Please Enter Phone Number" />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item
            name="product"
            label="Product"
            rules={[{ required: true, message: "Please select a product" }]}
          >
            <Select placeholder="Select a product">
              <Option value="Product A">Product A</Option>
              <Option value="Product B">Product B</Option>
              <Option value="Product C">Product C</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={24} align="end">
         <Space>
         <Form.Item>
            <Button onClick={onClose} type="primary" ghost>
              Cancel
            </Button>
          </Form.Item>
          <Form.Item>
          <Button type="primary" onClick={handleSubmit} className="save-btn">
              Save
            </Button>
          </Form.Item>
         </Space>
        </Col>
      </Row>
    </Form>
  );
};

export default LeadForm;

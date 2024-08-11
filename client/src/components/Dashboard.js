import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Input,
  Drawer,
  Row,
  Col,
  Select,
  Table,
  message,
  Modal,
  Space,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import LeadForm from "./LeadForm";
import { getLeads, createLead, deleteLead, updateLead } from "../services/leadService";
import "./dashboard.css";

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const data = await getLeads();
    setLeads(data);
    setFilteredLeads(data);
  };

  
  const handleAddLead = () => {
    setEditingLead(null);
    setDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
  };

  const handleSaveLead = async (lead) => {
    try {
      const duplicateLead = leads.find(
        (existingLead) => existingLead.name.toLowerCase() === lead.name.toLowerCase()
      );
  
      if (duplicateLead && (!editingLead || duplicateLead._id !== editingLead._id)) {
        message.error("Name already exists");
        return;
      }
  
      if (editingLead) {
        await updateLead(editingLead._id, lead);
        message.success("Lead updated successfully!");
      } else {
        await createLead(lead);
        message.success("Lead created successfully!");
      }
  
      fetchLeads();
      setDrawerVisible(false);
    } catch (error) {
      message.error("Failed to save lead. Please try again later.");
      console.error("Error saving lead:", error);
    }
  };
  

  const handleSearch = (e) => {
    const value = e.target.value;
    if (!value) {
      setFilteredLeads(leads);
    } else {
      const normalizedValue = value.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
      const filtered = leads.filter(
        (lead) =>
          lead.name.toLowerCase().includes(normalizedValue) ||
          lead.email.toLowerCase().includes(normalizedValue) ||
          lead.product.toLowerCase().includes(normalizedValue) ||
          lead.number.toLowerCase().includes(normalizedValue)
      );
      setFilteredLeads(filtered);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    const sorted = [...filteredLeads].sort((a, b) =>
      a[value].localeCompare(b[value])
    );
    setFilteredLeads(sorted);
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setDrawerVisible(true);
  };

  const handleDelete = (leadId) => {
    confirm({
      title: "Are you sure you want to delete this lead?",
      onOk: async () => {
        await deleteLead(leadId);
        message.success("Lead deleted successfully!");
        fetchLeads();
      },
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "Product",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <span>
          <EditOutlined
            style={{ marginRight: 16, color: "#1890ff", cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          />
          <DeleteOutlined
            style={{ color: "#ff4d4f", cursor: "pointer" }}
            onClick={() => handleDelete(record._id)}
          />
        </span>
      ),
    },
  ];

  return (
    <Row className="dashboard">
      <Col span={24} className="header">
        <Typography className="headerText">Lead Management Application</Typography>
      </Col>
  <Row>
    <Col span={24} align="end" className="addlead">
    <Button type="primary" onClick={handleAddLead} className="lead-btn">
          Add Lead
        </Button>
    </Col>
  <Col span={24} align="end" className="selectSearchCol">
        <Space>
        
        <Search
          placeholder="Search leads..."
          onChange={handleSearch}
          style={{ width: 300 }}
          allowClear
        />
        <Select
          value={sortBy}
          onChange={handleSortChange}
          style={{ width: 135 }}
        >
          <Option value="name">Sort by Name</Option>
          <Option value="email">Sort by Email</Option>
          <Option value="product">Sort by Product</Option>
        </Select>
        </Space>
      </Col>
      <Col span={24}>
        <Table
          columns={columns}
          dataSource={filteredLeads.map((lead) => ({
            ...lead,
            key: lead._id,
          }))}
          pagination={{ pageSize: 5 }}
          className="table"
        />
      </Col>
      <Drawer
        title={editingLead ? "Edit Lead" : "Add New Lead"}
        placement="right"
        onClose={handleCloseDrawer}
        open={drawerVisible}
        width={600}
      >
        <LeadForm
          onSave={handleSaveLead}
          onClose={handleCloseDrawer}
          initialData={editingLead}
        />
      </Drawer>
  </Row>
    </Row>
  );
};

export default Dashboard;

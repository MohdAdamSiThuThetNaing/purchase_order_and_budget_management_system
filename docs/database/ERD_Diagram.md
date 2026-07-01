# 📊 Database ER Diagram

This document contains the Entity Relationship Diagram (ERD) for the Purchase Order Management System.

---

## 🧩 ER Diagram

![ER Diagram](./erd.png)

---

## 🏗️ Overview

The system is designed with the following core modules:

- Users & Authentication
- Organizations
- Projects
- Budget Management
- Purchase Orders
- Approval Workflow
- Notifications

---

## 🗄️ Key Entities

### 👤 Users

- Stores system users
- Linked to organization
- Handles roles (ADMIN, USER)

### 🏢 Organizations

- Top-level entity
- Contains users, projects, budgets

### 📁 Projects

- Belongs to organization
- Linked to purchase orders

### 💰 Budget System

- Budget Categories
- Budget Lines (allocated amounts)

### 🛒 Purchase Orders

- Core transactional entity
- Linked to:
  - Project
  - Vendor
  - Approvals
  - Items

### 🔁 Approval System

- Tracks approval workflow per PO
- Stores approver decisions

### 🔔 Notifications

- Sent to users for:
  - PO submitted
  - PO approved
  - PO rejected
  - Budget exceeded

---

## 🔗 Relationships Summary

- Organization → Users (1:M)
- Organization → Projects (1:M)
- Organization → Budgets (1:M)
- Project → Purchase Orders (1:M)
- Purchase Order → Items (1:M)
- Purchase Order → Approvals (1:M)
- User → Notifications (1:M)

---

## 📌 Notes

- All primary keys use UUID
- Foreign keys enforce referential integrity
- System supports scalable multi-tenant architecture

---

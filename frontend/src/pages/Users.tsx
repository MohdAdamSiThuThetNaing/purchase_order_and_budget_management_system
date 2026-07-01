import { useEffect, useState } from "react";

import { getUsers, createUser, deleteUser } from "../api/userApi";

import type { User, CreateUserRequest } from "../types/user";

import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";

import "../layouts/User.css";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadUsers();
    };

    fetchData();
  }, []);

  const handleCreate = async (request: CreateUserRequest) => {
    try {
      await createUser(request);
      await loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      await loadUsers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="user-page">
      <div className="user-header">
        <h1>Users</h1>
        <p>Manage users for your organization.</p>
      </div>

      <div className="user-card">
        <UserForm onSubmit={handleCreate} />
      </div>

      <div className="user-card">
        <UserTable users={users} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Users;

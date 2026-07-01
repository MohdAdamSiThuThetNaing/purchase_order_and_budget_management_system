import { useEffect, useState } from "react";
import axios from "axios";

import { getUsers, createUser, deleteUser } from "../api/userApi";
import type { User, CreateUserRequest } from "../types/user";

import UserTable from "../components/UserTable";
import UserForm from "../components/UserForm";

import "../layouts/User.css";

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        switch (err.response?.status) {
          case 401:
            setError("Please login first.");
            break;
          case 403:
            setError("You do not have permission to view users.");
            break;
          case 404:
            setError("User API not found.");
            break;
          case 500:
            setError("Server error.");
            break;
          default:
            setError(err.response?.data?.message ?? "Unable to load users.");
        }
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const handleCreate = async (request: CreateUserRequest) => {
    try {
      await createUser(request);
      await loadUsers();
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message ?? "Failed to create user.");
      } else {
        alert("Failed to create user.");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this user?")) {
      return;
    }

    try {
      await deleteUser(id);
      await loadUsers();
    } catch (err) {
      console.error(err);

      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message ?? "Failed to delete user.");
      } else {
        alert("Failed to delete user.");
      }
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
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <UserTable users={users} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
};

export default Users;

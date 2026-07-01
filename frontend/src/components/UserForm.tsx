import { useState } from "react";
import type { CreateUserRequest } from "../types/user";

interface Props {
  onSubmit: (data: CreateUserRequest) => Promise<void>;
}

const UserForm = ({ onSubmit }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roles, setRoles] = useState("USER");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      email,
      password,
      firstName,
      lastName,
      roles: roles.split(",").map((r) => r.trim()),
    });

    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setRoles("USER");
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <input
        className="user-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="user-input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        className="user-input"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        className="user-input"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <input
        className="user-input"
        placeholder="Roles (comma separated)"
        value={roles}
        onChange={(e) => setRoles(e.target.value)}
      />

      <button className="user-button" type="submit">
        Create User
      </button>
    </form>
  );
};

export default UserForm;

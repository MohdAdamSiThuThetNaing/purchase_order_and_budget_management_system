import { useEffect, useState } from "react";
import { getRoles } from "../api/roleApi";
import type { CreateUserRequest } from "../types/user";
import type { Role } from "../types/role";

interface Props {
  onSubmit: (data: CreateUserRequest) => Promise<void>;
}

const UserForm = ({ onSubmit }: Props) => {
  const [organizationId, setOrganizationId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState("");

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const data = await getRoles();
        setRoles(data);

        if (data.length > 0) {
          setSelectedRoleId(data[0].id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadRoles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSubmit({
      organizationId,
      email,
      password,
      firstName,
      lastName,
      roleIds: selectedRoleId ? [selectedRoleId] : [],
    });

    setOrganizationId("");
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");

    if (roles.length > 0) {
      setSelectedRoleId(roles[0].id);
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <input
        className="user-input"
        placeholder="Organization ID"
        value={organizationId}
        onChange={(e) => setOrganizationId(e.target.value)}
      />

      <input
        className="user-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="user-input"
        type="password"
        placeholder="Password"
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

      <select
        className="user-input"
        value={selectedRoleId}
        onChange={(e) => setSelectedRoleId(e.target.value)}
      >
        <option value="">Select Role</option>

        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>

      <button className="user-button" type="submit">
        Create User
      </button>
    </form>
  );
};

export default UserForm;

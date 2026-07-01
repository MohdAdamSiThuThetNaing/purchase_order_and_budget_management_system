import type { User } from "../types/user";

interface Props {
  users: User[];
  onDelete: (id: string) => void;
}

const UserTable = ({ users, onDelete }: Props) => {
  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={th}>Name</th>
          <th style={th}>Email</th>
          <th style={th}>Roles</th>
          <th style={th}>Status</th>
          <th style={th}>Action</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td style={td}>
              {user.firstName} {user.lastName}
            </td>

            <td style={td}>{user.email}</td>

            <td style={td}>{user.roles.map((role) => role.name).join(", ")}</td>

            <td style={td}>{user.isActive ? "Active" : "Inactive"}</td>

            <td style={td}>
              <button className="user-button" onClick={() => onDelete(user.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const th: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
  background: "#f5f5f5",
  textAlign: "left",
};

const td: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
};

export default UserTable;

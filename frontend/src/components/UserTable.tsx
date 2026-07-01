import type { User } from "../types/user";

interface Props {
  users: User[];
  onDelete: (id: string) => void;
}

const UserTable = ({ users, onDelete }: Props) => {
  if (!users.length) return <p>No users found.</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={th}>Name</th>
          <th style={th}>Email</th>
          <th style={th}>Roles</th>
          <th style={th}>Action</th>
        </tr>
      </thead>

      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td style={td}>
              {u.firstName} {u.lastName}
            </td>
            <td style={td}>{u.email}</td>
            <td style={td}>{u.roles?.join(", ")}</td>
            <td style={td}>
              <button onClick={() => onDelete(u.id)}>Delete</button>
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

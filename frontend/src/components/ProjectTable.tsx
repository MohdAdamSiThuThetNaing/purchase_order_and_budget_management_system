import type { Project } from "../types/project";

interface ProjectTableProps {
  projects: Project[];
  onDelete: (id: string) => void;
}

const ProjectTable = ({ projects, onDelete }: ProjectTableProps) => {
  if (!projects.length) {
    return <p>No projects found.</p>;
  }

  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 20,
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Name</th>
          <th style={thStyle}>Description</th>
          <th style={thStyle}>Status</th>
          <th style={thStyle}>Action</th>
        </tr>
      </thead>

      <tbody>
        {projects.map((project) => (
          <tr key={project.id}>
            <td style={tdStyle}>{project.name}</td>

            <td style={tdStyle}>{project.description ?? "-"}</td>

            <td style={tdStyle}>{project.active ? "Active" : "Inactive"}</td>

            <td style={tdStyle}>
              <button onClick={() => onDelete(project.id)} style={deleteBtn}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const thStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
  background: "#f5f5f5",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: "10px",
};

const deleteBtn: React.CSSProperties = {
  background: "red",
  color: "white",
  border: "none",
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "4px",
};

export default ProjectTable;

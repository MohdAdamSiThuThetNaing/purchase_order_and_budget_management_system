import type { Organization } from "../types/organization";

interface Props {
  organizations: Organization[];
  onDelete: (id: string) => void;
}

const OrganizationTable = ({ organizations, onDelete }: Props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th style={{ width: "120px" }}>Action</th>
        </tr>
      </thead>

      <tbody>
        {organizations.map((organization) => (
          <tr key={organization.id}>
            <td>{organization.name}</td>

            <td>
              <button onClick={() => onDelete(organization.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrganizationTable;

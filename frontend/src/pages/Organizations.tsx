import { useEffect, useState } from "react";
import OrganizationTable from "../components/OrganizationTable";

import {
  getOrganizations,
  createOrganization,
  deleteOrganization,
} from "../api/organizationApi";

import type { Organization } from "../types/organization";
import "./Organization.css";

const Organizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [name, setName] = useState("");

  const loadOrganizations = async () => {
    const data = await getOrganizations();
    setOrganizations(data);
  };

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getOrganizations();
        setOrganizations(data);
      } catch (error) {
        console.error("Failed to load organizations:", error);
      }
    };
    fetchOrganizations();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;

    await createOrganization({ name });

    setName("");
    loadOrganizations();
  };

  const handleDelete = async (id: string) => {
    await deleteOrganization(id);
    loadOrganizations();
  };

  return (
    <div className="organization-page">
      <div className="organization-header">
        <div>
          <h1>Organizations</h1>
          <p>Create and manage organizations.</p>
        </div>
      </div>

      <div className="organization-card">
        <div className="organization-toolbar">
          <input
            className="organization-input"
            placeholder="Organization Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <button className="organization-button" onClick={handleCreate}>
            Create Organization
          </button>
        </div>
      </div>

      <div className="organization-card">
        <OrganizationTable
          organizations={organizations}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Organizations;

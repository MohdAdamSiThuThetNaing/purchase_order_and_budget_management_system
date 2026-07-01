import { useEffect, useState } from "react";
import OrganizationTable from "../components/OrganizationTable";

import {
  getOrganizations,
  createOrganization,
  deleteOrganization,
} from "../api/organizationApi";

import type { Organization } from "../types/organization";
import "../layouts/Organization.css";

const Organizations = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const loadOrganizations = async () => {
    try {
      setError("");

      const data = await getOrganizations();
      setOrganizations(data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to load organizations.");
    }
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

    try {
      setError("");

      await createOrganization({ name });

      setName("");
      loadOrganizations();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("You do not have permission to create organizations.");
        setError("You do not have permission to create organizations.");
      } else {
        setError(
          err.response?.data?.message ?? "Failed to create organization."
        );
      }
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this organization?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteOrganization(id);

      loadOrganizations();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("You do not have permission to delete this organization.");
        setError("You do not have permission to delete this organization.");
      } else {
        const message =
          err.response?.data?.message ?? "Failed to delete organization.";

        alert(message);
        setError(message);
      }
    }
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
        {error && <div className="organization-error">{error}</div>}

        <OrganizationTable
          organizations={organizations}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Organizations;

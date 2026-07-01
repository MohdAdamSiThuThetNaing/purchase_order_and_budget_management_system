import { useEffect, useState } from "react";
import { getProjects, createProject, deleteProject } from "../api/projectApi";
import type { Project, CreateProjectRequest } from "../types/project";
import ProjectTable from "../components/ProjectTable";

import "../layouts/Project.css";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const loadProjects = async () => {
    try {
      setError("");

      const data = await getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to load projects.");
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setError("");

        const data = await getProjects();
        setProjects(data);
      } catch (err: any) {
        setError(err.response?.data?.message ?? "Failed to load projects.");
      }
    };

    fetchProjects();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setError("");

      const request: CreateProjectRequest = {
        name,
        description,
      };

      await createProject(request);

      setName("");
      setDescription("");

      await loadProjects();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("You do not have permission to create projects.");
        setError("You do not have permission to create projects.");
      } else {
        const message =
          err.response?.data?.message ?? "Failed to create project.";

        alert(message);
        setError(message);
      }
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteProject(id);

      await loadProjects();
    } catch (err: any) {
      if (err.response?.status === 403) {
        alert("You do not have permission to delete this project.");
        setError("You do not have permission to delete this project.");
      } else {
        const message =
          err.response?.data?.message ?? "Failed to delete project.";

        alert(message);
        setError(message);
      }
    }
  };

  return (
    <div className="project-page">
      <div className="project-header">
        <div>
          <h1>Projects</h1>
          <p>Manage your organization projects.</p>
        </div>
      </div>

      <div className="project-card">
        <div className="project-toolbar">
          <input
            className="project-input"
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <textarea
            className="project-textarea"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="project-button" onClick={handleCreate}>
            Create Project
          </button>
        </div>
      </div>

      <div className="project-card">
        {error && <div className="project-error">{error}</div>}

        <ProjectTable projects={projects} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Projects;

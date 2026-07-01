import { useEffect, useState } from "react";
import { getProjects, createProject, deleteProject } from "../api/projectApi";
import type { Project, CreateProjectRequest } from "../types/project";
import ProjectTable from "../components/ProjectTable";

import "./Project.css";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await loadProjects();
    };
    fetchData();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      const request: CreateProjectRequest = {
        name,
        description,
      };

      await createProject(request);

      setName("");
      setDescription("");

      await loadProjects();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      await loadProjects();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="project-page">
      <div className="project-header">
        <h1>Projects</h1>
        <p>Manage your organization projects.</p>
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
        <ProjectTable projects={projects} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Projects;

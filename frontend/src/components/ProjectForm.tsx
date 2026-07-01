import { useState } from "react";
import type { CreateProjectRequest } from "../types/project";

interface ProjectFormProps {
  onSubmit: (request: CreateProjectRequest) => Promise<void>;
}

const ProjectForm = ({ onSubmit }: ProjectFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    const request: CreateProjectRequest = {
      name,
      description,
    };

    await onSubmit(request);

    setName("");
    setDescription("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: 12,
        maxWidth: 500,
        marginBottom: 20,
      }}
    >
      <input
        placeholder="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Create Project</button>
    </form>
  );
};

export default ProjectForm;

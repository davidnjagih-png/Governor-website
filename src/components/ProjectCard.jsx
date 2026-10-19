import Photo from "./Photo";

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <Photo src={project.image} label="PROJECT PHOTO" alt={project.title} />
      <div className="project-body">
        <span className="chip">{String(project.category || "").toUpperCase()}</span>
        <h3>{project.title}</h3>
        <p className="muted small">
          {[project.ward, project.year].filter(Boolean).join(" · ")}
        </p>
        {project.result && (
          <p className="project-result"><strong>Result:</strong> {project.result}</p>
        )}
        {project.summary && <p className="project-summary">{project.summary}</p>}
      </div>
    </article>
  );
}

export default ProjectCard;

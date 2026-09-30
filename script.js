async function loadProjects() {
  const container = document.getElementById("project-list");

  try {
    const response = await fetch("/api/projects");
    const projects = await response.json();

    container.innerHTML = projects.map(project => `
      <article class="project-card">
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
        <p class="tech">${escapeHtml(project.tech)}</p>
        <a class="btn" href="${escapeAttr(project.link)}" target="_blank">View Project</a>
      </article>
    `).join("");
  } catch (error) {
    container.innerHTML = "<p>Unable to load projects.</p>";
  }
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}

loadProjects();
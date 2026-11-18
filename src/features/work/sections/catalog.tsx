import { requireWorkProject, workCategories, workProjects } from "../constants";
import ProjectCard from "../components/ProjectCard";

export default function Catalog() {
  const filters = [
    { id: "all", label: "All", count: workProjects.length, selected: true },
    ...workCategories.map((category) => ({
      id: category.id,
      label: category.id === "uiux" ? "UI/UX" : category.title,
      count: category.projectIds.length,
      selected: false,
    })),
  ];

  return (
    <div className="work-catalog">
      <div className="work-filter-bar">
        <div
          className="work-chips"
          role="group"
          aria-label="Category preview filters"
          aria-describedby="work-filter-status"
        >
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={filter.selected ? "work-chip work-chip--active" : "work-chip"}
              type="button"
              disabled
              aria-pressed={filter.selected}
            >
              {filter.label} <span className="work-chip-count">{filter.count}</span>
            </button>
          ))}
        </div>
        <p id="work-filter-status" className="work-filter-status">
          Category filters are unavailable in this layout preview.
        </p>
      </div>

      <div className="work-categories">
        {workCategories.map((category) => (
          <section
            key={category.id}
            className="work-category"
            data-category={category.id}
            aria-labelledby={`work-category-${category.id}`}
          >
            <div className="work-category-head">
              <h2 className="work-category-title" id={`work-category-${category.id}`}>
                {category.title}
              </h2>
              <p className="work-category-description">{category.description}</p>
            </div>
            <div className="work-project-grid">
              {category.projectIds.map((projectId) => (
                <ProjectCard key={projectId} project={requireWorkProject(projectId)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

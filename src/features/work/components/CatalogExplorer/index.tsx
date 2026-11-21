"use client";

import { memo, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import ProjectCard from "../ProjectCard";
import { selectWorkCategories } from "./filter";
import type { WorkCategory, WorkFilterId, WorkProject } from "../../types";

type CatalogExplorerProps = Readonly<{
  categories: readonly WorkCategory[];
  projects: readonly WorkProject[];
}>;

type FilterBarProps = Readonly<{
  active: WorkFilterId;
  categories: readonly WorkCategory[];
  totalUnique: number;
  onSelect: (id: WorkFilterId) => void;
}>;

function FilterBar({ active, categories, totalUnique, onSelect }: FilterBarProps) {
  const options: readonly { id: WorkFilterId; label: string; count: number }[] = [
    { id: "all", label: "All", count: totalUnique },
    ...categories.map((category) => ({
      id: category.id,
      label: category.title,
      count: category.projectIds.length,
    })),
  ];

  return (
    <div className="work-chips" role="group" aria-label="Work category filters">
      {options.map((option) => (
        <Button
          key={option.id}
          variant="chip"
          size="sm"
          className="work-chip"
          data-filter={option.id}
          aria-pressed={option.id === active}
          onClick={() => onSelect(option.id)}
        >
          {option.label} <span className="work-chip-count">{option.count}</span>
        </Button>
      ))}
    </div>
  );
}

function CategorySection({
  category,
  projectsById,
  hidden,
}: Readonly<{ category: WorkCategory; projectsById: ReadonlyMap<string, WorkProject>; hidden: boolean }>) {
  return (
    <section
      className="work-category"
      data-category={category.id}
      hidden={hidden}
      aria-labelledby={`work-category-${category.id}`}
    >
      <div className="work-category-head">
        <h2 className="work-category-title" id={`work-category-${category.id}`}>
          {category.title}
        </h2>
        <p className="work-category-description">{category.description}</p>
      </div>
      <div className="work-project-grid">
        {category.projectIds.map((projectId) => {
          const project = projectsById.get(projectId);
          if (!project) throw new Error(`Unknown Work project in category: ${projectId}`);
          return <ProjectCard key={projectId} project={project} />;
        })}
      </div>
    </section>
  );
}

const MemoCategorySection = memo(CategorySection);

export default function CatalogExplorer({ categories, projects }: CatalogExplorerProps) {
  const [active, setActive] = useState<WorkFilterId>("all");
  const filterBarRef = useRef<HTMLDivElement>(null);

  const onSelect = (id: WorkFilterId) => {
    setActive(id);
    if (filterBarRef.current) {
      const top = Math.max(0, filterBarRef.current.getBoundingClientRect().top + window.scrollY - 90);
      window.scrollTo({
        top,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    }
  };

  const projectsById = useMemo(() => new Map(projects.map((project) => [project.id, project])), [projects]);
  const visibleCategories = selectWorkCategories(categories, active);

  return (
    <div className="work-catalog">
      <div className="work-filter-bar" ref={filterBarRef}>
        <FilterBar active={active} categories={categories} totalUnique={projects.length} onSelect={onSelect} />
      </div>
      <div className="work-categories">
        {categories.map((category) => (
          <MemoCategorySection
            key={category.id}
            category={category}
            projectsById={projectsById}
            hidden={!visibleCategories.includes(category)}
          />
        ))}
      </div>
    </div>
  );
}

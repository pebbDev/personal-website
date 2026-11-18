import { workCategories, workProjects } from "../constants";
import CatalogExplorer from "../components/CatalogExplorer";

export default function Catalog() {
  return <CatalogExplorer categories={workCategories} projects={workProjects} />;
}

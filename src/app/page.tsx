import PagePlaceholder from "@/components/common/page-placeholder";
import { getRoute } from "@/lib/routing/routes";

export default function HomePage() {
  return <PagePlaceholder route={getRoute("index.html")!} />;
}

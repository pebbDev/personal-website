import PagePlaceholder from "@/components/common/page-placeholder";
import { previewData } from "./constants";

export default function Work() {
  return (
    <div className="page-preview-frame">
      <PagePlaceholder {...previewData} />
    </div>
  );
}

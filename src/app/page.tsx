import Home from "@/features/home/home";
import PreviewSwitch from "@/components/layout/preview-switch";

export default function HomePage() {
  return <PreviewSwitch home={<Home />} />;
}

import Home from "@/features/home/home";
import PreviewSwitch from "@/features/home/components/preview-switch";

export default function HomePage() {
  return <PreviewSwitch home={<Home />} />;
}

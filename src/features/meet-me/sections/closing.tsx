import ClosingSection from "@/components/layout/ClosingSection";

export default function Closing({ heading }: Readonly<{ heading: string }>) {
  return (
    <ClosingSection
      className="meet-me-closing"
      heading={heading}
      primary={{ kind: "link", label: "See my work", href: "#work" }}
      secondary={{ kind: "disabled", label: "Say Hi 💬" }}
    />
  );
}

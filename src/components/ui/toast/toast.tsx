type ToastProps = {
  message: string;
  kind?: "info" | "error";
};

export default function Toast({ message, kind = "info" }: ToastProps) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className="rounded-xl border border-outline bg-white px-4 py-3 text-sm text-ink"
    >
      {message}
    </div>
  );
}

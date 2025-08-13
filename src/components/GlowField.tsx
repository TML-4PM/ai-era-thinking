import React from "react";

const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const GlowField: React.FC = () => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (prefersReduced()) return;
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--gx", `${x}px`);
      el.style.setProperty("--gy", `${y}px`);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(300px_300px_at_var(--gx,50%)_var(--gy,50%),#000,transparent_60%)]"
      style={{
        background: "radial-gradient(600px 600px at var(--gx,50%) var(--gy,50%), hsl(var(--brand)/0.18), transparent 40%), radial-gradient(800px 800px at 80% 20%, hsl(var(--brand-2)/0.2), transparent 50%)",
        transition: "var(--transition-smooth)",
      }}
    />
  );
};

export default GlowField;

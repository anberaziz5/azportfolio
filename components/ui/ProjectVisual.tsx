export function ProjectVisual({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full w-full overflow-hidden [&>div]:h-full [&>div]:min-h-0 [&>div]:w-full [&>div]:rounded-none">
      {children}
    </div>
  );
}

import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4">
        <span className="text-sm font-semibold tracking-tight">Todo Agent</span>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">
          Project setup is complete. The dashboard design comes next.
        </p>
      </main>
    </div>
  );
}

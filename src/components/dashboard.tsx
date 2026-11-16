import {
  AlertTriangle,
  Bot,
  Check,
  Clock,
  Loader2,
  MessageCircleQuestion,
  Plus,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Task, TaskCategory } from "@/lib/db";
import { cn } from "@/lib/utils";

const COLUMNS: {
  category: TaskCategory;
  title: string;
  hint: string;
  icon: LucideIcon;
}[] = [
  {
    category: "agent",
    title: "Agent can do",
    hint: "Handled for you, start to finish",
    icon: Bot,
  },
  {
    category: "together",
    title: "Do together",
    hint: "The agent asks you first",
    icon: Users,
  },
  {
    category: "you",
    title: "Only you",
    hint: "Yours to do",
    icon: User,
  },
];

function formatMinutes(total: number) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  if (hours === 0) return `${minutes}m`;
  return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
}

export function Dashboard({ tasks, week }: { tasks: Task[]; week: number[] }) {
  const savedToday = tasks.reduce((sum, t) => sum + t.saved_minutes, 0);
  const finishedByAgent = tasks.filter(
    (t) => t.status === "done" && t.category !== "you",
  ).length;
  const ready = tasks.filter(
    (t) => t.category === "agent" && t.status === "todo",
  ).length;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-16 sm:px-6">
      <header className="flex items-center justify-between py-5">
        <div className="flex items-center gap-2.5">
          <span className="flex size-7 items-center justify-center rounded-lg bg-brand text-brand-foreground">
            <Sparkles className="size-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Todo Agent
          </span>
        </div>
        <ThemeToggle />
      </header>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              What needs doing today?
            </h1>
            <p className="mt-2 text-muted-foreground">
              Write anything. The agent sorts it and takes what it can off your
              plate.
            </p>
          </div>
          <form className="flex items-center gap-2 rounded-2xl bg-card p-2 shadow-sm ring-1 ring-foreground/10 focus-within:ring-2 focus-within:ring-brand/60">
            <Input
              aria-label="New task"
              placeholder="Add a task, for example “Find a birthday gift for Sara”"
              className="h-10 flex-1 border-0 bg-transparent text-base shadow-none focus-visible:ring-0 dark:bg-transparent"
            />
            <Button type="submit" size="lg" className="h-10 rounded-xl px-4">
              <Plus />
              Add task
            </Button>
          </form>
        </div>

        <TimeSaved
          savedToday={savedToday}
          finished={finishedByAgent}
          week={week}
        />
      </section>

      <section className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-brand/[0.07] p-4 ring-1 ring-brand/20 sm:flex-row sm:items-center sm:px-5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
            <Zap className="size-4" />
          </span>
          <div>
            <p className="text-sm font-medium">
              {ready} {ready === 1 ? "task is" : "tasks are"} ready for the
              agent
            </p>
            <p className="text-sm text-muted-foreground">
              Each one gets its own sub-agent. A reviewer checks everything
              before it is marked complete.
            </p>
          </div>
        </div>
        <Button
          size="lg"
          className="h-11 w-full rounded-xl bg-brand px-6 text-base text-brand-foreground shadow-lg shadow-brand/25 hover:bg-brand/90 sm:w-auto"
        >
          <Sparkles />
          Get it done
        </Button>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-3">
        {COLUMNS.map((column) => {
          const items = tasks.filter((t) => t.category === column.category);
          return (
            <div key={column.category} className="flex min-w-0 flex-col gap-3">
              <div className="flex items-center gap-2.5 px-1">
                <column.icon className="size-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold tracking-tight">
                  {column.title}
                </h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
                  {items.length}
                </span>
              </div>
              <p className="-mt-2 px-1 text-xs text-muted-foreground">
                {column.hint}
              </p>
              {items.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          );
        })}
      </section>
    </div>
  );
}

function TimeSaved({
  savedToday,
  finished,
  week,
}: {
  savedToday: number;
  finished: number;
  week: number[];
}) {
  const days = [...week, savedToday];
  const max = Math.max(...days, 1);

  return (
    <div className="flex flex-col justify-between gap-5 rounded-2xl bg-card p-5 shadow-sm ring-1 ring-foreground/10">
      <div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-3.5" />
          Time saved today
        </p>
        <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums">
          {formatMinutes(savedToday)}
        </p>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {finished} {finished === 1 ? "task" : "tasks"} finished with the
          agent
        </p>
      </div>
      <div>
        <div
          className="flex h-10 items-end gap-1.5"
          role="img"
          aria-label="Time saved on each of the last seven days"
        >
          {days.map((minutes, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-sm",
                i === days.length - 1 ? "bg-brand" : "bg-foreground/15",
              )}
              style={{ height: `${Math.max((minutes / max) * 100, 6)}%` }}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Last 7 days</p>
      </div>
    </div>
  );
}

function TaskCard({ task }: { task: Task }) {
  const done = task.status === "done";

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-xl bg-card p-4 shadow-sm ring-1 ring-foreground/10 transition-shadow hover:shadow-md",
        done && "bg-card/60 shadow-none hover:shadow-none",
        task.status === "attention" && "ring-amber-500/40",
      )}
    >
      <div className="flex items-start gap-3">
        {task.category === "you" && (
          <span
            className={cn(
              "mt-0.5 flex size-4.5 shrink-0 items-center justify-center rounded-full border",
              done
                ? "border-transparent bg-emerald-600 text-white dark:bg-emerald-500 dark:text-black"
                : "border-foreground/30",
            )}
          >
            {done && <Check className="size-3" strokeWidth={3} />}
          </span>
        )}
        <div className="min-w-0">
          <h3
            className={cn(
              "text-sm leading-snug font-medium",
              done && "text-muted-foreground line-through decoration-1",
            )}
          >
            {task.title}
          </h3>
          {task.reason && (
            <p className="mt-1 text-xs text-muted-foreground">{task.reason}</p>
          )}
        </div>
      </div>

      {task.status === "question" && task.question && (
        <div className="rounded-lg bg-brand/[0.07] p-3 ring-1 ring-brand/15">
          <p className="flex items-start gap-2 text-sm">
            <MessageCircleQuestion className="mt-0.5 size-4 shrink-0 text-brand" />
            {task.question}
          </p>
          <div className="mt-2.5 flex gap-2">
            <Input
              aria-label="Your answer"
              placeholder="Type your answer"
              className="h-8 bg-background"
            />
            <Button size="default">Reply</Button>
          </div>
        </div>
      )}

      {task.status === "attention" && task.review_notes && (
        <p className="rounded-lg bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
          Reviewer: {task.review_notes}
        </p>
      )}

      <div className="flex items-center justify-between gap-2">
        <StatusChip task={task} />
        <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
          <Clock className="size-3" />
          {done && task.saved_minutes > 0
            ? `Saved ${formatMinutes(task.saved_minutes)}`
            : `About ${formatMinutes(task.estimate_minutes)}`}
        </span>
      </div>
    </article>
  );
}

function StatusChip({ task }: { task: Task }) {
  const chip =
    "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium";

  switch (task.status) {
    case "running":
      return (
        <span className={cn(chip, "bg-brand/10 text-brand")}>
          <Loader2 className="size-3 animate-spin" />
          Sub-agent working
        </span>
      );
    case "review":
      return (
        <span className={cn(chip, "bg-sky-500/10 text-sky-700 dark:text-sky-300")}>
          <ShieldCheck className="size-3" />
          Being reviewed
        </span>
      );
    case "done":
      return (
        <span
          className={cn(
            chip,
            "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
          )}
        >
          <Check className="size-3" strokeWidth={3} />
          {task.category === "you" ? "Done" : "Reviewed and complete"}
        </span>
      );
    case "attention":
      return (
        <span
          className={cn(
            chip,
            "bg-amber-500/10 text-amber-800 dark:text-amber-300",
          )}
        >
          <AlertTriangle className="size-3" />
          Needs your attention
        </span>
      );
    case "question":
      return (
        <span className={cn(chip, "bg-brand/10 text-brand")}>
          Waiting for your answer
        </span>
      );
    default:
      return (
        <span className={cn(chip, "bg-muted text-muted-foreground")}>
          {task.category === "agent" ? "Ready" : "To do"}
        </span>
      );
  }
}

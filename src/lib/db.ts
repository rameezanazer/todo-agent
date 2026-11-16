import fs from "node:fs";
import path from "node:path";

import Database from "better-sqlite3";

export type TaskCategory = "agent" | "together" | "you";

export type TaskStatus =
  | "todo" // waiting to be worked on
  | "question" // "do together": the agent is waiting for your answer
  | "running" // a sub-agent is working on it
  | "review" // the reviewer agent is checking the result
  | "done" // approved and complete
  | "attention"; // failed review twice, needs you

export interface Task {
  id: number;
  title: string;
  category: TaskCategory;
  reason: string | null;
  estimate_minutes: number;
  status: TaskStatus;
  question: string | null;
  answer: string | null;
  result: string | null;
  review_notes: string | null;
  saved_minutes: number;
  created_at: string;
  completed_at: string | null;
}

const DB_PATH =
  process.env.TODO_DB_PATH ?? path.join(process.cwd(), "data", "todo.db");

let instance: Database.Database | undefined;

export function getDb(): Database.Database {
  if (instance) return instance;

  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  const db = new Database(DB_PATH);
  // WAL lets several sub-agents save results at the same time safely.
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      title            TEXT NOT NULL,
      category         TEXT NOT NULL CHECK (category IN ('agent', 'together', 'you')),
      reason           TEXT,
      estimate_minutes INTEGER NOT NULL DEFAULT 0,
      status           TEXT NOT NULL DEFAULT 'todo'
                       CHECK (status IN ('todo', 'question', 'running', 'review', 'done', 'attention')),
      question         TEXT,
      answer           TEXT,
      result           TEXT,
      review_notes     TEXT,
      saved_minutes    INTEGER NOT NULL DEFAULT 0,
      created_at       TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at     TEXT
    );
  `);

  instance = db;
  return db;
}

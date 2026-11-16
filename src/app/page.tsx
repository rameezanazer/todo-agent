import { Dashboard } from "@/components/dashboard";
import { sampleTasks, sampleWeek } from "@/lib/sample-data";

export default function Home() {
  return <Dashboard tasks={sampleTasks} week={sampleWeek} />;
}

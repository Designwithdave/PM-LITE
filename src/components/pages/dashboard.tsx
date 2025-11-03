import React, { useState, useEffect } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import DashboardGrid from "../dashboard/DashboardGrid";
import TaskBoard from "../dashboard/TaskBoard";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  assignee?: {
    name: string;
    avatar: string;
  };
}

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design System Updates",
      description: "Update component library with new design tokens",
      status: "todo",
      assignee: {
        name: "Alice Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      },
    },
    {
      id: "2",
      title: "API Integration",
      description: "Integrate new backend endpoints",
      status: "in-progress",
      assignee: {
        name: "Bob Johnson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      },
    },
    {
      id: "3",
      title: "User Testing",
      description: "Conduct user testing sessions",
      status: "done",
      assignee: {
        name: "Carol Williams",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
      },
    },
  ]);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
    };
    setTasks(prev => [task, ...prev]);
  };

  const handleTaskMove = (taskId: string, newStatus: Task["status"]) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 pt-4 pb-2 flex justify-end">
            <Button 
              onClick={handleRefresh} 
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm transition-colors flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? "Loading..." : "Refresh Dashboard"}
            </Button>
          </div>
          <div className={cn(
            "container mx-auto p-6 space-y-8",
            "transition-all duration-300 ease-in-out"
          )}>
            <DashboardGrid key={`grid-${refreshKey}`} isLoading={loading} />
            <TaskBoard 
              key={`tasks-${refreshKey}`}
              tasks={tasks}
              onAddTask={handleAddTask}
              onTaskMove={handleTaskMove}
              isLoading={loading} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
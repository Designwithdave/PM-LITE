import React, { useState, useEffect, useCallback } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import DashboardGrid from "../dashboard/DashboardGrid";
import TaskBoard from "../dashboard/TaskBoard";
import ExpenseList from "../expenses/ExpenseList";
import ExpenseSummary from "../expenses/ExpenseSummary";
import ExpenseForm from "../expenses/ExpenseForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { useToast } from "@/components/ui/use-toast";
import type { Expense } from "@/types/expense";

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
  const { user } = useAuth();
  const { toast } = useToast();
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

  // Expenses state
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const fetchExpenses = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("date", { ascending: false })
        .limit(5);

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((prev) => prev + 1);
    fetchExpenses();
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleTaskMove = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  };

  const handleAddExpense = async (
    expenseData: Omit<Expense, "id" | "user_id" | "created_at" | "updated_at">,
  ) => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert([expenseData])
        .select()
        .single();

      if (error) throw error;

      setExpenses([data, ...expenses]);
      setIsExpenseDialogOpen(false);
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
      fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast({
        title: "Error",
        description: "Failed to add expense",
        variant: "destructive",
      });
    }
  };

  const handleUpdateExpense = async (
    expenseData: Omit<Expense, "id" | "user_id" | "created_at" | "updated_at">,
  ) => {
    if (!editingExpense) return;

    try {
      const { data, error } = await supabase
        .from("expenses")
        .update({ ...expenseData, updated_at: new Date().toISOString() })
        .eq("id", editingExpense.id)
        .select()
        .single();

      if (error) throw error;

      setExpenses(
        expenses.map((exp) => (exp.id === editingExpense.id ? data : exp)),
      );
      setEditingExpense(null);
      setIsExpenseDialogOpen(false);
      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
      fetchExpenses();
    } catch (error) {
      console.error("Error updating expense:", error);
      toast({
        title: "Error",
        description: "Failed to update expense",
        variant: "destructive",
      });
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) throw error;

      setExpenses(expenses.filter((exp) => exp.id !== id));
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
      fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast({
        title: "Error",
        description: "Failed to delete expense",
        variant: "destructive",
      });
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsExpenseDialogOpen(true);
  };

  const handleExpenseDialogClose = () => {
    setIsExpenseDialogOpen(false);
    setEditingExpense(null);
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
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              {loading ? "Loading..." : "Refresh Dashboard"}
            </Button>
          </div>
          <div
            className={cn(
              "container mx-auto p-6 space-y-8",
              "transition-all duration-300 ease-in-out",
            )}
          >
            <DashboardGrid key={`grid-${refreshKey}`} isLoading={loading} />

            {/* Expenses Section */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ExpenseSummary expenses={expenses} />
              </div>
              <div className="lg:col-span-2">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Recent Expenses</CardTitle>
                      <Dialog
                        open={isExpenseDialogOpen}
                        onOpenChange={setIsExpenseDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600"
                            onClick={() => setEditingExpense(null)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Expense
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>
                              {editingExpense
                                ? "Edit Expense"
                                : "Add New Expense"}
                            </DialogTitle>
                          </DialogHeader>
                          <ExpenseForm
                            onSubmit={
                              editingExpense
                                ? handleUpdateExpense
                                : handleAddExpense
                            }
                            initialData={editingExpense || undefined}
                            onCancel={handleExpenseDialogClose}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ExpenseList
                      expenses={expenses}
                      onEdit={handleEditExpense}
                      onDelete={handleDeleteExpense}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

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
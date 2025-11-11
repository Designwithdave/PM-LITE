import React, { useState, useEffect, useCallback } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
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
import { Plus, DollarSign } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { Expense } from "@/types/expense";

const STORAGE_KEY = "expense-tracker-expenses";

const ExpensesPage = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  // Load expenses from localStorage
  const fetchExpenses = useCallback(() => {
    try {
      setLoading(true);
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setExpenses(parsed);
      }
    } catch (error) {
      console.error("Error loading expenses:", error);
      toast({
        title: "Error",
        description: "Failed to load expenses from storage",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Save expenses to localStorage
  const saveExpenses = useCallback((expensesToSave: Expense[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expensesToSave));
    } catch (error) {
      console.error("Error saving expenses:", error);
      toast({
        title: "Error",
        description: "Failed to save expenses",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (
    expenseData: Omit<Expense, "id" | "user_id" | "created_at" | "updated_at">,
  ) => {
    try {
      const newExpense: Expense = {
        ...expenseData,
        id: crypto.randomUUID(),
        user_id: "local",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const updatedExpenses = [newExpense, ...expenses];
      setExpenses(updatedExpenses);
      saveExpenses(updatedExpenses);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Expense added successfully",
      });
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
      const updatedExpense: Expense = {
        ...editingExpense,
        ...expenseData,
        updated_at: new Date().toISOString(),
      };

      const updatedExpenses = expenses.map((exp) =>
        exp.id === editingExpense.id ? updatedExpense : exp
      );
      setExpenses(updatedExpenses);
      saveExpenses(updatedExpenses);
      setEditingExpense(null);
      setIsDialogOpen(false);
      toast({
        title: "Success",
        description: "Expense updated successfully",
      });
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
      const updatedExpenses = expenses.filter((exp) => exp.id !== id);
      setExpenses(updatedExpenses);
      saveExpenses(updatedExpenses);
      toast({
        title: "Success",
        description: "Expense deleted successfully",
      });
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
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  <DollarSign className="h-8 w-8 text-green-600" />
                  My Expenses
                </h1>
                <p className="text-gray-600 mt-1">
                  Track and manage your daily expenses
                </p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm"
                    onClick={() => setEditingExpense(null)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingExpense ? "Edit Expense" : "Add New Expense"}
                    </DialogTitle>
                  </DialogHeader>
                  <ExpenseForm
                    onSubmit={
                      editingExpense ? handleUpdateExpense : handleAddExpense
                    }
                    initialData={editingExpense || undefined}
                    onCancel={handleDialogClose}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ExpenseSummary expenses={expenses} />
              </div>
              <div className="lg:col-span-2">
                <Card className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle>All Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                    ) : (
                      <ExpenseList
                        expenses={expenses}
                        onEdit={handleEditExpense}
                        onDelete={handleDeleteExpense}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExpensesPage;
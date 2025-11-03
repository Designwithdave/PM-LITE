import { useEffect, useState, useCallback } from "react";
import { Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabase/supabase";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import ExpenseForm from "@/components/expenses/ExpenseForm";
import ExpenseList from "@/components/expenses/ExpenseList";
import ExpenseSummary from "@/components/expenses/ExpenseSummary";
import type { Expense } from "@/types/expense";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchExpenses = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast({
        title: "Error",
        description: "Failed to load expenses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleAddExpense = async (
    expenseData: Omit<Expense, "id" | "user_id" | "created_at" | "updated_at">
  ) => {
    try {
      const { data, error } = await supabase
        .from("expenses")
        .insert([{ ...expenseData, user_id: user?.id }])
        .select()
        .single();

      if (error) throw error;

      setExpenses([data, ...expenses]);
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
    expenseData: Omit<Expense, "id" | "user_id" | "created_at" | "updated_at">
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
        expenses.map((exp) => (exp.id === editingExpense.id ? data : exp))
      );
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
      const { error } = await supabase.from("expenses").delete().eq("id", id);

      if (error) throw error;

      setExpenses(expenses.filter((exp) => exp.id !== id));
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

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingExpense(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">💰</div>
          <p className="text-muted-foreground">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Expense Tracker</h1>
            <p className="text-muted-foreground">
              Track and manage your daily expenses
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Add Expense
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" onClick={() => setEditingExpense(null)}>
                        <Plus className="h-4 w-4 mr-1" />
                        New
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
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseForm onSubmit={handleAddExpense} />
              </CardContent>
            </Card>

            <ExpenseSummary expenses={expenses} />
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseList
                  expenses={expenses}
                  onEdit={handleEdit}
                  onDelete={handleDeleteExpense}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
import { format } from "date-fns";
import { Edit2, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CATEGORY_COLORS, CATEGORY_ICONS, type Expense } from "@/types/expense";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseList({ expenses, onEdit, onDelete }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">💸</div>
        <h3 className="text-xl font-semibold mb-2">No expenses yet</h3>
        <p className="text-muted-foreground">
          Start tracking your expenses by adding your first one above
        </p>
      </div>
    );
  }

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate dynamic height: show max 5 items before scrolling
  const itemHeight = 110; // Approximate height per expense item
  const visibleItems = Math.min(expenses.length, 5);
  const calculatedHeight = visibleItems * itemHeight;

  return (
    <ScrollArea className="pr-4" style={{ height: `${calculatedHeight}px` }}>
      <div className="space-y-3">
        {sortedExpenses.map((expense) => (
          <Card key={expense.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0">
                    <Badge
                      className={`${
                        CATEGORY_COLORS[expense.category as keyof typeof CATEGORY_COLORS]
                      } text-white text-lg px-3 py-1`}
                    >
                      {CATEGORY_ICONS[expense.category as keyof typeof CATEGORY_ICONS]}
                    </Badge>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-lg">
                        ${expense.amount.toFixed(2)}
                      </h4>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(expense.date), "MMM dd, yyyy")}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {expense.category}
                    </p>
                    {expense.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {expense.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(expense)}
                    className="h-8 w-8"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this expense? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(expense.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CATEGORY_COLORS, CATEGORY_ICONS, type Expense } from "@/types/expense";

interface ExpenseSummaryProps {
  expenses: Expense[];
}

export default function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  );

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-sm font-medium opacity-90">
            Total Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">${total.toFixed(2)}</div>
          <p className="text-sm opacity-75 mt-1">
            {expenses.length} {expenses.length === 1 ? "transaction" : "transactions"}
          </p>
        </CardContent>
      </Card>

      {sortedCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Breakdown by Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedCategories.map(([category, amount]) => {
              const percentage = (amount / total) * 100;
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS]}
                      </span>
                      <span className="font-medium">{category}</span>
                    </div>
                    <span className="font-semibold">${amount.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={percentage}
                      className="flex-1"
                      indicatorClassName={
                        CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]
                      }
                    />
                    <span className="text-xs text-muted-foreground w-12 text-right">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
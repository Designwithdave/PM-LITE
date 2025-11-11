import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronRight,
  Settings,
  User,
  DollarSign,
  BarChart3,
  Shield,
  Smartphone,
  Clock,
  TrendingDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../supabase/auth";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900 overflow-hidden">
      {/* Floating background elements */}
      <div
        className="fixed top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div
        className="fixed top-40 right-20 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.5}px)` }}
      />
      <div
        className="fixed bottom-20 left-1/3 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl pointer-events-none"
        style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
      />
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <Link to="/" className="font-bold text-xl">
              PMTRACKER
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/expenses">
                  <Button
                    variant="ghost"
                    className="text-sm hover:text-blue-600"
                  >
                    My Expenses
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    variant="ghost"
                    className="text-sm hover:text-blue-600"
                  >
                    Dashboard
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-9 w-9 hover:cursor-pointer border-2 border-blue-500">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                        alt={user.email || ""}
                      />
                      <AvatarFallback>
                        {user.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-xl border-none shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs text-gray-500">
                      {user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onSelect={() => signOut()}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-sm hover:text-blue-600"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 text-sm px-6">
                    Get Started Free
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="pt-16 relative">
        {/* Hero section */}
        <section className="py-24 text-center px-6 relative">
          <div className="max-w-4xl mx-auto">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8"
              style={{
                transform: `translateY(${scrollY * 0.1}px)`,
                opacity: Math.max(0, 1 - scrollY / 400),
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Simple expense tracking for everyone
            </div>
            <h1
              className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent"
              style={{
                transform: `translateY(${scrollY * 0.15}px)`,
                opacity: Math.max(0, 1 - scrollY / 500),
              }}
            >
              Track Every Dollar, Effortlessly
            </h1>
            <p
              className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto"
              style={{
                transform: `translateY(${scrollY * 0.2}px)`,
                opacity: Math.max(0, 1 - scrollY / 600),
              }}
            >
              Log your daily expenses in seconds. View your spending history.
              See where your money goes with automatic category breakdowns. All
              stored safely in your browser.
            </p>
            <div
              className="flex justify-center gap-4 mb-12"
              style={{
                transform: `translateY(${scrollY * 0.25}px)`,
                opacity: Math.max(0, 1 - scrollY / 700),
              }}
            >
              <Link to="/expenses">
                <Button
                  size="lg"
                  className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all"
                >
                  Start Tracking Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!user && (
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full border-2 border-gray-300 px-8 h-12 text-base hover:bg-gray-50"
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mock expense card showcase with parallax */}
            <div
              className="relative max-w-3xl mx-auto mt-16"
              style={{
                transform: `translateY(${scrollY * 0.08}px) scale(${Math.max(0.95, 1 - scrollY / 3000)})`,
                opacity: Math.max(0, 1 - scrollY / 800),
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl -z-10"></div>
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">This Month</h3>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    $1,247.35
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      category: "Food",
                      amount: "$342.50",
                      color: "bg-orange-500",
                      desc: "Groceries & Dining",
                    },
                    {
                      category: "Transport",
                      amount: "$128.00",
                      color: "bg-blue-500",
                      desc: "Gas & Uber",
                    },
                    {
                      category: "Shopping",
                      amount: "$456.85",
                      color: "bg-purple-500",
                      desc: "Clothes & Electronics",
                    },
                    {
                      category: "Bills",
                      amount: "$320.00",
                      color: "bg-green-500",
                      desc: "Utilities & Internet",
                    },
                  ].map((expense, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className={`h-10 w-10 ${expense.color} rounded-lg flex items-center justify-center`}
                      >
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium">{expense.category}</div>
                        <div className="text-sm text-gray-500">
                          {expense.desc}
                        </div>
                      </div>
                      <div className="text-lg font-semibold">
                        {expense.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features section with staggered parallax */}
        <section className="py-20 bg-white relative">
          <div className="max-w-7xl mx-auto px-6">
            <div
              className="text-center mb-16"
              style={{
                transform: `translateY(${Math.max(0, (scrollY - 400) * 0.1)}px)`,
                opacity: Math.min(1, Math.max(0, (scrollY - 300) / 200)),
              }}
            >
              <h2 className="text-4xl font-bold mb-4">Everything You Need</h2>
              <p className="text-xl text-gray-600">
                Simple features for daily expense tracking
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Clock,
                  title: "Quick Entry",
                  desc: "Add expenses in seconds with amount, category, description, and date. No complicated forms.",
                  color: "blue",
                  delay: 0,
                },
                {
                  icon: BarChart3,
                  title: "Category Breakdown",
                  desc: "See your spending by category with automatic totals and visual breakdowns.",
                  color: "purple",
                  delay: 100,
                },
                {
                  icon: DollarSign,
                  title: "Running Total",
                  desc: "Always know your total expenses with a prominent display at the top of your list.",
                  color: "green",
                  delay: 200,
                },
                {
                  icon: Settings,
                  title: "Edit & Delete",
                  desc: "Made a mistake? Easily edit or delete any expense with quick action buttons.",
                  color: "orange",
                  delay: 300,
                },
                {
                  icon: Smartphone,
                  title: "Local Storage",
                  desc: "Your data stays on your device. No account needed, works offline, persists after refresh.",
                  color: "pink",
                  delay: 400,
                },
                {
                  icon: Shield,
                  title: "Privacy First",
                  desc: "Your expenses never leave your browser. Complete privacy and control over your data.",
                  color: "indigo",
                  delay: 500,
                },
              ].map((feature, i) => {
                const Icon = feature.icon;
                const colorMap: Record<string, string> = {
                  blue: "from-blue-50 to-blue-100/50 border-blue-200 bg-blue-500",
                  purple:
                    "from-purple-50 to-purple-100/50 border-purple-200 bg-purple-500",
                  green:
                    "from-green-50 to-green-100/50 border-green-200 bg-green-500",
                  orange:
                    "from-orange-50 to-orange-100/50 border-orange-200 bg-orange-500",
                  pink: "from-pink-50 to-pink-100/50 border-pink-200 bg-pink-500",
                  indigo:
                    "from-indigo-50 to-indigo-100/50 border-indigo-200 bg-indigo-500",
                };
                const [bgGradient, iconBg] =
                  colorMap[feature.color].split(" bg-");

                return (
                  <div
                    key={i}
                    className={`p-8 rounded-2xl bg-gradient-to-br ${bgGradient} border hover:shadow-lg transition-all duration-300`}
                    style={{
                      transform: `translateY(${Math.max(0, (scrollY - 600 - feature.delay) * 0.05)}px)`,
                      opacity: Math.min(
                        1,
                        Math.max(0, (scrollY - 500 - feature.delay) / 200),
                      ),
                    }}
                  >
                    <div
                      className={`h-14 w-14 bg-${iconBg} rounded-2xl flex items-center justify-center mb-6`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section
          className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative overflow-hidden"
          style={{
            transform: `translateY(${Math.max(0, (scrollY - 1400) * -0.1)}px)`,
          }}
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
          <div
            className="max-w-4xl mx-auto text-center px-6 relative z-10"
            style={{
              transform: `translateY(${Math.max(0, (scrollY - 1600) * 0.08)}px)`,
              opacity: Math.min(1, Math.max(0, (scrollY - 1400) / 300)),
            }}
          >
            <h2 className="text-5xl font-bold mb-6">Start Tracking Today</h2>
            <p className="text-xl mb-10 text-blue-100">
              No signup required. No credit card. Just open the app and start
              logging your expenses. Your data stays private on your device.
            </p>
            <Link to="/expenses">
              <Button
                size="lg"
                className="rounded-full bg-white text-blue-600 hover:bg-gray-100 px-10 h-14 text-lg font-semibold shadow-2xl"
              >
                Open Expense Tracker
                <ChevronRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
            <p className="mt-6 text-sm text-blue-100">
              Works in your browser • No installation needed • 100% free
            </p>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-white">ExpenseTracker</span>
              </div>
              <p className="text-sm">
                The simple way to track your daily expenses and take control of
                your finances.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    to="/expenses"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Mobile App
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    API Docs
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-sm text-center">
            <p>© 2025 ExpenseTracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

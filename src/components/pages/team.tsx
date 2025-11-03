import React, { useState } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Mail, Users as UsersIcon } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  avatar: string;
  status: "active" | "away" | "offline";
}

const statusColors = {
  active: "bg-green-500",
  away: "bg-yellow-500",
  offline: "bg-gray-400",
};

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Alice Smith",
      email: "alice@company.com",
      role: "Product Designer",
      department: "Design",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
      status: "active",
    },
    {
      id: "2",
      name: "Bob Johnson",
      email: "bob@company.com",
      role: "Frontend Developer",
      department: "Engineering",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
      status: "active",
    },
    {
      id: "3",
      name: "Carol Williams",
      email: "carol@company.com",
      role: "UX Researcher",
      department: "Design",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carol",
      status: "away",
    },
    {
      id: "4",
      name: "David Brown",
      email: "david@company.com",
      role: "Backend Developer",
      department: "Engineering",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
      status: "active",
    },
    {
      id: "5",
      name: "Eve Davis",
      email: "eve@company.com",
      role: "Marketing Manager",
      department: "Marketing",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eve",
      status: "offline",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "",
    department: "",
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.name.trim() || !newMember.email.trim()) return;

    const member: TeamMember = {
      id: Date.now().toString(),
      ...newMember,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newMember.name}`,
      status: "active",
    };

    setTeamMembers([...teamMembers, member]);
    setNewMember({
      name: "",
      email: "",
      role: "",
      department: "",
    });
    setIsDialogOpen(false);
  };

  const departments = Array.from(new Set(teamMembers.map((m) => m.department))).filter(Boolean);
  const getDepartmentCount = (dept: string) => {
    return teamMembers.filter((m) => m.department === dept).length;
  };

  const getStatusCount = (status: TeamMember["status"]) => {
    return teamMembers.filter((m) => m.status === status).length;
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
                <h1 className="text-3xl font-bold text-gray-900">Team</h1>
                <p className="text-gray-600 mt-1">Manage your team members and collaboration</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Add Team Member</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddMember} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={newMember.email}
                        onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input
                        id="role"
                        placeholder="e.g. Product Designer"
                        value={newMember.role}
                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={newMember.department}
                        onValueChange={(value) => setNewMember({ ...newMember, department: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        Add Member
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Members</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{teamMembers.length}</p>
                    </div>
                    <UsersIcon className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active</p>
                      <p className="text-2xl font-bold text-green-500 mt-1">{getStatusCount("active")}</p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${statusColors.active}`}></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Away</p>
                      <p className="text-2xl font-bold text-yellow-500 mt-1">{getStatusCount("away")}</p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${statusColors.away}`}></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Departments</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{departments.length}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-600 font-bold">{departments.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Department Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <Card key={dept} className="bg-white shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">{dept}</CardTitle>
                    <p className="text-sm text-gray-600">{getDepartmentCount(dept)} members</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {teamMembers
                        .filter((m) => m.department === dept)
                        .map((member) => (
                          <div key={member.id} className="flex items-center gap-3">
                            <div className="relative">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={member.avatar} alt={member.name} />
                                <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${statusColors[member.status]}`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {member.name}
                              </p>
                              <p className="text-xs text-gray-600 truncate">{member.role}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* All Members */}
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle>All Team Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${statusColors[member.status]}`}
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{member.email}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {member.department}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TeamPage;
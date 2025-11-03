import React, { useState } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { PlusCircle, FolderKanban, Users, Calendar as CalendarIcon } from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "completed" | "on-hold";
  progress: number;
  team: string[];
  dueDate: string;
}

const statusColors = {
  planning: "bg-yellow-500",
  active: "bg-blue-500",
  completed: "bg-green-500",
  "on-hold": "bg-gray-500",
};

const statusLabels = {
  planning: "Planning",
  active: "Active",
  completed: "Completed",
  "on-hold": "On Hold",
};

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      description: "Complete overhaul of company website with modern design",
      status: "active",
      progress: 65,
      team: ["Alice Smith", "Bob Johnson", "Carol Williams"],
      dueDate: "2024-12-31",
    },
    {
      id: "2",
      name: "Mobile App Development",
      description: "Build cross-platform mobile application",
      status: "planning",
      progress: 20,
      team: ["David Brown", "Eve Davis"],
      dueDate: "2025-03-15",
    },
    {
      id: "3",
      name: "Marketing Campaign Q4",
      description: "Plan and execute Q4 marketing initiatives",
      status: "active",
      progress: 45,
      team: ["Alice Smith", "Eve Davis"],
      dueDate: "2024-12-15",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "planning" as Project["status"],
    dueDate: "",
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    const project: Project = {
      id: Date.now().toString(),
      ...newProject,
      progress: 0,
      team: [],
    };

    setProjects([project, ...projects]);
    setNewProject({
      name: "",
      description: "",
      status: "planning",
      dueDate: "",
    });
    setIsDialogOpen(false);
  };

  const getStatusCount = (status: Project["status"]) => {
    return projects.filter((p) => p.status === status).length;
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
                <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                <p className="text-gray-600 mt-1">Manage and track your project progress</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 h-9 shadow-sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddProject} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Project Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter project name"
                        value={newProject.name}
                        onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter project description"
                        value={newProject.description}
                        onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={newProject.status}
                        onValueChange={(value) => setNewProject({ ...newProject, status: value as Project["status"] })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planning">Planning</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="on-hold">On Hold</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={newProject.dueDate}
                        onChange={(e) => setNewProject({ ...newProject, dueDate: e.target.value })}
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1">
                        Create Project
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
                      <p className="text-sm text-gray-600">Total Projects</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{projects.length}</p>
                    </div>
                    <FolderKanban className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active</p>
                      <p className="text-2xl font-bold text-blue-500 mt-1">{getStatusCount("active")}</p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${statusColors.active}`}></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Planning</p>
                      <p className="text-2xl font-bold text-yellow-500 mt-1">{getStatusCount("planning")}</p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${statusColors.planning}`}></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Completed</p>
                      <p className="text-2xl font-bold text-green-500 mt-1">{getStatusCount("completed")}</p>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${statusColors.completed}`}></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {projects.map((project) => (
                <Card key={project.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      </div>
                      <Badge className={`${statusColors[project.status]} text-white`}>
                        {statusLabels[project.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{project.team.length} members</span>
                      </div>
                      {project.dueDate && (
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600">
                            {new Date(project.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectsPage;
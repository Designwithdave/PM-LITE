import React, { useState } from "react";
import TopNavigation from "../dashboard/layout/TopNavigation";
import Sidebar from "../dashboard/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "../../../supabase/auth";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "../../../supabase/supabase";
import { User, Mail, Bell, Lock, Shield, Palette } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { darkMode, compactView, setDarkMode, setCompactView } = useTheme();
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: user?.user_metadata?.full_name || "",
    email: user?.email || "",
    phone: "",
    bio: "",
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReport: true,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: profile.fullName }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Password Reset",
      description: "Password reset email sent to your inbox",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <div className="flex h-[calc(100vh-64px)] mt-16">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className={`container mx-auto max-w-5xl ${compactView ? 'p-4' : 'p-6'}`}>
            <div className={compactView ? 'mb-4' : 'mb-6'}>
              <h1 className={`font-bold text-foreground ${compactView ? 'text-2xl' : 'text-3xl'}`}>Profile & Settings</h1>
              <p className={`text-muted-foreground ${compactView ? 'mt-0.5 text-sm' : 'mt-1'}`}>Manage your account and preferences</p>
            </div>

            <Tabs defaultValue="profile" className={compactView ? 'space-y-4' : 'space-y-6'}>
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className={compactView ? 'space-y-4' : 'space-y-6'}>
                <Card>
                  <CardHeader className={compactView ? 'pb-3' : ''}>
                    <CardTitle className="flex items-center gap-2">
                      <User className={compactView ? 'h-4 w-4' : 'h-5 w-5'} />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`flex items-center gap-6 ${compactView ? 'mb-4' : 'mb-6'}`}>
                      <Avatar className={compactView ? 'h-16 w-16' : 'h-24 w-24'}>
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
                        <AvatarFallback>{profile.fullName.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline" size={compactView ? 'sm' : 'default'}>Change Photo</Button>
                        <p className={`text-muted-foreground ${compactView ? 'text-xs mt-1' : 'text-sm mt-2'}`}>JPG, PNG or GIF. Max 2MB</p>
                      </div>
                    </div>

                    <form onSubmit={handleProfileUpdate} className={compactView ? 'space-y-3' : 'space-y-4'}>
                      <div className="grid grid-cols-2 gap-4">
                        <div className={compactView ? 'space-y-1.5' : 'space-y-2'}>
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            value={profile.fullName}
                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                            placeholder="Enter your full name"
                            className={compactView ? 'h-9' : ''}
                          />
                        </div>
                        <div className={compactView ? 'space-y-1.5' : 'space-y-2'}>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            disabled
                            className={`bg-muted ${compactView ? 'h-9' : ''}`}
                          />
                        </div>
                      </div>

                      <div className={compactView ? 'space-y-1.5' : 'space-y-2'}>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className={compactView ? 'h-9' : ''}
                        />
                      </div>

                      <div className={compactView ? 'space-y-1.5' : 'space-y-2'}>
                        <Label htmlFor="bio">Bio</Label>
                        <Input
                          id="bio"
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          placeholder="Tell us about yourself"
                          className={compactView ? 'h-9' : ''}
                        />
                      </div>

                      <Button type="submit" disabled={loading} size={compactView ? 'sm' : 'default'}>
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className={compactView ? 'space-y-4' : 'space-y-6'}>
                <Card>
                  <CardHeader className={compactView ? 'pb-3' : ''}>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className={compactView ? 'h-4 w-4' : 'h-5 w-5'} />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={compactView ? 'space-y-3' : 'space-y-4'}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${compactView ? 'text-sm' : ''}`}>Email Notifications</p>
                        <p className={`text-muted-foreground ${compactView ? 'text-xs' : 'text-sm'}`}>Receive email updates about your activity</p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => 
                          setSettings({ ...settings, emailNotifications: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${compactView ? 'text-sm' : ''}`}>Push Notifications</p>
                        <p className={`text-muted-foreground ${compactView ? 'text-xs' : 'text-sm'}`}>Receive push notifications on your device</p>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(checked) => 
                          setSettings({ ...settings, pushNotifications: checked })
                        }
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${compactView ? 'text-sm' : ''}`}>Weekly Report</p>
                        <p className={`text-muted-foreground ${compactView ? 'text-xs' : 'text-sm'}`}>Get a weekly summary of your activity</p>
                      </div>
                      <Switch
                        checked={settings.weeklyReport}
                        onCheckedChange={(checked) => 
                          setSettings({ ...settings, weeklyReport: checked })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className={compactView ? 'pb-3' : ''}>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className={compactView ? 'h-4 w-4' : 'h-5 w-5'} />
                      Appearance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={compactView ? 'space-y-3' : 'space-y-4'}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${compactView ? 'text-sm' : ''}`}>Dark Mode</p>
                        <p className={`text-muted-foreground ${compactView ? 'text-xs' : 'text-sm'}`}>Switch to dark theme</p>
                      </div>
                      <Switch
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${compactView ? 'text-sm' : ''}`}>Compact View</p>
                        <p className={`text-muted-foreground ${compactView ? 'text-xs' : 'text-sm'}`}>Use a more compact layout</p>
                      </div>
                      <Switch
                        checked={compactView}
                        onCheckedChange={setCompactView}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className={compactView ? 'space-y-4' : 'space-y-6'}>
                <Card>
                  <CardHeader className={compactView ? 'pb-3' : ''}>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className={compactView ? 'h-4 w-4' : 'h-5 w-5'} />
                      Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className={compactView ? 'space-y-3' : 'space-y-4'}>
                      <div className={compactView ? 'space-y-1.5' : 'space-y-2'}>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" className={compactView ? 'h-9' : ''} />
                      </div>
                      <div className={compactView ? 'space-y-1.5' : 'space-y-2'}>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" className={compactView ? 'h-9' : ''} />
                      </div>
                      <div className={compactView ? 'space-y-1.5' : 'space-y-2'}>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" className={compactView ? 'h-9' : ''} />
                      </div>
                      <Button type="submit" size={compactView ? 'sm' : 'default'}>Update Password</Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className={compactView ? 'pb-3' : ''}>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className={compactView ? 'h-4 w-4' : 'h-5 w-5'} />
                      Two-Factor Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-muted-foreground ${compactView ? 'text-xs mb-3' : 'text-sm mb-4'}`}>
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline" size={compactView ? 'sm' : 'default'}>Enable 2FA</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
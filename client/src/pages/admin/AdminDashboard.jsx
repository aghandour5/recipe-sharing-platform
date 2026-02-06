import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Users, FileText, MessageSquare, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [, setLocation] = useLocation();

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ["/api/admin/stats"],
        retry: false,
        onError: (err) => {
            // Simple way to handle forbidden: if fetch fails (403), redirect
            if (err.message.includes("403") || err.message.includes("401")) {
                setLocation("/");
                toast({ variant: "destructive", title: "Access Denied", description: "You are not an admin." });
            }
        }
    });

    const { data: users, isLoading: usersLoading } = useQuery({
        queryKey: ["/api/admin/users"],
    });

    const { data: recipes, isLoading: recipesLoading } = useQuery({
        queryKey: ["/api/admin/recipes"],
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (userId) => {
            await apiRequest("DELETE", `/api/admin/users/${userId}`);
        },
        onSuccess: () => {
            toast({ title: "User deleted", description: "The user has been removed." });
            queryClient.invalidateQueries(["/api/admin/users"]);
            queryClient.invalidateQueries(["/api/admin/stats"]);
        },
        onError: (err) => {
            toast({ variant: "destructive", title: "Failed to delete user", description: err.message });
        }
    });

    const deleteRecipeMutation = useMutation({
        mutationFn: async (recipeId) => {
            await apiRequest("DELETE", `/api/admin/recipes/${recipeId}`);
        },
        onSuccess: () => {
            toast({ title: "Recipe deleted", description: "The recipe has been removed." });
            queryClient.invalidateQueries(["/api/admin/recipes"]);
            queryClient.invalidateQueries(["/api/admin/stats"]);
        },
        onError: (err) => {
            toast({ variant: "destructive", title: "Failed to delete recipe", description: err.message });
        }
    });

    const handleDeleteUser = (userId) => {
        if (confirm("Are you sure? This will delete the user and ALL their data (recipes, comments, etc).")) {
            deleteUserMutation.mutate(userId);
        }
    };

    const handleDeleteRecipe = (recipeId) => {
        if (confirm("Are you sure you want to delete this recipe?")) {
            deleteRecipeMutation.mutate(recipeId);
        }
    };

    if (statsLoading) return <div className="page-container flex justify-center items-center h-screen"><Loader2 className="animate-spin h-8 w-8" /></div>;
    if (!stats) return <div className="page-container flex justify-center items-center h-screen">Access Denied</div>;

    return (
        <div className="page-container">
            <Navbar />

            <div className="container-custom py-8">
                <h1 className="font-heading text-3xl font-bold mb-8">Admin Dashboard</h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.users}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.recipes}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.comments}</div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="users" className="w-full">
                    <TabsList>
                        <TabsTrigger value="users">Manage Users</TabsTrigger>
                        <TabsTrigger value="recipes">Manage Recipes</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Registered Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {users?.map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <div className="font-bold">{user.username}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                                <div className="text-xs text-muted-foreground">Joined: {new Date(user.created_at).toLocaleDateString()}</div>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteUser(user.id)}
                                                disabled={deleteUserMutation.isPending}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="recipes" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>All Recipes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recipes?.map(recipe => (
                                        <div key={recipe.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div>
                                                <div className="font-bold">{recipe.title}</div>
                                                <div className="text-sm text-muted-foreground">by {recipe.author}</div>
                                                <div className="text-xs text-muted-foreground">Posted: {new Date(recipe.created_at).toLocaleDateString()}</div>
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteRecipe(recipe.id)}
                                                disabled={deleteRecipeMutation.isPending}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    );
}

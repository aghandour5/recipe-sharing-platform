import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Settings, BookOpen, Heart, Activity, ChefHat } from "lucide-react";
import { Link } from "wouter";

// Mock Data
const MY_RECIPES = [
  {
    id: "1",
    title: "Rustic Roasted Vegetable Galette",
    image: "/images/recipe-thumb_1.jpg",
    author: { name: "You", avatar: "https://github.com/shadcn.png" },
    rating: 4.8,
    time: "45 min",
    difficulty: "Medium",
    category: "Dinner"
  },
  {
    id: "5",
    title: "Homemade Sourdough Bread",
    image: "/images/recipe-thumb_4.jpg",
    author: { name: "You", avatar: "https://github.com/shadcn.png" },
    rating: 5.0,
    time: "24 hr",
    difficulty: "Hard",
    category: "Baking"
  }
];

export default function Dashboard() {
  return (
    <div className="page-container">
      <Navbar />
      
      <div className="container-custom py-8">
        <div className="dashboard-layout">
          
          {/* Sidebar / Profile Card */}
          <aside className="dashboard-sidebar">
            <Card className="profile-card">
              <div className="profile-cover-small">
                 <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20"></div>
              </div>
              <CardContent className="pt-0 relative">
                <div className="profile-avatar-wrapper">
                  <Avatar className="h-24 w-24 border-4 border-card ring-2 ring-border">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </div>
                <div className="text-center mb-6">
                  <h2 className="font-heading text-xl font-bold">Julia Childish</h2>
                  <p className="text-sm text-muted-foreground">@chef_julia</p>
                  <p className="text-xs text-muted-foreground mt-1">Member since Feb 2026</p>
                </div>
                
                <div className="dashboard-stats">
                  <div>
                    <div className="font-bold">12</div>
                    <div className="text-xs text-muted-foreground">Recipes</div>
                  </div>
                  <div>
                    <div className="font-bold">1.2k</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div>
                    <div className="font-bold">4.8</div>
                    <div className="text-xs text-muted-foreground">Avg Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <nav className="space-y-2 hidden md:block">
              <Button variant="ghost" className="w-full justify-start bg-accent text-accent-foreground font-medium">
                <BookOpen className="mr-2 h-4 w-4" /> My Recipes
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Heart className="mr-2 h-4 w-4" /> Saved Recipes
              </Button>
               <Button variant="ghost" className="w-full justify-start">
                <Activity className="mr-2 h-4 w-4" /> Activity
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" /> Settings
              </Button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-heading text-3xl font-bold">My Kitchen</h1>
              <Link href="/recipes/new">
                <Button className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  <Plus className="mr-2 h-4 w-4" /> Create Recipe
                </Button>
              </Link>
            </div>

            <Tabs defaultValue="published" className="space-y-6">
              <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0 gap-6">
                <TabsTrigger 
                  value="published" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 font-medium"
                >
                  Published ({MY_RECIPES.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="drafts" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 font-medium"
                >
                  Drafts (2)
                </TabsTrigger>
                <TabsTrigger 
                  value="saved" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-0 pb-2 font-medium"
                >
                  Saved Collections
                </TabsTrigger>
              </TabsList>

              <TabsContent value="published" className="animate-in fade-in-50 duration-500">
                <div className="recipes-grid-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {MY_RECIPES.map((recipe) => (
                    <div key={recipe.id} className="relative group">
                      <RecipeCard {...recipe} />
                      <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button size="sm" variant="secondary" className="h-8 px-2 text-xs bg-white/90 backdrop-blur">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="drafts">
                 <div className="recipes-grid-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="border-dashed border-2 flex flex-col items-center justify-center h-[300px] text-muted-foreground hover:bg-accent/50 transition-colors cursor-pointer">
                        <ChefHat className="h-10 w-10 mb-4 opacity-50" />
                        <h3 className="font-bold">Untitled Recipe</h3>
                        <p className="text-xs">Last edited 2 days ago</p>
                    </Card>
                 </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
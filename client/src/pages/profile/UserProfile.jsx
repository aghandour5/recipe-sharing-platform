import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MapPin, Link as LinkIcon, Calendar, UserPlus, Mail } from "lucide-react";
import { useParams } from "wouter";

const USER_RECIPES = [
  {
    id: "1",
    title: "Rustic Roasted Vegetable Galette",
    image: "/images/recipe-thumb_1.jpg",
    author: { name: "Elena R.", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    rating: 4.8,
    time: "45 min",
    difficulty: "Medium",
    category: "Dinner"
  },
  {
    id: "2",
    title: "Classic Homemade Beef Burger",
    image: "/images/recipe-thumb_4.jpg",
    author: { name: "Elena R.", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    rating: 4.7,
    time: "40 min",
    difficulty: "Medium",
    category: "Dinner"
  },
];

export default function UserProfile() {
  const { id } = useParams();

  return (
    <div className="page-container">
      <Navbar />

      {/* Profile Header */}
      <div className="bg-background border-b">
        {/* Cover Photo */}
        <div className="profile-cover-large">
           <img src="/images/hero-food.png" className="w-full h-full object-cover opacity-50" />
           <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
        </div>
        
        <div className="container-custom relative">
          <div className="profile-header-content">
            <Avatar className="h-32 w-32 border-4 border-background ring-4 ring-muted shadow-xl">
              <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
              <AvatarFallback>ER</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2 mb-2">
              <h1 className="font-heading text-3xl font-bold">Elena Rodriguez</h1>
              <p className="text-muted-foreground">Passionate home cook, sourdough enthusiast, and vegetable lover.</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> San Francisco, CA</span>
                <span className="flex items-center gap-1"><LinkIcon className="h-4 w-4" /> elenacooks.com</span>
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Joined Feb 2024</span>
              </div>
            </div>

            <div className="flex gap-3 mb-4 md:mb-2">
               <Button className="rounded-full"><UserPlus className="mr-2 h-4 w-4" /> Follow</Button>
               <Button variant="outline" className="rounded-full"><Mail className="mr-2 h-4 w-4" /> Message</Button>
            </div>
          </div>
          
           <div className="grid grid-cols-4 gap-4 max-w-lg mb-8 border-t pt-4">
              <div className="text-center md:text-left">
                <div className="font-bold text-xl">42</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Recipes</div>
              </div>
               <div className="text-center md:text-left">
                <div className="font-bold text-xl">1.5k</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Followers</div>
              </div>
               <div className="text-center md:text-left">
                <div className="font-bold text-xl">340</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Following</div>
              </div>
               <div className="text-center md:text-left">
                <div className="font-bold text-xl">4.9</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Avg Rating</div>
              </div>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <Tabs defaultValue="recipes">
          <TabsList>
            <TabsTrigger value="recipes">Recipes</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recipes" className="mt-8">
             <div className="recipes-grid">
              {USER_RECIPES.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="saved">
             <div className="py-12 text-center text-muted-foreground">
               <p>Elena's saved recipes are private.</p>
             </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
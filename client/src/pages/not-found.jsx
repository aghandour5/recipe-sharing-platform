import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Search, Home, ArrowRight, ChefHat } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/layout/Navbar";

export default function NotFound() {
  return (
    <div className="page-container">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="w-full max-w-2xl text-center space-y-8">
           <div className="not-found-icon-wrapper animate-in bounce-in duration-1000">
              <ChefHat className="h-12 w-12" />
           </div>
           
           <h1 className="font-heading text-5xl md:text-7xl font-bold text-foreground">
             404
           </h1>
           <h2 className="text-2xl md:text-3xl font-bold text-muted-foreground">
             Oops! This recipe burned.
           </h2>
           
           <p className="text-lg text-muted-foreground max-w-md mx-auto">
             We couldn't find the page you were looking for. It might have been removed, renamed, or didn't exist in the first place.
           </p>

           <div className="max-w-md mx-auto relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
             <Input placeholder="Try searching for something else..." className="pl-10 h-12 bg-background shadow-sm" />
           </div>

           <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
             <Link href="/">
               <Button size="lg" className="rounded-full px-8">
                 <Home className="mr-2 h-4 w-4" /> Return to Home
               </Button>
             </Link>
             <Button variant="outline" size="lg" className="rounded-full px-8">
               Report Broken Link
             </Button>
           </div>
           
           <div className="pt-12 border-t mt-12">
             <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-6">Popular Pages</h3>
             <div className="flex flex-wrap justify-center gap-4">
               {["Breakfast Recipes", "Quick Dinners", "Desserts", "Healthy Lunch"].map((tag) => (
                 <Link key={tag} href="/search">
                   <Button variant="secondary" className="rounded-full text-sm">
                     {tag} <ArrowRight className="ml-1 h-3 w-3 opacity-50" />
                   </Button>
                 </Link>
               ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
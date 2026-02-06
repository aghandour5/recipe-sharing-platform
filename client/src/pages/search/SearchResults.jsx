import { Navbar } from "@/components/layout/Navbar";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Search, X, SlidersHorizontal, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSearch, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function SearchResults() {
  const [showFilters, setShowFilters] = useState(false);
  const [visibleCount, setVisibleCount] = useState(12);
  const [, setLocation] = useLocation();
  const searchString = useSearch(); // Returns query string e.g. "category=Dinner" or "q=pasta"
  const params = new URLSearchParams(searchString);
  const query = params.get("q") || "";
  const category = params.get("category") || "";

  // Construct API URL based on params
  let apiUrl = "/api/recipes?";
  if (query) apiUrl += `search=${encodeURIComponent(query)}&`;
  if (category) apiUrl += `category=${encodeURIComponent(category)}&`;

  const { data: recipes, isLoading } = useQuery({
    queryKey: [apiUrl],
  });

  const displayRecipes = recipes ? recipes.map(recipe => ({
    id: recipe.id,
    title: recipe.title,
    image: recipe.image_url || "/images/recipe-thumb_1.jpg",
    author: {
      name: recipe.user.username,
      avatar: `https://i.pravatar.cc/150?u=${recipe.user.id}`
    },
    rating: parseFloat(recipe.avg_rating) || 0,
    time: `${(recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)} min`,
    difficulty: "Medium",
    category: category || "General"
  })) : [];

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const q = formData.get("q");
    setLocation(`/search?q=${q}`);
  };

  return (
    <div className="page-container">
      <Navbar />

      {/* Search Header */}
      <div className="search-header-bg">
        <div className="container-custom">
          <h1 className="font-heading text-3xl font-bold mb-6">Find Recipes</h1>
          <form onSubmit={handleSearch} className="flex gap-4 max-w-3xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                name="q"
                placeholder="Search for 'pasta', 'vegan', 'quick dinner'..."
                className="pl-10 h-12 text-lg bg-background shadow-sm"
                defaultValue={query}
              />
            </div>
            <Button size="lg" className="h-12 px-8" type="submit">Search</Button>
          </form>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button variant="outline" className="w-full" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>

          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'block' : 'hidden'}`}>
            <div className="flex items-center justify-between lg:hidden">
              <h3 className="font-bold text-lg">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}><X className="h-4 w-4" /></Button>
            </div>

            <Accordion type="multiple" defaultValue={["category", "time", "diet"]} className="w-full">
              <AccordionItem value="category">
                <AccordionTrigger className="font-bold">Category</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"].map((c) => (
                      <div key={c} className="flex items-center space-x-2">
                        <Checkbox
                          id={`cat-${c}`}
                          checked={category === c}
                          onCheckedChange={(checked) => {
                            if (checked) setLocation(`/search?category=${c}`);
                            else setLocation(`/search`);
                          }}
                        />
                        <Label htmlFor={`cat-${c}`}>{c}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="time">
                <AccordionTrigger className="font-bold">Total Time</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 px-1">
                    <Slider defaultValue={[60]} max={120} step={5} />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0 min</span>
                      <span>60 min</span>
                      <span>2 hr+</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div className="text-muted-foreground">
                Showing <span className="font-bold text-foreground">{displayRecipes.length}</span> results
                {category && <span> for category "{category}"</span>}
                {query && <span> for "{query}"</span>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">Sort by:</span>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : displayRecipes.length > 0 ? (
              <div className="recipes-grid">
                {displayRecipes.slice(0, visibleCount).map((recipe) => (
                  <RecipeCard key={recipe.id} {...recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-bold text-muted-foreground">No recipes found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              </div>
            )}

            {displayRecipes.length > visibleCount && (
              <div className="mt-12 text-center">
                <Button
                  variant="outline"
                  size="lg"
                  className="min-w-[200px]"
                  onClick={() => setVisibleCount(prev => prev + 12)}
                >
                  Load More
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
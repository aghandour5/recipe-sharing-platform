import { Navbar } from "@/components/layout/Navbar";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Search, ChefHat, Flame, Clock } from "lucide-react";
import { Link } from "wouter";

import { useQuery } from "@tanstack/react-query";

const CATEGORIES = [
  "Breakfast", "Lunch", "Dinner", "Dessert", "Vegetarian", "Vegan", "Gluten-Free", "Quick & Easy"
];

export default function Home() {
  const { data: recipes, isLoading } = useQuery({
    queryKey: ["/api/recipes"],
  });

  const featuredRecipes = recipes ? recipes.map(recipe => ({
    id: recipe.id,
    title: recipe.title,
    image: recipe.image_url || "/images/recipe-thumb_1.jpg", // Fallback image
    author: {
      name: recipe.user.username,
      avatar: "https://i.pravatar.cc/150?u=" + recipe.user.id // Deterministic avatar
    },
    rating: parseFloat(recipe.avg_rating) || 0,
    time: `${(recipe.prep_time_minutes || 0) + (recipe.cook_time_minutes || 0)} min`,
    difficulty: "Medium", // Backend doesn't have difficulty yet, default to Medium
    category: "Dinner" // Backend list doesn't have category yet
  })) : [];

  return (
    <div className="page-container">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        {/* Background Image with Overlay */}
        <div className="hero-bg-wrapper">
          <img
            src="/images/hero-food.png"
            alt="Delicious food spread"
            className="hero-bg-image"
          />
          <div className="hero-overlay"></div>
        </div>

        {/* Hero Content */}
        <div className="container-custom hero-content">
          <Badge className="hero-badge animate-in fade-in slide-in-from-bottom-4 duration-700">
            COMMUNITY & TASTE
          </Badge>
          <h1 className="hero-title animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            Share the Joy of <br className="hidden md:block" />
            <span className="text-primary-foreground italic">Home Cooking</span>
          </h1>
          <p className="hero-subtitle animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Discover thousands of tested recipes from home cooks like you.
            Join our community to share your culinary masterpieces.
          </p>

          <div className="hero-buttons animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link href="/recipes">
              <Button size="lg" className="btn-hero-primary">
                Start Cooking
              </Button>
            </Link>
            <Link href="/recipes/new">
              <Button size="lg" variant="outline" className="btn-hero-outline">
                Share Recipe
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container-custom">
          <div className="categories-header">
            <h2 className="section-title-sm">Popular Categories</h2>
            <Link href="/categories" className="view-all-link">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="categories-list">
            {CATEGORIES.map((cat) => (
              <Link key={cat} href={`/search?category=${cat}`}>
                <Button variant="outline" className="category-pill">
                  {cat}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="featured-section container-custom">
        <div className="section-header-center">
          <div className="icon-badge">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <h2 className="section-title">Trending This Week</h2>
          <p className="section-desc">
            Our community is loving these dishes right now. Hand-picked favorites that guarantee a delicious meal.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-10">Loading recipes...</div>
        ) : (
          <div className="recipes-grid">
            {featuredRecipes.slice(0, 8).map((recipe) => (
              <RecipeCard key={recipe.id} {...recipe} />
            ))}
          </div>
        )}

        <div className="load-more-container">
          <Link href="/recipes">
            <Button size="lg" variant="secondary" className="font-medium px-8">
              View All Recipes
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container-custom">
          <div className="cta-card">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>

            <div className="cta-content">
              <h2 className="section-title">
                Share Your Culinary Art
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-md">
                Join thousands of food lovers. Create your profile, share recipes, and build your own cookbook.
              </p>
              <Button size="lg" className="rounded-full">
                Join Community
              </Button>
            </div>
            <div className="cta-image-col">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl transform translate-y-4"></div>
                <img
                  src="/images/recipe-thumb_3.jpg"
                  alt="Community cooking"
                  className="cta-image"
                />
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}
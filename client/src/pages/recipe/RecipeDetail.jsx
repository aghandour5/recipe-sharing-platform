

import { Navbar } from "@/components/layout/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Users, Flame, Share2, Bookmark, Star, MessageCircle, Heart, CheckCircle2, Trash2, Loader2 } from "lucide-react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function RecipeDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");
  const [ratingValue, setRatingValue] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const userStr = localStorage.getItem("user");
  const currentUser = userStr ? JSON.parse(userStr) : null;

  if (!currentUser) {
    return (
      <div className="page-container">
        <Navbar />
        <div className="container-custom py-20 flex flex-col items-center justify-center text-center min-h-[60vh]">
          <div className="bg-muted/30 p-12 rounded-3xl max-w-lg w-full">
            <h2 className="font-heading text-3xl font-bold mb-4">Login Required</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Please log in to view this recipe and join our community of food lovers.
            </p>
            <Button size="lg" onClick={() => setLocation("/login")} className="w-full">
              Log In / Register
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const { data: recipeData, isLoading, error } = useQuery({
    queryKey: [`/api/recipes/${id}`],
    enabled: !!currentUser, // Only fetch if user is logged in
  });

  // Set initial rating if user has already rated
  useEffect(() => {
    if (recipeData?.current_user_rating) {
      setRatingValue(recipeData.current_user_rating);
    }
  }, [recipeData?.current_user_rating]);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/recipes/${id}`);
    },
    onSuccess: () => {
      // Invalidate specific recipe AND the list to update Home page
      queryClient.removeQueries({ queryKey: [`/api/recipes/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/recipes"] });

      toast({ title: "Recipe deleted", description: "The recipe has been removed." });
      setLocation("/");
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Failed to delete", description: err.message });
    }
  });

  const commentMutation = useMutation({
    mutationFn: async (text) => {
      const res = await apiRequest("POST", "/api/comments", { recipe_id: id, content: text });
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "Review added", description: "Thanks for your feedback!" });
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: [`/api/recipes/${id}`] });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Error submitting comment", description: err.message });
    }
  });

  const ratingMutation = useMutation({
    mutationFn: async (val) => {
      const res = await apiRequest("POST", "/api/ratings", { recipe_id: id, value: val });
      return await res.json();
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Error submitting rating", description: err.message });
    }
  });

  if (isLoading) return <div className="page-container flex justify-center items-center h-screen">Loading...</div>;
  if (error || !recipeData) return <div className="page-container flex justify-center items-center h-screen">Recipe not found</div>;

  // Transform backend data to match UI expected format
  const recipe = {
    id: recipeData.id,
    title: recipeData.title,
    description: recipeData.description,
    image: recipeData.image_url || "/images/recipe-thumb_1.jpg",
    author: {
      id: recipeData.user.id,
      name: recipeData.user.username,
      username: recipeData.user.username,
      avatar: `https://i.pravatar.cc/150?u=${recipeData.user.id}`,
    },
    rating: parseFloat(recipeData.avg_rating) || 0,
    reviews: recipeData.comments?.length || 0,
    prepTime: recipeData.prep_time_minutes ? `${recipeData.prep_time_minutes} min` : "N/A",
    cookTime: recipeData.cook_time_minutes ? `${recipeData.cook_time_minutes} min` : "N/A",
    servings: recipeData.servings || 4,
    categories: recipeData.categories || [],
    ingredients: (recipeData.tags || []).length > 0 ? (recipeData.tags || []).map(tag => ({ section: "Tags", items: [tag.name] })) : [],
    instructions: recipeData.instructions ? recipeData.instructions.split('\n').map((step, i) => ({ step: i + 1, text: step })) : []
  };

  const isOwner = currentUser && currentUser.id === recipe.author.id;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
      deleteMutation.mutate();
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) {
      toast({
        variant: "destructive",
        title: "Review required",
        description: "Please write a comment to submit your review.",
      });
      return;
    }

    // Submit rating first (if changed or set)
    try {
      await ratingMutation.mutateAsync(ratingValue);
      // Then submit comment
      await commentMutation.mutateAsync(commentText);
    } catch (e) {
      console.error("Review submission failed", e);
    }
  };

  return (
    <div className="page-container">
      <Navbar />

      {/* Hero / Header */}
      <div className="recipe-detail-header">
        <div className="container-custom pt-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="recipe-gallery-main">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            {/* Recipe Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-primary font-medium tracking-wider uppercase">
                {recipe.categories.map(c => (
                  <Badge key={c.id} variant="outline" className="border-primary text-primary px-3 py-1">{c.name}</Badge>
                ))}
              </div>

              <div className="flex justify-between items-start">
                <h1 className="recipe-detail-title">{recipe.title}</h1>
                {isOwner && (
                  <Button variant="destructive" size="icon" onClick={handleDelete} title="Delete Recipe">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-bold text-lg text-foreground">{recipe.rating}</span>
                  <span className="text-muted-foreground">({recipe.reviews} reviews)</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="text-muted-foreground">
                  Posted {new Date(recipeData.created_at).toLocaleDateString()}
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-line">
                {recipe.description}
              </p>

              <div className="flex items-center gap-4 py-4 border-y border-border/50">
                <div className="flex items-center gap-3 pr-6 border-r border-border/50">
                  <Avatar className="h-12 w-12 border-2 border-background ring-1 ring-border">
                    <AvatarImage src={recipe.author.avatar} />
                    <AvatarFallback>{recipe.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-bold text-foreground">{recipe.author.name}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20">
                  <Heart className="mr-2 h-5 w-5" /> Save Recipe
                </Button>
                <Button size="lg" variant="secondary" className="rounded-full px-6">
                  <Share2 className="mr-2 h-5 w-5" /> Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-12 gap-12">

          {/* Left Column: Stats & Ingredients (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            {/* Quick Stats */}
            <div className="recipe-stat-card">
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Prep Time</div>
                <div className="font-heading text-xl font-bold flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> {recipe.prepTime}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Cook Time</div>
                <div className="font-heading text-xl font-bold flex items-center gap-2">
                  <Flame className="h-4 w-4 text-primary" /> {recipe.cookTime}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Servings</div>
                <div className="font-heading text-xl font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> {recipe.servings} pp
                </div>
              </div>
            </div>

            {/* Ingredients Note: Displaying raw description if no structured ingredients */}
            {recipe.ingredients.length > 0 && (
              <div className="recipe-ingredients-card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading text-2xl font-bold">Tags</h3>
                </div>
                <div className="space-y-6">
                  {recipe.ingredients.map((section, idx) => (
                    <div key={idx}>
                      <ul className="space-y-3">
                        {section.items.map((item, i) => (
                          <li key={i} className="ingredient-item">
                            <span className="text-foreground/90 leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
              Note: See description for full ingredient details.
            </div>

          </div>

          {/* Right Column: Instructions & Reviews (8 cols) */}
          <div className="lg:col-span-8 space-y-12">

            {/* Instructions */}
            <section>
              <h3 className="font-heading text-3xl font-bold mb-8 flex items-center gap-3">
                Instructions
                <span className="text-lg font-sans font-normal text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                  {recipe.instructions.length} Steps
                </span>
              </h3>

              <div className="space-y-8">
                {recipe.instructions.map((step, index) => (
                  <div key={index} className="instruction-step">
                    {/* Step Number */}
                    <div className="flex-shrink-0 relative">
                      <div className="step-number">
                        {step.step}
                      </div>
                      {index !== recipe.instructions.length - 1 && (
                        <div className="step-line"></div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="pt-1 pb-8">
                      <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-line">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            {/* Reviews Section */}
            <section>
              <h3 className="font-heading text-3xl font-bold mb-8">Reviews</h3>

              <div className="bg-muted/30 rounded-2xl p-8 mb-8">
                {currentUser ? (
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div className="space-y-2">
                      <h4 className="font-bold">Leave a review</h4>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="focus:outline-none transition-transform hover:scale-110"
                            onClick={() => setRatingValue(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            <Star
                              className={cn(
                                "h-6 w-6 transition-colors",
                                (hoverRating || ratingValue) >= star ? "fill-amber-500 text-amber-500" : "text-muted-foreground"
                              )}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {hoverRating > 0 ? `${hoverRating} Stars` : `${ratingValue} Stars`}
                        </span>
                      </div>
                    </div>

                    <Textarea
                      placeholder="What did you think of this recipe?"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <Button type="submit" disabled={commentMutation.isPending || ratingMutation.isPending}>
                      {(commentMutation.isPending || ratingMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Post Review
                    </Button>
                  </form>
                ) : (
                  <div className="text-center">
                    <p className="mb-4">Please log in to leave a review.</p>
                    <Button variant="outline" onClick={() => setLocation("/auth")}>Log In</Button>
                  </div>
                )}
              </div>

              {/* Real Comments */}
              <div className="space-y-6">
                {recipeData.comments && recipeData.comments.length > 0 ? (
                  recipeData.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 border-b pb-6 last:border-0">
                      <Avatar>
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${comment.user.id}`} />
                        <AvatarFallback>{comment.user.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{comment.user.username}</span>
                          <span className="text-xs text-muted-foreground">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-foreground mt-2">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
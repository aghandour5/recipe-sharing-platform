import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Plus, Trash2, Clock, Users, Flame, ChevronRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function CreateRecipe() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    difficulty: "medium", // Default
    servings: "4",
    prep_time_minutes: "15",
    cook_time_minutes: "30",
    image: null,
    ingredients: [{ qty: "", unit: "", name: "" }],
    instructions: [""]
  });

  const steps = [
    { number: 1, title: "Basics" },
    { number: 2, title: "Ingredients" },
    { number: 3, title: "Instructions" },
    { number: 4, title: "Review" }
  ];

  // Fetch Categories
  const { data: categories } = useQuery({
    queryKey: ["/api/categories"],
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Create FormData to handle file upload
      const form = new FormData();
      form.append("title", data.title);
      form.append("description", data.description);
      form.append("instructions", data.instructions.join("\n")); // Join instructions
      form.append("prep_time_minutes", data.prep_time_minutes);
      form.append("cook_time_minutes", data.cook_time_minutes);
      form.append("servings", data.servings);
      // Backend expects category_ids as a JSON string of array
      if (data.category_id) {
        form.append("category_ids", JSON.stringify([data.category_id]));
      }

      // Format ingredients into the description or a separate field if supported
      // Backend doesn't seem to have a dedicated structured ingredient field in the summary, 
      // but let's append them to description for now or assume backend might process them if we added a field.
      // Wait, the backend shows 'ingredients' in recipeController as text in some places or tags. 
      // Let's stick to the prompt's request to make it work. 
      // The current backend createRecipe controller does NOT parse structured ingredients. It only does title, desc, instructions.
      // I will append ingredients to the description for now to ensure they are saved somewhere.
      const ingredientsText = "\n\nIngredients:\n" + data.ingredients.map(i => `- ${i.qty} ${i.unit} ${i.name}`).join("\n");
      form.append("description", data.description + ingredientsText);

      if (data.image) {
        form.append("image", data.image);
      }

      const token = localStorage.getItem("token");
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type is distinct for FormData, don't set it manually
        },
        body: form,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create recipe");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Recipe Published!",
        description: "Your recipe has been successfully created.",
      });
      setLocation(`/recipes/${data.recipe.id}`);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      updateField("image", e.target.files[0]);
    }
  };

  // Ingredients handlers
  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, { qty: "", unit: "", name: "" }] }));
  };
  const updateIngredient = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };
  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
  };

  // Instructions handlers
  const addInstruction = () => {
    setFormData(prev => ({ ...prev, instructions: [...prev.instructions, ""] }));
  };
  const updateInstruction = (index, value) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    setFormData(prev => ({ ...prev, instructions: newInstructions }));
  };
  const removeInstruction = (index) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, instructions: newInstructions }));
  };

  const handleSubmit = () => {
    mutation.mutate(formData);
  };

  return (
    <div className="page-container">
      <Navbar />

      <div className="container-custom py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold mb-2">Create New Recipe</h1>
          <p className="text-muted-foreground">Share your culinary masterpiece with the world.</p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-10">
          <div className="stepper-container">
            <div className="stepper-track-bg"></div>
            <div className="stepper-track-progress" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}></div>

            {steps.map((s) => (
              <div
                key={s.number}
                className={cn(
                  "step-item transition-colors",
                  step >= s.number ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => setStep(s.number)}
              >
                <div className={cn(
                  "step-circle",
                  step > s.number ? "bg-primary border-primary text-primary-foreground" :
                    step === s.number ? "bg-background border-primary text-primary" :
                      "bg-background border-border text-muted-foreground"
                )}>
                  {step > s.number ? <Check className="h-4 w-4" /> : s.number}
                </div>
                <span className="text-xs font-medium hidden sm:block">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {step === 1 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Recipe Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Grandmother's Apple Pie"
                    className="text-lg font-heading"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (and intro)</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us the story behind this recipe..."
                    className="min-h-[120px]"
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(val) => updateField("category_id", val)} value={formData.category_id}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select onValueChange={(val) => updateField("difficulty", val)} value={formData.difficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="servings">Servings</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="servings"
                        type="number"
                        className="pl-9"
                        placeholder="4"
                        value={formData.servings}
                        onChange={(e) => updateField("servings", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="prep">Prep Time (min)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="prep"
                        type="number"
                        className="pl-9"
                        placeholder="15"
                        value={formData.prep_time_minutes}
                        onChange={(e) => updateField("prep_time_minutes", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cook">Cook Time (min)</Label>
                    <div className="relative">
                      <Flame className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cook"
                        type="number"
                        className="pl-9"
                        placeholder="45"
                        value={formData.cook_time_minutes}
                        onChange={(e) => updateField("cook_time_minutes", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Recipe Image</Label>
                  <Input type="file" onChange={handleImageChange} accept="image/*" />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-xl font-bold">Ingredients</h3>
                </div>

                <div className="space-y-4">
                  <div className="bg-accent/30 p-4 rounded-lg space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">List Ingredients</Label>
                    </div>
                    {formData.ingredients.map((ing, i) => (
                      <div key={i} className="flex gap-2">
                        <Input
                          placeholder="Qty"
                          className="w-20"
                          value={ing.qty}
                          onChange={(e) => updateIngredient(i, "qty", e.target.value)}
                        />
                        <Input
                          placeholder="Unit"
                          className="w-24"
                          value={ing.unit}
                          onChange={(e) => updateIngredient(i, "unit", e.target.value)}
                        />
                        <Input
                          placeholder="Ingredient name (e.g. Flour)"
                          className="flex-1"
                          value={ing.name}
                          onChange={(e) => updateIngredient(i, "name", e.target.value)}
                        />
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeIngredient(i)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary" onClick={addIngredient}>
                      <Plus className="mr-2 h-4 w-4" /> Add Ingredient
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-xl font-bold">Instructions</h3>
                </div>

                <div className="space-y-6">
                  {formData.instructions.map((inst, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center mt-1">
                        {i + 1}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder={`Step ${i + 1} instructions...`}
                          className="min-h-[80px]"
                          value={inst}
                          onChange={(e) => updateInstruction(i, e.target.value)}
                        />
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive mt-1" onClick={() => removeInstruction(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" onClick={addInstruction}>
                    <Plus className="mr-2 h-4 w-4" /> Add Step
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 4 && (
            <div className="text-center py-12">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-10 w-10 text-primary" />
              </div>
              <h2 className="font-heading text-3xl font-bold mb-4">Ready to Publish!</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-8">
                Your recipe looks delicious. Click below to share it with the community.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" onClick={handleSubmit} disabled={mutation.isPending}>
                  {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Publish Recipe
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              variant="ghost"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 4 && (
              <Button onClick={() => setStep(Math.min(4, step + 1))}>
                Next Step <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
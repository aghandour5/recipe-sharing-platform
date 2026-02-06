import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import RecipeDetail from "@/pages/recipe/RecipeDetail";
import Dashboard from "@/pages/dashboard/Dashboard";
import CreateRecipe from "@/pages/recipe/CreateRecipe";
import SearchResults from "@/pages/search/SearchResults";
import UserProfile from "@/pages/profile/UserProfile";
import About from "@/pages/About";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Contact from "@/pages/Contact";

import { Footer } from "@/components/layout/Footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/recipes" component={SearchResults} />
          <Route path="/search" component={SearchResults} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/recipes/new" component={CreateRecipe} />
          <Route path="/recipes/:id" component={RecipeDetail} />
          <Route path="/recipes/:id/edit" component={CreateRecipe} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/users/:id" component={UserProfile} />
          <Route path="/about" component={About} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/terms" component={TermsOfService} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/contact" component={Contact} />

          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
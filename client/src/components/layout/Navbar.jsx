import { Link, useLocation } from "wouter";
import { Search, Menu, X, ChefHat, User, LogIn } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isLoggedIn = !!token;
  const isAdmin = ["admin@example.com", "aghan@example.com"].includes(user?.email);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="container-custom navbar-content">
        {/* Logo */}
        <Link href="/" className="logo-link">
          <img
            src="/images/Sufra - Transparent.png"
            alt="Sufra Logo"
            className="logo-image"
          />
        </Link>

        {/* Desktop Search */}
        <div className="nav-search-container">
          <div className="nav-search-wrapper">
            <Search className="nav-search-icon" />
            <Input
              type="search"
              placeholder="Search recipes, ingredients, or chefs..."
              className="nav-search-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') setLocation(`/search?q=${e.currentTarget.value}`);
              }}
            />
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="nav-desktop-menu">
          <Link href="/recipes">
            <Button variant="ghost" className="text-foreground/80 hover:text-primary hover:bg-primary/5">
              Explore
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" className="text-foreground/80 hover:text-primary hover:bg-primary/5">
              About
            </Button>
          </Link>

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9 border-2 border-background ring-1 ring-border">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.id}`} alt={user?.username} />
                    <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["admin@example.com", "aghan@example.com"].includes(user?.email) && (
                  <Link href="/admin">
                    <DropdownMenuItem>
                      <ChefHat className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                )}
                <Link href={`/users/${user?.id}`}>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>

                {!isAdmin && (
                  <Link href={`/recipes/new`}>
                    <DropdownMenuItem>
                      <ChefHat className="mr-2 h-4 w-4" />
                      <span>Create Recipe</span>
                    </DropdownMenuItem>
                  </Link>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full px-6">Sign up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="nav-mobile-toggle">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {
        isOpen && (
          <div className="nav-mobile-menu">
            <div className="mb-4">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full bg-secondary/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setLocation(`/search?q=${e.currentTarget.value}`);
                    setIsOpen(false);
                  }
                }}
              />
            </div>
            <div className="nav-mobile-menu-links">
              <Link href="/recipes">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                  Explore Recipes
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                  About
                </Button>
              </Link>
              {isLoggedIn ? (
                <>
                  {!isAdmin && (
                    <Link href="/recipes/new">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                        Create Recipe
                      </Button>
                    </Link>
                  )}
                  <Link href={`/users/${user?.id}`}>
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                      My Profile
                    </Button>
                  </Link>
                  <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleLogout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                      <LogIn className="mr-2 h-4 w-4" /> Log in
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="w-full" onClick={() => setIsOpen(false)}>
                      Create Account
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )
      }
    </nav >
  );
}
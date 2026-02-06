import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Heart } from "lucide-react";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function RecipeCard({ id, title, image, author, rating, time, difficulty, category }) {
  return (
    <Link href={`/recipes/${id}`} className="recipe-card-link">
      <div className="group relative block h-full">
        <Card className="recipe-card group">
          <CardHeader className="p-0 relative recipe-image-wrapper">
            <img 
              src={image} 
              alt={title} 
              className="recipe-image"
            />
            <div className="recipe-actions">
              <Button 
                size="icon" 
                variant="secondary" 
                className="btn-favorite"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle save
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="recipe-category-badge">
                {category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="recipe-content">
            <div className="recipe-meta">
              <div className="recipe-rating">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-sm font-medium text-foreground">{rating}</span>
              </div>
              <div className="recipe-details">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {time}
                </span>
                <span className="capitalize text-primary font-medium">{difficulty}</span>
              </div>
            </div>
            <h3 className="recipe-title">
              {title}
            </h3>
          </CardContent>
          <CardFooter className="recipe-footer">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={author.avatar} />
                <AvatarFallback>{author.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-xs">by <span className="author-name">{author.name}</span></span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </Link>
  );
}
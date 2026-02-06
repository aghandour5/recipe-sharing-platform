import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { ChefHat, Heart, Users, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="page-container">
      <Navbar />

      <section className="about-hero">
        <div className="container-custom text-center max-w-3xl">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">Connecting the World Through Food</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            CulinaryShare is a community-driven platform where home cooks of all levels can discover, create, and share their favorite recipes.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <ChefHat className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold">For Home Cooks</h3>
              <p className="text-muted-foreground">
                We believe that the best food comes from home kitchens. We provide the tools you need to document and share your culinary journey.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold">Community First</h3>
              <p className="text-muted-foreground">
                Food brings people together. Our platform fosters a supportive community where you can connect with fellow food lovers.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="font-heading text-xl font-bold">Quality & Trust</h3>
              <p className="text-muted-foreground">
                Discover tried and tested recipes. Our rating and review system helps you find the best dishes for any occasion.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container-custom text-center">
          <h2 className="font-heading text-3xl font-bold mb-12">Meet the Developer</h2>
          <div className="flex flex-col items-center gap-6">
            <div className="team-avatar w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20">
              <img src="/images/Profile.jpg" alt="Ali Sallam Ghandour" />
            </div>
            <div className="max-w-2xl">
              <h4 className="font-bold text-2xl mb-2">Ali Sallam Ghandour</h4>
              <p className="text-primary font-medium mb-4">Full Stack Web Developer</p>
              <p className="text-muted-foreground leading-relaxed">
                Hi, I'm Ali. I am a passionate Full Stack Web Developer dedicated to building seamless and interactive web experiences.
                Specializing in modern technologies like React, Node.js, and Cloud Solutions, I created Sufra to bring food lovers together.
                I love solving complex problems and turning ideas into efficient, scalable applications.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
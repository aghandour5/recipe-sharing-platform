-- Drop tables if they exist to start fresh (useful for development)
-- Note: Order matters due to foreign key constraints. Drop dependent tables first.
DROP TABLE IF EXISTS recipe_tags;
DROP TABLE IF EXISTS recipe_categories;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Using UUIDs for user IDs
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tags table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recipes table
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    prep_time_minutes INTEGER,
    cook_time_minutes INTEGER,
    servings INTEGER,
    image_url VARCHAR(500),
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE -- If a user is deleted, their recipes are also deleted
);

-- Create recipe_categories junction table (Many-to-Many: Recipes <-> Categories)
CREATE TABLE recipe_categories (
    recipe_id UUID NOT NULL,
    category_id UUID NOT NULL,
    PRIMARY KEY (recipe_id, category_id), -- Composite primary key
    CONSTRAINT fk_recipe
        FOREIGN KEY(recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY(category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE
);

-- Create recipe_tags junction table (Many-to-Many: Recipes <-> Tags)
CREATE TABLE recipe_tags (
    recipe_id UUID NOT NULL,
    tag_id UUID NOT NULL,
    PRIMARY KEY (recipe_id, tag_id), -- Composite primary key
    CONSTRAINT fk_recipe_rt
        FOREIGN KEY(recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_tag
        FOREIGN KEY(tag_id)
        REFERENCES tags(id)
        ON DELETE CASCADE
);

-- Create ratings table
CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    value INTEGER NOT NULL CHECK (value >= 1 AND value <= 5),
    user_id UUID NOT NULL,
    recipe_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, recipe_id), -- A user can only rate a recipe once
    CONSTRAINT fk_user_rating
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_recipe_rating
        FOREIGN KEY(recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE
);

-- Create comments table
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    user_id UUID NOT NULL,
    recipe_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_user_comment
        FOREIGN KEY(user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_recipe_comment
        FOREIGN KEY(recipe_id)
        REFERENCES recipes(id)
        ON DELETE CASCADE
);

-- Create indexes for performance on frequently searched columns
CREATE INDEX idx_recipes_user_id ON recipes(user_id); -- For querying recipes by user
CREATE INDEX idx_recipes_created_at ON recipes(created_at); -- For sorting recipes by creation date
CREATE INDEX idx_ratings_recipe_id ON ratings(recipe_id);
CREATE INDEX idx_comments_recipe_id ON comments(recipe_id);
CREATE INDEX idx_recipe_categories_recipe_id ON recipe_categories(recipe_id);
CREATE INDEX idx_recipe_categories_category_id ON recipe_categories(category_id);
CREATE INDEX idx_recipe_tags_recipe_id ON recipe_tags(recipe_id);
CREATE INDEX idx_recipe_tags_tag_id ON recipe_tags(tag_id);

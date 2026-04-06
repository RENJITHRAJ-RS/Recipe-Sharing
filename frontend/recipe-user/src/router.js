import { BrowserRouter, Routes, Route } from "react-router-dom";
import Indexpage from "./components/Indexpage"; 
import Login from "./components/Login";
import Register from "./components/Register";
import Recipes from "./components/Recipes"; 
import RecipeDetails from "./components/RecipeDetails";    
import AddRecipe from "./components/AddRecipe";
import MyRecipe from "./components/MyRecipe";   
import Profile from "./components/Profile";    
import EditRecipe from "./components/EditRecipe"; 

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Indexpage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="/recipedetails/:id" element={<RecipeDetails />} />
         <Route path="/recipedetails" element={<RecipeDetails />} />

        <Route path="/addrecipe" element={<AddRecipe />} />
        <Route path="/myrecipe" element={<MyRecipe />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/editrecipe/:id" element={<EditRecipe />} />


      </Routes>
    </BrowserRouter>
  );
}

import { db } from "./firebase.config";
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc
} from "firebase/firestore";
import Header from "./component/Header";
import Footer from "./component/Footer";

interface Recipe {
  id: string;
  title: string;
  desc: string;
  ingredients: string[];
  steps: string[];
  viewing: boolean;
}

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    ingredients: [] as string[],
    steps: [] as string[],
  });
  const [popupActive, setPopupActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const recipesCollectionRef = collection(db, "recipes");

  useEffect(() => {
    const unsubscribe = onSnapshot(recipesCollectionRef, (snapshot) => {
      setRecipes(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            desc: data.desc,
            ingredients: data.ingredients,
            steps: data.steps,
            viewing: false,
          } as Recipe;
        })
      );
    });

    return () => unsubscribe();
  }, [recipesCollectionRef]);

  // Reset search when "My Recipe" clicked
  const handleHomeClick = () => {
    setSearchQuery("");
  };

  // Toggle viewing state for each recipe
  const handleView = (id: string) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id
          ? { ...recipe, viewing: !recipe.viewing }
          : { ...recipe, viewing: false }
      )
    );
  };

  // Add recipe to Firebase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.desc || !form.ingredients.length || !form.steps.length) {
      alert("Please fill out all fields");
      return;
    }

    await addDoc(recipesCollectionRef, form);

    setForm({
      title: "",
      desc: "",
      ingredients: [],
      steps: [],
    });

    setPopupActive(false);
  };

  // Update ingredient input
  const handleIngredient = (value: string, index: number) => {
    const updatedIngredients = [...form.ingredients];
    updatedIngredients[index] = value;
    setForm({ ...form, ingredients: updatedIngredients });
  };

  // Remove ingredient
  const removeIngredient = (index: number) => {
    const updatedIngredients = [...form.ingredients];
    updatedIngredients.splice(index, 1);
    setForm({ ...form, ingredients: updatedIngredients });
  };

  // Update step input
  const handleStep = (value: string, index: number) => {
    const updatedSteps = [...form.steps];
    updatedSteps[index] = value;
    setForm({ ...form, steps: updatedSteps });
  };

  // Remove step
  const removeStep = (index: number) => {
    const updatedSteps = [...form.steps];
    updatedSteps.splice(index, 1);
    setForm({ ...form, steps: updatedSteps });
  };

  // Add new ingredient input
  const handleIngredientCount = () => {
    setForm({ ...form, ingredients: [...form.ingredients, ""] });
  };

  // Add new step input
  const handleStepCount = () => {
    setForm({ ...form, steps: [...form.steps, ""] });
  };

  // Remove recipe from Firebase
  const removeRecipe = async (id: string) => {
    await deleteDoc(doc(db, "recipes", id));
  };

  // Filter recipes based on search query
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Header onSearch={(query: string) => setSearchQuery(query)} onHomeClick={handleHomeClick} />
      <div className="App">
        <h1>My Recipes</h1>

        <button onClick={() => setPopupActive(!popupActive)}>Add Recipe</button>

        <div className="recipes">
          {filteredRecipes.map((recipe) => (
            <div className="recipe" key={recipe.id}>
              <h3>{recipe.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: recipe.desc }}></p>

              {recipe.viewing && (
                <div>
                  <h4>Ingredients</h4>
                  <ul>
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>

                  <h4>Steps</h4>
                  <ol>
                    {recipe.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="buttons">
                <button onClick={() => handleView(recipe.id)}>
                  View {recipe.viewing ? "Less" : "More"}
                </button>
                <button className="remove" onClick={() => removeRecipe(recipe.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {popupActive && (
          <div className="popup">
            <div className="popup-inner">
              <h2>Add a New Recipe</h2>

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Ingredients</label>
                  {form.ingredients.map((ingredient, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "5px" }}>
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => handleIngredient(e.target.value, i)}
                      />
                      <button type="button" onClick={() => removeIngredient(i)}>
                        ❌
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={handleIngredientCount}>
                    Add Ingredient
                  </button>
                </div>

                <div className="form-group">
                  <label>Steps</label>
                  {form.steps.map((step, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "5px" }}>
                      <textarea
                        value={step}
                        onChange={(e) => handleStep(e.target.value, i)}
                      />
                      <button type="button" onClick={() => removeStep(i)}>
                        ❌
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={handleStepCount}>
                    Add Step
                  </button>
                </div>

                <div className="buttons">
                  <button type="submit">Submit</button>
                  <button type="button" className="remove" onClick={() => setPopupActive(false)}>
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default App;

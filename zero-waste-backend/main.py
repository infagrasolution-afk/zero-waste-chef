import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = FastAPI(title="Zero Waste Chef API", description="API for smart pantry and recipe suggestions")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configurar Gemini AI
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

class Ingredient(BaseModel):
    name: str

class RecipeRequest(BaseModel):
    ingredients: List[Ingredient]

class RecipeResponse(BaseModel):
    title: str
    description: str
    steps: List[str]
    missing_ingredients: List[str]

@app.get("/")
def read_root():
    return {"message": "Welcome to Zero Waste Chef API!"}

@app.post("/api/generate-recipe", response_model=RecipeResponse)
async def generate_recipe(request: RecipeRequest):
    ingredient_names = [i.name.lower() for i in request.ingredients]
    
    if not ingredient_names:
        raise HTTPException(status_code=400, detail="Debe proporcionar al menos un ingrediente")

    if not GEMINI_API_KEY:
        # Fallback al mock si no hay API Key configurada
        return {
            "title": f"Revuelto especial de {', '.join(ingredient_names[:2])}",
            "description": "NOTA: Esta es una receta simulada porque no has configurado tu GEMINI_API_KEY en el archivo .env. ¡Configúrala para ver la magia de la IA!",
            "steps": [
                "Pica finamente todos los ingredientes.",
                "Saltea en una sartén con un poco de aceite de oliva por 5 minutos.",
                "Sirve caliente y disfruta."
            ],
            "missing_ingredients": ["Sal", "Pimienta", "Aceite de oliva"]
        }

    try:
        # Prompt para la IA
        ingredients_str = ", ".join(ingredient_names)
        prompt = f"""
        Eres un chef experto en aprovechar al máximo los ingredientes (Zero Waste). 
        Tengo los siguientes ingredientes en mi cocina: {ingredients_str}.
        
        Por favor, crea una receta deliciosa usando preferiblemente solo estos ingredientes. 
        Puedes asumir que tengo ingredientes básicos como sal, pimienta, agua y aceite de cocina.
        
        Responde ESTRICTAMENTE en formato JSON válido con la siguiente estructura (NO agregues markdown de bloques de código como ```json, solo el objeto JSON):
        {{
            "title": "Nombre creativo de la receta",
            "description": "Una breve descripción apetitosa de la receta",
            "steps": ["Paso 1...", "Paso 2...", "Paso 3..."],
            "missing_ingredients": ["Ingrediente extra 1 que sugerirías comprar (opcional)", "Ingrediente extra 2"]
        }}
        """

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        
        # Limpiar la respuesta por si el LLM incluye markdown
        response_text = response.text.strip()
        if response_text.startswith("```json"):
            response_text = response_text.replace("```json", "", 1)
        if response_text.endswith("```"):
            response_text = response_text[:len(response_text)-3]
            
        recipe_data = json.loads(response_text)
        
        return recipe_data

    except Exception as e:
        print(f"Error generando receta: {e}")
        raise HTTPException(status_code=500, detail="Hubo un error al generar la receta con la IA.")

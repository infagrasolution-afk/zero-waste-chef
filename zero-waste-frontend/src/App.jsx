import React, { useState } from 'react';
import { 
  Container, Typography, Box, TextField, Button, 
  Chip, Grid, Card, CardContent,
  AppBar, Toolbar, IconButton, CircularProgress
} from '@mui/material';
import { 
  ChefHat, Plus, Utensils, Leaf, Sparkles
} from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const MotionCard = motion(Card);
const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

// Variantes para animaciones Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 } 
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function App() {
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (ingredientInput.trim() && !ingredients.includes(ingredientInput.trim())) {
      setIngredients([...ingredients, ingredientInput.trim()]);
      setIngredientInput('');
      setError('');
    }
  };

  const handleDeleteIngredient = (ingredientToDelete) => {
    setIngredients(ingredients.filter((i) => i !== ingredientToDelete));
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) {
      setError('Por favor, agrega al menos un ingrediente.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const payload = { ingredients: ingredients.map(i => ({ name: i })) };
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${API_URL}/api/generate-recipe`, payload);
      setRecipe(response.data);
    } catch (err) {
      console.error(err);
      setError('Error al conectar con el backend. Revisa que FastAPI esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'radial-gradient(circle at top right, #042f2e 0%, #0f172a 100%)',
      }}
    >
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)' }}>
        <Toolbar>
          <motion.div initial={{ rotate: -180, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ duration: 0.8, type: "spring" }}>
            <Leaf color="#10b981" size={28} style={{ marginRight: 12 }} />
          </motion.div>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main', letterSpacing: 1 }}>
            ZeroWaste Chef
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 8, mb: 8, flexGrow: 1 }}>
        <MotionBox 
          textAlign="center" 
          mb={8}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h1" gutterBottom sx={{ fontSize: { xs: '3rem', md: '4.5rem' }, background: 'linear-gradient(45deg, #34d399 30%, #10b981 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Dile adiós al Desperdicio
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400, opacity: 0.8 }}>
            Transforma lo que tienes en tu refrigerador en recetas extraordinarias usando el poder de la Inteligencia Artificial.
          </Typography>
        </MotionBox>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <MotionCard 
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              sx={{ 
                p: 3, 
                height: '100%',
                background: 'rgba(30, 41, 59, 0.4)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Utensils size={24} color="#f59e0b" style={{ marginRight: 12 }} />
                  <Typography variant="h5" fontWeight="700">Mi Despensa</Typography>
                </Box>
                
                <form onSubmit={handleAddIngredient} style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                  <TextField 
                    fullWidth 
                    variant="outlined" 
                    placeholder="Ej. Tomate, Pollo, Arroz..."
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    sx={{ 
                      '& .MuiOutlinedInput-root': { 
                        borderRadius: '12px',
                        background: 'rgba(0,0,0,0.2)',
                      } 
                    }}
                  />
                  <IconButton type="submit" color="primary" sx={{ bgcolor: 'primary.main', color: '#fff', borderRadius: '12px', '&:hover': { bgcolor: 'primary.dark' }, px: 2 }}>
                    <Plus />
                  </IconButton>
                </form>

                <Box display="flex" flexWrap="wrap" gap={1.5} mb={5}>
                  <AnimatePresence>
                    {ingredients.map((ing) => (
                      <motion.div
                        key={ing}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        layout
                      >
                        <Chip 
                          label={ing} 
                          onDelete={() => handleDeleteIngredient(ing)}
                          color="primary"
                          sx={{ 
                            borderRadius: '10px', 
                            fontWeight: 600, 
                            px: 1, py: 2, 
                            fontSize: '0.95rem',
                            background: 'rgba(16, 185, 129, 0.15)',
                            border: '1px solid rgba(16, 185, 129, 0.3)'
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {ingredients.length === 0 && (
                    <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic', opacity: 0.6 }}>
                      Agrega ingredientes para comenzar la magia...
                    </Typography>
                  )}
                </Box>

                {error && <Typography color="error" variant="body2" mb={2}>{error}</Typography>}

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    fullWidth 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={handleGenerateRecipe}
                    disabled={loading || ingredients.length === 0}
                    startIcon={loading ? <CircularProgress size={24} color="inherit"/> : <Sparkles />}
                    sx={{ 
                      py: 1.8, 
                      fontSize: '1.1rem',
                      background: 'linear-gradient(45deg, #10b981 30%, #34d399 90%)',
                      boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.5)'
                    }}
                  >
                    {loading ? 'Consultando al Chef AI...' : 'Generar Receta'}
                  </Button>
                </motion.div>
              </CardContent>
            </MotionCard>
          </Grid>

          <Grid item xs={12} md={7}>
            <AnimatePresence mode="wait">
              {recipe ? (
                <MotionCard 
                  key="recipe"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  sx={{ 
                    height: '100%', 
                    borderColor: 'rgba(16, 185, 129, 0.3)', 
                    borderWidth: 2, 
                    borderStyle: 'solid',
                    background: 'rgba(30, 41, 59, 0.6)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.15)'
                  }}
                >
                  <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                    <MotionBox variants={containerVariants} initial="hidden" animate="visible">
                      <MotionTypography variants={itemVariants} variant="overline" color="primary.main" fontWeight="bold" sx={{ letterSpacing: 2 }}>
                        ¡Voilá! Tu Receta Está Lista
                      </MotionTypography>
                      
                      <MotionTypography variants={itemVariants} variant="h3" gutterBottom mt={1} sx={{ fontWeight: 800 }}>
                        {recipe.title}
                      </MotionTypography>
                      
                      <MotionTypography variants={itemVariants} variant="body1" color="text.secondary" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                        {recipe.description}
                      </MotionTypography>
                      
                      <MotionBox variants={itemVariants} mt={5}>
                        <Typography variant="h5" fontWeight="700" gutterBottom display="flex" alignItems="center">
                          <ChefHat size={24} style={{ marginRight: 12, color: '#f59e0b' }}/>
                          Paso a Paso
                        </Typography>
                        <Box component="ol" sx={{ pl: 3, m: 0, mt: 2 }}>
                          {recipe.steps.map((step, idx) => (
                            <Typography component="li" key={idx} sx={{ mb: 2, color: 'text.primary', fontSize: '1.05rem', lineHeight: 1.6 }}>
                              {step}
                            </Typography>
                          ))}
                        </Box>
                      </MotionBox>

                      {recipe.missing_ingredients && recipe.missing_ingredients.length > 0 && (
                        <MotionBox variants={itemVariants} mt={5} p={3} sx={{ bgcolor: 'rgba(245, 158, 11, 0.05)', borderRadius: 4, border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                          <Typography variant="subtitle1" color="secondary.main" fontWeight="bold" mb={1}>
                            Tip del Chef: Quedaría aún mejor si tuvieras...
                          </Typography>
                          <Box display="flex" flexDirection="column" gap={1.5} mt={2}>
                            {recipe.missing_ingredients.map((miss, i) => (
                              <Box 
                                key={i} 
                                sx={{ 
                                  display: 'flex', 
                                  alignItems: 'flex-start',
                                  bgcolor: 'rgba(245, 158, 11, 0.1)', 
                                  p: 1.5, 
                                  borderRadius: 2,
                                  border: '1px solid rgba(245, 158, 11, 0.2)'
                                }}
                              >
                                <Sparkles size={18} color="#f59e0b" style={{ marginRight: 10, marginTop: 2, flexShrink: 0 }} />
                                <Typography variant="body2" sx={{ color: '#fbbf24', lineHeight: 1.5, fontWeight: 500, textAlign: 'left' }}>
                                  {miss}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </MotionBox>
                      )}
                    </MotionBox>
                  </CardContent>
                </MotionCard>
              ) : (
                <MotionBox 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center', 
                    justifyContent: 'center',
                    border: '2px dashed rgba(255,255,255,0.1)',
                    borderRadius: 4,
                    p: 6,
                    textAlign: 'center',
                    background: 'rgba(30, 41, 59, 0.2)'
                  }}
                >
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
                    <ChefHat size={64} color="rgba(255,255,255,0.15)" style={{ marginBottom: 24 }} />
                  </motion.div>
                  <Typography variant="h5" color="text.secondary" fontWeight="600" gutterBottom>
                    El horno está encendido
                  </Typography>
                  <Typography variant="body1" color="text.disabled" sx={{ maxWidth: 300 }}>
                    Ingresa tus ingredientes a la izquierda y deja que nuestra IA haga el resto.
                  </Typography>
                </MotionBox>
              )}
            </AnimatePresence>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default App;

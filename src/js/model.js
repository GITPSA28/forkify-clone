import { API_URL, API_KEY, RESULTS_PER_PAGE } from './config';
import { AJAX } from './helpers';
// import { getJSON, sendJSON } from './helpers';
export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    resultsPerPage: RESULTS_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const presistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const getRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);
    const isBookmarked = state.bookmarks.some(
      books => books.id === state.recipe.id
    );
    if (isBookmarked) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    throw error;
  }
};
export const loadSearchResult = async function () {
  try {
    // https://forkify-api.herokuapp.com/api/v2/recipes?search=pizza
    const data = await AJAX(
      `${API_URL}?search=${state.search.query}&key=${API_KEY}`
    );
    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0;
  const end = page * state.search.resultsPerPage; //9
  return state.search.result.slice(start, end);
};
export const setQuery = function (query) {
  state.search.query = query;
};

export const getUpdatedServings = function (servings) {
  if (servings < 1) return state.recipe;
  const oldServing = state.recipe.servings;
  state.recipe.servings = servings;
  const multiplier = servings / oldServing;
  const updatedIngredients = state.recipe.ingredients.map(rec => {
    if (!rec.quantity) return rec;
    return { ...rec, quantity: rec.quantity * multiplier };
  });
  state.recipe.ingredients = updatedIngredients;
  return state.recipe;
};
// loadSearchResult('pizza');

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  state.recipe.bookmarked = true;
  presistBookmark();
};
export const removeBookmark = function (id) {
  const index = state.bookmarks.findIndex(book => book.id === id);
  state.bookmarks.splice(index, 1);

  //   state.bookmarks = state.bookmarks.filter(bookmark => bookmark.id !== id);
  state.recipe.bookmarked = false;
  presistBookmark();
};

const retriveBookmarks = function () {
  const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  if (bookmarks) state.bookmarks = bookmarks;
};

retriveBookmarks();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingrArr = ing[1].split(',').map(el => el.trim());
        if (ingrArr.length !== 3)
          throw new Error(
            'Wrong ingredient format, please use the correct format'
          );
        const [quantity, unit, description] = ingrArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

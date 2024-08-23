import * as model from './model.js';
import recipieView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipieView.renderSpinner();

    resultView.update(model.getSearchResultPage());
    bookmarkView.update(model.state.bookmarks);

    await model.getRecipe(id);

    const { recipe } = model.state;
    recipieView.render(recipe);
  } catch (error) {
    recipieView.renderError();
  }
};

const controlResults = async function () {
  try {
    const query = searchView.getQuery();
    if (!query) return;
    resultView.renderSpinner();
    model.setQuery(query);
    await model.loadSearchResult();
    // const { result } = model.state.search;
    resultView.render(model.getSearchResultPage());
    paginationView.render(model.state.search);
  } catch (error) {
    resultView.renderError();
  }
};

const addBookmark = function () {
  if (model.state.recipe.bookmarked)
    model.removeBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);
  recipieView.update(model.state.recipe);
  bookmarkView.render(model.state.bookmarks);
};

const controlPagination = function (gotoPage) {
  // model.state.search.page = page;
  resultView.render(model.getSearchResultPage(gotoPage));
  paginationView.render(model.state.search);
};

const controlServings = function (servings) {
  recipieView.update(model.getUpdatedServings(servings));
};
const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (recipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(recipe);

    recipieView.render(model.state.recipe);
    bookmarkView.render(model.state.bookmarks);
    addRecipeView.renderMessage();
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // addRecipeView.toggleWindow();
  } catch (error) {
    addRecipeView.renderError(error.message);
  }
};
(function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipieView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlResults);
  paginationView.addHandlerPageination(controlPagination);
  recipieView.addHandlerServings(controlServings);
  recipieView.addHandlerBookmark(addBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
})();

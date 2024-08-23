import View from './view.js';
import previewView from './previewView.js';
import icons from '../../img/icons.svg';
class BookmarkView extends View {
  _parentContainer = document.querySelector('.bookmarks');
  _errorMessage = 'No Bookmark added yet, try adding one : ) ';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}
export default new BookmarkView();

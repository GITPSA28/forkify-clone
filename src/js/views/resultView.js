import View from './view.js';
import previewView from './previewView.js';
import icons from '../../img/icons.svg';
class resultView extends View {
  _parentContainer = document.querySelector('.results');
  _errorMessage = 'No Recipe found for your query, please try again : ) ';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}
export default new resultView();

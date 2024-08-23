import icons from '../../img/icons.svg';
export default class View {
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentContainer.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) return;
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = newDOM.querySelectorAll('*');
    const oldElements = this._parentContainer.querySelectorAll('*');

    oldElements.forEach((oldEl, i) => {
      const newEl = newElements[i];
      if (
        !newEl.isEqualNode(oldEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        oldEl.textContent = newEl.textContent;
      if (!newEl.isEqualNode(oldEl)) {
        Array.from(newEl.attributes).forEach((attr, i) =>
          oldEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }
  _clear() {
    this._parentContainer.innerHTML = '';
  }
  renderSpinner() {
    const mark = `
      <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div>
      `;
    this._clear();
    this._parentContainer.insertAdjacentHTML('afterbegin', mark);
  }
  renderError(message = this._errorMessage) {
    const mark = `
        <div class="error">
              <div>
                <svg>
                  <use href="${icons}#icon-alert-triangle"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
        `;
    this._clear();
    this._parentContainer.insertAdjacentHTML('afterbegin', mark);
  }
  renderMessage(message = this._message) {
    const mark = `
        <div class="message">
              <div>
                <svg>
                  <use href="${icons}#icon-smile"></use>
                </svg>
              </div>
              <p>${message}</p>
            </div>
        `;
    this._clear();
    this._parentContainer.insertAdjacentHTML('afterbegin', mark);
  }
}

import View from './view.js';
import icons from '../../img/icons.svg';
class PaginationView extends View {
  _parentContainer = document.querySelector('.pagination');
  _errorMessage = 'Page error.';
  _message = '';
  addHandlerPageination(handler) {
    this._parentContainer.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }
  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultsPerPage
    );
    //page 1 has other pages
    if (numPages > 1 && curPage === 1)
      return `
          <button data-goto="${
            curPage + 1
          }" class="btn--inline pagination__btn--next">
          <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
              </svg>
              </button> `;
    //page 1 has no other pages

    //last pages
    if (curPage === numPages)
      return `
    
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
           `;
    //other pages
    if (curPage > 1 && curPage < numPages)
      return `
    <button data-goto="${
      curPage - 1
    }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${curPage - 1}</span>
          </button>
          <button data-goto="${
            curPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${curPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button> `;
    if (numPages === 1)
      return `
    `;
  }
}
export default new PaginationView();

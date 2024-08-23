class SearchView {
  #parentContainer = document.querySelector('.search');

  getQuery() {
    const query = this.#parentContainer.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }
  #clearInput() {
    this.#parentContainer.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    this.#parentContainer.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}
export default new SearchView();

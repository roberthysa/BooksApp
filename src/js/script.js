/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{

  'use strict';

  const select = {
    templateOf: {
      bookTemplate: '#template-book',
    },
    containerOf: {
      booksList: '.books-list',
      filters: '.filters',
    },
    imageOf: {
      bookImage: 'book__image'
    }
  };

  const classNames = {
    favoriteBook: 'favorite',
    hidden: 'hidden',
  };

  const templates = {
    bookTemplate: Handlebars.compile(document.querySelector(select.templateOf.bookTemplate).innerHTML),
  };

  class BooksList {
    constructor() {
      const thisBooksList = this;

      thisBooksList.data = dataSource.books;

      thisBooksList.getElements ();
      thisBooksList.render();
      thisBooksList.determineRatingBgc();
      thisBooksList.initActions();
    }

    getElements() {
      const thisBooksList = this;

      thisBooksList.bookContainer = document.querySelector(select.containerOf.booksList);
      console.log('thisBooksList.bookContainer in getElements:', thisBooksList.bookContainer);

      thisBooksList.filtersContainer = document.querySelector(select.containerOf.filters);
      console.log('thisBooksList.filtersContainer in getElements:', thisBooksList.filtersContainer);

      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];
    }

    render() {
      const thisBooksList = this;

      for (let book of dataSource.books) {
        const rating = book.rating;
        book.ratingBgc = thisBooksList.determineRatingBgc(rating);

        const generatedHTML = templates.bookTemplate(book);
        const element = utils.createDOMFromHTML(generatedHTML);
        thisBooksList.bookContainer.appendChild(element);
      }
    }

    initActions() {
      const thisBooksList = this;

      thisBooksList.bookContainer.addEventListener('dblclick', function (event) {
        event.preventDefault();

        const clickedElement = event.target.offsetParent;

        if(clickedElement.classList.contains(select.imageOf.bookImage)) {
          const bookId = clickedElement.getAttribute('data-id');

          if (!thisBooksList.favoriteBooks.includes(bookId)) {
            clickedElement.classList.add(classNames.favoriteBook);
            thisBooksList.favoriteBooks.push(bookId);

          } else {

            clickedElement.classList.remove(classNames.favoriteBook);
            thisBooksList.favoriteBooks.splice(thisBooksList.favoriteBooks.indexOf(bookId), 1);
          }
        }
      });

      const filter = document.querySelector(select.containerOf.filters);
      filter.addEventListener('change', function (event) {
        event.preventDefault();

        const clickedElement = event.target;

        if (clickedElement.tagName == 'INPUT' && clickedElement.type == 'checkbox' && clickedElement.name == 'filter') {
          console.log('clickedElement.value:', clickedElement.value);

          if (clickedElement.checked) {
            thisBooksList.filters.push(clickedElement.value);


          } else {

            const index = thisBooksList.filters.indexOf(clickedElement.value);
            if (index >= 0) {
              thisBooksList.filters.splice(index, 1);
            }

          }
        }
        thisBooksList.filterBooks();
        console.log('filters:', thisBooksList.filters);

      });
    }

    filterBooks() {
      const thisBooksList = this;

      for (let book of dataSource.books) {
        let shouldBeHidden = false;

        for (let filter of thisBooksList.filters) {
          if (!book.details[filter]) {
            shouldBeHidden = true;
            break;
          }
        }

        if (shouldBeHidden) {
          const hiddenBook = document.querySelector('.book__image[data-id="' + book.id + '"]');
          hiddenBook.classList.add(classNames.hidden);

        } else {
          const hiddenBook = document.querySelector('.book__image[data-id="' + book.id + '"]');
          hiddenBook.classList.remove(classNames.hidden);
        }
      }
    }

    determineRatingBgc(rating){
      const thisBooksList = this;

      if(rating<6){
        thisBooksList.background  = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);';
      }

      if(rating >6 && rating<=8){
        thisBooksList.background  = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);';
      }

      if(rating>8 && rating<=9){
        thisBooksList.background  = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);';
      }

      if(rating>9){
        thisBooksList.background  = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);';
      }

      return thisBooksList.background ;

    }


  }

  const app = {
    init: function () {
      //const thisApp = this;

      //console.log('thisApp:', thisApp);

      new BooksList();
    },
  };

  app.init();
}

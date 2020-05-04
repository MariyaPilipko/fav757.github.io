'use strict';

// Temp database that will be moved to backend
const database = {
  // Information about articles
  articles: [
    {
      name: 'borsh',
      date: new Date('05/01/2020')
    },

    {
      name: 'vino',
      date: new Date('05/02/2020')
    },

    {
      name: 'food-for-homeless',
      date: new Date('05/03/2020')
    },

    {
      name: 'buns',
      date: new Date('05/04/2020')
    }
  ],
};

// Sort articles by date
database.articles.sort((a, b) => b.date - a.date);

// Page elements variables
const pageElements = {
  topMenu: document.body.querySelector('.top-menu'),
  topMenuOpenButton: document.body.querySelector('.top-menu_nav-open-button'),
  topMenuMobileMenu: document.body.querySelector('.top-menu_mobile-menu'),
  heroCenterButton: document.getElementById('hero-zone-button'),
  socialInfo: document.body.querySelector('.social-info'),
  main: document.getElementById('main'),
  content: document.querySelector('.content'),
  buttonForArticles: document.body.querySelector('.content .fas, .fa-plus'),
  footer: document.body.querySelector('footer')
}

// Top menu change color on scroll
document.addEventListener('scroll', function () {
  if (window.pageYOffset) {
    pageElements.topMenu.style.background = 'white';
    pageElements.topMenu.style.color = 'black';
    pageElements.topMenu.style.boxShadow = '0 2px 2px gray';
  } else {
    pageElements.topMenu.style.background = '';
    pageElements.topMenu.style.color = '';
    pageElements.topMenu.style.boxShadow = '';
  }
});

// Top menu event for open
pageElements.topMenuOpenButton.addEventListener('click', function () {
  if (pageElements.topMenuMobileMenu.style.display) {
    pageElements.topMenuMobileMenu.style.display = '';
  } else {
    pageElements.topMenuMobileMenu.style.display = 'block';
  }
});

// Header button on press scroll to main part
pageElements.heroCenterButton.addEventListener('click', function () {
  pageElements.socialInfo.scrollIntoView({ behavior: "smooth" });
});

// Open section
function openArticles() {
  if(document.querySelector('article-preview')) {
    pageElements.socialInfo.scrollIntoView({behavior: 'smooth'});
  } else {
    pageElements.content.innerHTML = '<article-preview></article-preview>';
    pageElements.socialInfo.scrollIntoView({behavior: 'smooth'});
  }
}

// Class for article
class ArticlePreview extends HTMLElement {
  constructor() {
    super();

    // Get no used article from database
    const getNotUsedArticle = () => {
      for (let article of database.articles) {
        if (!pageElements.content.querySelector(`[name="${article.name}"]`)) {
          return article;
        }
      }
    }
    const notUsedArticle = getNotUsedArticle();

    // Set up article attributes
    this.setAttribute('name', notUsedArticle.name);
    this.className = 'content_article';

    // Get text for article and append it on the page
    fetch(`resources/articles/${notUsedArticle.name}.html`)
      .then((response) => response.text())
      .then((html) => {
        this.innerHTML = html;
        this.style.opacity = 1;
      });

    // Create or move button that loads more articles
    let loadMoreArticlesButton =
      this.parentElement.querySelector('.content-load-more-articles');

    if (loadMoreArticlesButton) {
      this.after(loadMoreArticlesButton);
    } else {
      this.insertAdjacentHTML(
        'afterEnd',
        '<i class="content-load-more-articles fas fa-plus"></i>'
      );
      loadMoreArticlesButton =
        this.parentElement.querySelector('.content-load-more-articles');
    }

    // Create event that loads more articles
    loadMoreArticlesButton.addEventListener('click', function () {
      if (!getNotUsedArticle()) {
        this.remove();
      } else {
        this.parentElement.insertAdjacentHTML(
          'beforeEnd',
          '<article-preview></article-preview>'
        );
      }
    });

    //Create event for article header to open article
    this.addEventListener('click', function (event) {
      if (event.target.tagName !== 'H3') return;
      pageElements.content.style.opacity = 0;

      pageElements.content.ontransitionend = () => {
        pageElements.content.innerHTML = '<div></div>';

        pageElements.content.firstElementChild.className = 'content_article-fullsize';
        pageElements.content.firstElementChild.innerHTML = this.innerHTML;

        pageElements.content.style.opacity = 1;
        pageElements.socialInfo.scrollIntoView({ behavior: "smooth" });

        // Event for closing news tab
        pageElements.content.firstElementChild.addEventListener('click', function (event) {
          if (event.target.className === 'content_article_close-button fas fa-times') {
            pageElements.content.style.opacity = 0;

            pageElements.content.ontransitionend = () => {
              pageElements.content.innerHTML =
                '<article-preview></article-preview>' +
                '<article-preview></article-preview>';

              pageElements.content.style.opacity = 1;
              pageElements.content.ontransitionend = null;

              pageElements.socialInfo.scrollIntoView({ behavior: "smooth" });
            }
          }
        });
      }
    });
  }
}

customElements.define('article-preview', ArticlePreview);
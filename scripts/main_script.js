'use strict';

// Temp database that will be moved to backend
const database = {
  // Information about articles
  articles: [
    {
      name: 'borsh',
      date: new Date('05/11/2020')
    },

    {
      name: 'vino',
      date: new Date('05/13/2020')
    },

    {
      name: 'food-for-homeless',
      date: new Date('05/10/2020')
    }
  ],
};

// Page elements variables
const pageElements = {
  topMenu: document.body.querySelector('.top-menu'),
  heroCenterButton: document.getElementById('hero-zone-button'),
  socialInfo: document.body.querySelector('.social-info'),
  main: document.getElementById('main'),
  content: document.querySelector('.content'),
  buttonForArticles: document.body.querySelector('.content .fas, .fa-plus')
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

// Header button on press scroll to main part
pageElements.heroCenterButton.addEventListener('click', function () {
  pageElements.socialInfo.scrollIntoView({ behavior: "smooth" });
});

// Class for article
class ArticlePreview extends HTMLElement {
  constructor() {
    super();

    // Get no used article from database
    let notUsedArticle;
    for (let article of database.articles) {
      if (!pageElements.content.querySelector(`[name="${article.name}"]`)) {
        notUsedArticle = article;
        break;
      }
    }

    // Set up article attributes
    this.setAttribute('name', notUsedArticle.name);
    this.className = 'content_article';

    // Get text for article and append it on the page
    fetch(`resources/articles/${notUsedArticle.name}.html`)
      .then((response) => response.text())
      .then((html) => this.innerHTML = html);

    const loadMoreArticlesButton =
      this.parentElement.querySelector('.content-load-more-articles');

    if (loadMoreArticlesButton) {
      
    }
  }
}

customElements.define('article-preview', ArticlePreview);

  // // Create event for article header to open article
  // static createEventForOpenArticle(article) {
  //   const articleHeader = article.querySelector('h3');

  //   articleHeader.addEventListener('click', () => {
  //     pageElements.content.style.opacity = 0;

  //     pageElements.content.ontransitionend = () => {
  //       pageElements.content.style.display = 'none';
  //       pageElements.content.style.opacity = 1;
  //       pageElements.buttonForArticles.style.display = 'none';

  //       article.className = 'content_article-fullsize';
  //       document.getElementById('preview-hidden-text').hidden = false;

  //       pageElements.main.append(article);
  //     }
  //   });
  // }
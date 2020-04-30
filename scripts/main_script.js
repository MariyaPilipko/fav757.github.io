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

// Top menu change color on scroll
document.addEventListener('scroll', function () {
  const topMenu = document.body.querySelector('.top-menu');

  if (window.pageYOffset) {
    topMenu.style.background = 'white';
    topMenu.style.color = 'black';
    topMenu.style.boxShadow = '0 2px 2px gray';
  } else {
    topMenu.style.background = '';
    topMenu.style.color = '';
    topMenu.style.boxShadow = '';
  }
});

// Header button on press scroll to main part
document.getElementById('hero-zone-button').addEventListener('click', function () {
  document.body.querySelector('.social-info').scrollIntoView({ behavior: "smooth" });
});

// Describes behavior of articles element
class ArticlesPreviews extends HTMLElement {
  constructor() {
    super();

    // Create element that will load more articles
    const buttonForMoreArticle = document.createElement('i');
    buttonForMoreArticle.className = 'fas fa-plus';
    buttonForMoreArticle.addEventListener('click', function () {
      ArticlesPreviews.loadArticles();
      buttonForMoreArticle.scrollIntoView({ behavior: 'smooth' });
    });
    this.after(buttonForMoreArticle);

    // Intial article load
    ArticlesPreviews.loadArticles();
  }

  // Load a new article
  static async loadArticles() {
    const element = document.querySelector('.content');

    // Get not used article
    let notUserArticle;
    for (let article of database.articles) {
      if (!element.querySelector(`[name="${article.name}"]`)) {
        notUserArticle = article;
        break;
      }
    }

    // Get response from server with article html and add it on the page
    const response = await fetch(`resources/articles/${notUserArticle.name}.html`);
    const htmlText = await response.text();
    element.insertAdjacentHTML('beforeEnd', htmlText);

    // Set name for atricle (used for checking if it's on the page)
    element.lastElementChild.setAttribute('name', notUserArticle.name);
  }
}

customElements.define('articles-preview', ArticlesPreviews);
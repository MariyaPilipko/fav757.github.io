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

    // Create and style button for loading more articles
    const buttonForMoreArticle = document.createElement('i');
    buttonForMoreArticle.className = 'fas fa-plus';

    // Scroll article into view
    buttonForMoreArticle.addEventListener('click', function () {
      ArticlesPreviews.loadArticles();
      buttonForMoreArticle.scrollIntoView({ behavior: 'smooth' });
    });

    // Append button into the page
    this.after(buttonForMoreArticle);

    // Intial article load
    ArticlesPreviews.loadArticles();
  }

  // Parent element for articles
  static element = document.querySelector('.content');

  // Get article that is not used on the page
  static getNotUsedArticle() {
    let notUserArticle;

    for (let article of database.articles) {
      if (!this.element.querySelector(`[name="${article.name}"]`)) {
        notUserArticle = article;
        return notUserArticle;
      }
    }
  }

  // Load a new article
  static async loadArticles() {
    //get not used article text
    const notUsedArticle = this.getNotUsedArticle();

    // Get response from server with article html and add it on the page
    const response = await fetch(`resources/articles/${notUsedArticle.name}.html`);
    const htmlText = await response.text();

    // Create article and add text to it
    const article = document.createElement('article');
    article.innerHTML = htmlText;

    // Set name and class for article
    article.setAttribute('name', notUsedArticle.name);
    article.className = 'content_article';

    // Open aricle event
    const articleHeader = article.querySelector('h3');
    articleHeader.addEventListener('click', function (event) {
      alert('hello')
    });

    //Push article
    this.element.append(article);
  }
}

customElements.define('articles-preview', ArticlesPreviews);
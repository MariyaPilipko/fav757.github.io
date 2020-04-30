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

// Get article that is not used on the page
function getNotUsedArticle() {
  let notUserArticle;

  for (let article of database.articles) {
    if (!pageElements.content.querySelector(`[name="${article.name}"]`)) {
      notUserArticle = article;
      return notUserArticle;
    }
  }
}

// Load a new article
async function loadArticles() {
  //get not used article text
  const notUsedArticle = getNotUsedArticle();

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
  articleHeader.addEventListener('click', (event) => {
    pageElements.content.style.opacity = 0;

    pageElements.content.ontransitionend = () => {
      pageElements.content.style.display = 'none';
      pageElements.buttonForArticles.style.display = 'none';

      pageElements.content.style.opacity = 1;

      pageElements.main.append(article);
    }
  });

  //Push article
  pageElements.content.append(article);
}

// Event to load more articles
pageElements.buttonForArticles.addEventListener('click', function () {
  loadArticles();
  pageElements.buttonForArticles.scrollIntoView({ behavior: 'smooth' });
});
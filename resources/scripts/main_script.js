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
    },

    {
      name: 'meatball',
      date: new Date('05/24/2020')
    }
  ],
};

// Sort articles by date
database.articles.sort((a, b) => b.date - a.date);

// Page elements variables
const pageElements = {
  askButton: document.body.querySelector('.ask-us-button'),
  scrollTopButton: document.body.querySelector('.move-top-button'),
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

// functions for creating contact modal window
function blockPage() {
  const backgr = document.createElement("div");
  backgr.className = "dark-frame";

  document.body.style.overflow = "hidden";
  document.body.append(backgr);

  return backgr;
}

function createModal() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `<div class="modal__header">
      <h2>Please, leave your message here!</h2>
    </div>
    <div class="modal__body">
      <textarea class="modal__textarea"></textarea>
    </div>
    <div class="modal__footer">
      <button class="modal__close-button">Close</button>
      <button class="modal__send-button">Send</button>
    </div>`;

  return modal;
}

function setUpModal() {
  const backgr = blockPage();
  const modal = createModal();

  modal.addEventListener("click", (event) => {
    if (event.target.className !== "modal__close-button") return;

    document.body.style.overflow = '';
    backgr.style.opacity = 0;
    backgr.ontransitionend = () => backgr.remove();
  });

  modal.addEventListener("click", (event) => {
    if (event.target.className !== "modal__send-button") return;

    alert("Thank you for your opinion!");

    document.body.style.overflow = '';
    backgr.style.opacity = 0;
    backgr.ontransitionend = () => backgr.remove();
  });

  backgr.append(modal);
}

// Top menu and scroll top button change color on scroll
document.addEventListener('scroll', function () {
  if (window.pageYOffset) {
    pageElements.topMenu.style.background = 'white';
    pageElements.topMenu.style.color = 'black';
    pageElements.topMenu.style.boxShadow = '0 2px 2px gray';

    pageElements.scrollTopButton.style.color = 'black';
    pageElements.scrollTopButton.style.borderColor = 'black';

    pageElements.askButton.style.color = 'black';
    pageElements.askButton.style.borderColor = 'black';
  } else {
    pageElements.topMenu.style.background = '';
    pageElements.topMenu.style.color = '';
    pageElements.topMenu.style.boxShadow = '';

    pageElements.scrollTopButton.style.color = '';
    pageElements.scrollTopButton.style.borderColor = '';

    pageElements.askButton.style.color = '';
    pageElements.askButton.style.borderColor = '';
  }
});

// Event for ask button to open modal window
pageElements.askButton.addEventListener('click', createModal);

// Add event to scroll page to the top
pageElements.scrollTopButton.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth"
  });
});

// Top menu event for open
pageElements.topMenuOpenButton.addEventListener('click', function () {
  if (pageElements.topMenuMobileMenu.style.display) {
    pageElements.topMenuMobileMenu.style.display = '';
  } else {
    pageElements.topMenuMobileMenu.style.display = 'block';
  }
});

// Header button on press goes to the about us section
pageElements.askButton.addEventListener('click', setUpModal);

// Open section
function openArticles() {
  if (document.querySelector('article-preview')) {
    pageElements.socialInfo.scrollIntoView({ behavior: 'smooth' });
  } else {
    pageElements.content.innerHTML = '<article-preview></article-preview>';
    pageElements.socialInfo.scrollIntoView({ behavior: 'smooth' });
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
    fetch(`resources/pages/${notUsedArticle.name}.html`)
      .then((response) => response.text())
      .then((html) => {
        this.innerHTML = html;

        // Insert date
        const articleDate = notUsedArticle.date.getDate() +
          '/' + notUsedArticle.date.getMonth() +
          '/' + notUsedArticle.date.getFullYear();

        this.querySelector('.content_article_preview-text_header').insertAdjacentHTML(
          'afterend',
          `<i>Article's date: ${articleDate}</i><hr>`
        );

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

async function loadAboutUsSection() {
  const response = await fetch('resources/pages/aboutus.html');
  const html = await response.text();

  pageElements.content.innerHTML = html;

  pageElements.socialInfo.scrollIntoView({ behavior: 'smooth' });
}

// Search throw aricles
async function search(searchQuery) {
  const articles = [];
  const articlesHTML = [];

  for (let article of database.articles) {
    articles.push(
      await fetch(`resources/pages/${article.name}.html`)
        .then(response => response.text())
        .then((html) => articlesHTML.push(html))
      );
  }

  const searchQueryRegExp = new RegExp(`${searchQuery}`, 'im');

  articlesHTML.forEach(elem => {
    if (!searchQuery) return;
    
    if (searchQueryRegExp.test(elem)) {
      const article = document.createElement('article');
      article.innerHTML = elem;

      article.className = 'content_article-fullsize';
      article.addEventListener('click', function (event) {
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
      
      if (!pageElements.content.querySelector('article')) {
        pageElements.content.innerHTML = '';
      }

      pageElements.content.append(article);
      return;
    }
  });
  alert('Ничего не найденно');
}

function startSearch(event) {
  if (event.target.tagName !== 'LI') return;

  const searchForm = event.currentTarget.firstElementChild;

  searchForm.style.display?
    searchForm.style.display = '':
    searchForm.style.display = 'flex';

  searchForm.lastElementChild.addEventListener('click', function (e) {
    searchForm.style.display = 'none';
    pageElements.socialInfo.scrollIntoView({ behavior: 'smooth' });

    search(searchForm.firstElementChild.value);
  });
}
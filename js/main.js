document.addEventListener("DOMContentLoaded", () => {
  setupIcons();
  setupMenu();
  setupContactForm();
  setupFooterYear();
  loadYouTubeVideos();
  // loadBlogPosts(); // Uncomment this line to load blog posts
});

// Setup Lucide icons
function setupIcons() {
  lucide.createIcons();
}

// Setup mobile hamburger menu toggle
function setupMenu() {
  const menuButton = document.getElementById("menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
}

// Setup contact form submit handler
function setupContactForm() {
  const contactForm = document.querySelector("form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Merci pour votre message !");
    });
  }
}

// Set the footer year dynamically
function setupFooterYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// Load YouTube Videos
async function loadYouTubeVideos() {
  const videosContainer = document.getElementById("videos-container");
  if (!videosContainer) return;

  // Step 1: Show skeletons
  videosContainer.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    videosContainer.appendChild(createSkeletonCard());
  }

  try {
    const response = await fetch("/.netlify/functions/fetchYouTubeVideos");
    const videos = await response.json();

    videosContainer.innerHTML = "";

    videos.forEach((video) => {
      const videoElement = document.createElement("a");
      videoElement.href = `https://www.youtube.com/watch?v=${video.id}`;
      videoElement.target = "_blank";
      videoElement.className =
        "block bg-white p-6 rounded-lg shadow-md flex flex-col cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-300";

      videoElement.innerHTML = `
          <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-48 object-cover rounded mb-4">
          <h3 class="text-xl font-bold mb-2">${video.title}</h3>
        `;

      videosContainer.appendChild(videoElement);
    });
  } catch (error) {
    console.error("Erreur de chargement des vidéos:", error);
    videosContainer.innerHTML =
      '<p class="text-center text-gray-500">Impossible de charger les vidéos pour le moment.</p>';
  }
}

// Load Blog Posts
async function loadBlogPosts() {
  const blogPostsContainer = document.getElementById("blog-posts");
  const placeholderImage = "./images/defaultBlogImage.png";

  if (!blogPostsContainer) return;

  // Step 1: Show skeletons
  blogPostsContainer.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    blogPostsContainer.appendChild(createSkeletonCard(true));
  }

  try {
    const response = await fetch(
      "https://api.rss2json.com/v1/api.json?rss_url=https://mimisoleil.substack.com/feed" // Replace with your blog's RSS feed URL
    );
    const data = await response.json();

    blogPostsContainer.innerHTML = "";

    data.items.slice(0, 3).forEach((post) => {
      let imgSrc = placeholderImage;
      const imgMatch = post.description.match(/<img[^>]+src="([^"]+)"/);
      if (imgMatch && imgMatch[1]) {
        imgSrc = imgMatch[1];
      }

      const postElement = document.createElement("a");
      postElement.href = post.link;
      postElement.target = "_blank";
      postElement.className =
        "block bg-white p-6 rounded-lg shadow-md flex flex-col cursor-pointer hover:shadow-lg hover:scale-105 transition-transform duration-300";

      postElement.innerHTML = `
        <img src="${imgSrc}" alt="Blog Post Image" class="w-full h-48 object-cover rounded mb-4">
        <h3 class="text-xl font-bold mb-2">${post.title}</h3>
        <p class="text-gray-700 mb-4">${stripHtml(post.description).substring(
          0,
          100
        )}...</p>
      `;

      blogPostsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des articles du blog:", error);
    blogPostsContainer.innerHTML =
      '<p class="text-center text-gray-500">Impossible de charger les articles du blog pour le moment.</p>';
  }
}

// Create a generic skeleton card
function createSkeletonCard(isBlog = false) {
  const skeleton = document.createElement("div");
  skeleton.className = "animate-pulse bg-white p-6 rounded-lg shadow-md";

  skeleton.innerHTML = `
      <div class="w-full h-48 bg-gray-300 rounded mb-4"></div>
      <div class="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div class="h-4 bg-gray-300 rounded w-1/2"></div>
      ${
        isBlog
          ? '<div class="h-4 bg-gray-300 rounded w-1/4 mt-auto"></div>'
          : ""
      }
    `;

  return skeleton;
}

// Strip HTML tags from a string
function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

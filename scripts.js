/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

let tools = [];
let activeCategories = [];

document.addEventListener("DOMContentLoaded", () => {
  fetch('./tools.json')
      .then(response => {
        if(!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        tools = data;
        showCards(tools)
      })
})


//Card Loading Logic

// Your final submission should have much more data than this, and
// you should use more than just an array of strings to store it all.

// This function adds cards the page to display the data in the array
function showCards(toolsArray) {
  const cardContainer = document.getElementById("card-container");
  cardContainer.innerHTML = "";
  const templateCard = document.querySelector(".card");

  toolsArray.forEach(tool => {
    const nextCard = templateCard.cloneNode(true);
    editCardContent(nextCard, tool);
    cardContainer.appendChild(nextCard);
    setupCardModal(nextCard, tool);
  })

}

function editCardContent(card, tool) {
  card.style.display = "block";

  const cardHeader = card.querySelector("h2");
  cardHeader.textContent = tool.name;

  const cardImage = card.querySelector("img");
  cardImage.src = tool.logo;
  cardImage.alt = tool.logo + " logo";

  const cardInfo = card.querySelector("ul");
  cardInfo.innerHTML = `
    <li><strong>Category:</strong> <span class="badge">${tool.category}</span></li>
    <li><strong>Free:</strong> ${tool.isFree ? "✅ Yes" : "❌ No"}</li>
    <li><strong>Description:</strong> ${tool.description}</li>
    <li><strong>Rating:</strong> ${tool.rating}</li>
    <li class="star-container"></li>
    <li><a href="${tool.website}" target="_blank">Visit Website</a></li>  
  `
  const starContainer = card.querySelector(".star-container");
  starContainer.innerHTML = generateStars(tool.rating);
  // You can use console.log to help you debug!
  // View the output by right clicking on your website,
  // select "Inspect", then click on the "Console" tab
  console.log("new card:", tool.name, "- html: ", card);
}

function generateStars(rating) {
  const fullStar = '★';
  const emptyStar = '☆'
  let stars = "";

  const tmp = rating % 1;
  if(tmp > 0.7){
     rating = Math.ceil(rating);
  }else{
    rating = Math.floor(rating);
  }

  for(let i = 1; i <= 5; i++) {
    if(rating >= i){
      stars += fullStar;
    }else{
      stars += emptyStar;
    }
  }

  return `<span class="stars">${stars}</span>`;
}

// Search Logic
function setupSearch(){
  const searchInput = document.getElementById("search-input");
  if(!searchInput) return;
  console.log("searchInput initialized");
  searchInput.addEventListener("input", applyFilters);
}

function searchFilter(data){
  const searchInput = document.getElementById("search-input");
  const query = searchInput.value;
  return data.filter(tool =>
      tool.name.toLowerCase().includes(query.toLowerCase()));
}


//  Is Free filter
function setupIsFreeFilter(){
  const isFreeFilters = document.querySelectorAll("#isFree-filter .segment-btn");
  if(!isFreeFilters) return;
  console.log("new isFreeFilter initialized");
  isFreeFilters.forEach( option => {
    option.addEventListener("click", () => {
      isFreeFilters.forEach(tmp => tmp.classList.remove("active"));
      option.classList.add("active");
      applyFilters();
    });

  })
  // isFreeFilter.addEventListener("change", applyFilters);

}

function isFreeFilter(data){
  const isFreeFilter = document.querySelector("#isFree-filter .segment-btn.active");
  const value = isFreeFilter.dataset.free;
  if(value ==="free"){
    return data.filter(tool => tool.isFree);
  }else if(value==="not-free"){
    return data.filter(tool => !tool.isFree);
  }
  return data;
}


//  Category Filter Logic
function setupCategories(){
  const tags = document.querySelectorAll("#category-tags .tag");
  tags.forEach(tag => {
    const category = tag.dataset.category;
    tag.addEventListener("click", () => toggleCategory(category));
  })
}


function toggleCategory(category){
  const index = activeCategories.indexOf(category);
  if (index > -1) {
    activeCategories.splice(index, 1);
  }else{
    activeCategories.push(category);
  }

  updateCategoryUI();
  applyFilters();
}

function updateCategoryUI(){
  const tags = document.querySelectorAll("#category-tags .tag");
  tags.forEach(tag => {
    const category = tag.dataset.category;
    tag.classList.toggle("active", activeCategories.includes(category));
  })
}

function categoryFilter(data){
  if(activeCategories.length === 0) return data;
  return data.filter(tool => activeCategories.includes(tool.category));

}


// Sorting Logic
function setupSorting(){
  const sortType = document.getElementById("sort-type");
  if(!sortType) return;
  console.log("New sort type initialized");
  sortType.addEventListener("change", applyFilters);
}

function sortFilter(data){
  const sortType = document.getElementById("sort-type");
  const value = sortType.value;
  switch(value){
    case "rating-top":
      return data.sort(function (a, b) {
        return b.rating - a.rating;
      })
    case "rating-bottom":
      return data.sort(function (a, b) {
        return a.rating-b.rating;
      })

    case "naming-A-Z":
      return data.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })

    case "naming-Z-A":
      return data.sort(function (a, b) {
        return b.name.localeCompare(a.name);
      })

    default:
      return data;
  }
}

// Clear filters logic
function clearAllFilters(){
  document.getElementById("search-input").value = "";
  document.querySelectorAll(".segment-btn").forEach(btn => {
    if(btn.dataset.free !== "all"){
      btn.classList.remove("active");
    }else{
      btn.classList.add("active");
    }
  })
  document.getElementById("sort-type").selectedIndex = 0;

  const featuredCheckBox = document.getElementById("featured-only");
  featuredCheckBox.removeEventListener("change", applyFilters);
  featuredCheckBox.checked = false;
  featuredCheckBox.addEventListener("change", applyFilters);
  activeCategories = [];
  updateCategoryUI();
  applyFilters();
}

// Featured tools logic
function setupFeatured(){
  const isFeatured  = document.getElementById("featured-only");
  if(!isFeatured) return;
  console.log("new featured only initialized");
  isFeatured.addEventListener("change", applyFilters);
}

function featuredFilter(data){
  const isFeatured = document.getElementById("featured-only").checked;
  if(isFeatured){
    return data.filter(tool => tool.rating >=4.2);
  }
  return data;
}


//  Apply filters
function applyFilters(){
  let filteredTools = [...tools];

  filteredTools = searchFilter(filteredTools);
  filteredTools = isFreeFilter(filteredTools);
  filteredTools = categoryFilter(filteredTools);
  filteredTools = sortFilter(filteredTools);
  filteredTools = featuredFilter(filteredTools);

  showCards(filteredTools);
}


//Modal for adding
function setupModal(){
  document.getElementById("add-tool-btn").addEventListener("click", ()=> {
    document.getElementById("modal").classList.remove("hidden");
    document.getElementById("modal").classList.add("show");
    document.getElementById("modal-overlay").classList.remove("hidden");
  });
  document.getElementById("close-modal").addEventListener("click", ()=> {
    document.getElementById("modal").classList.add("hidden");
    document.getElementById("modal").classList.remove("show");
    document.getElementById("modal").classList.add("show");
    document.getElementById("modal-overlay").classList.add("hidden");
  })
  document.getElementById("modal-overlay").addEventListener("click", ()=> {
    document.getElementById("modal").classList.add("hidden");
    document.getElementById("modal").classList.remove("show");
    document.getElementById("edit-modal").classList.add("hidden");
    document.getElementById("modal-overlay").classList.add("hidden");
  })

  addNewToolSetup();
}

function addNewToolSetup(){
  document.getElementById("add-tool-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("tool-name").value.trim();
    const logo = document.getElementById("tool-logo").value.trim();
    const URL = document.getElementById("tool-url").value.trim();
    const description = document.getElementById("tool-description").value.trim();
    const category = document.getElementById("tool-category").value;
    const isFree = document.getElementById("is-free").checked;
    let rating = 0.0;
    try{
        rating = document.getElementById("tool-rating").value;
    }
    catch(err){
      alert("Please enter float for the rating");
      return;
    }

    const newTool = {
      id: crypto.randomUUID(),
      name: name,
      category: category,
      isFree: isFree,
      rating: rating,
      description: description,
      website: URL,
      logo: logo,
    }

    tools.unshift(newTool);
    applyFilters();

    document.getElementById("modal").classList.add("hidden");
    document.getElementById("modal-overlay").classList.add("hidden");

    e.target.reset();
  })
}

// Modal for edit
function setupCardModal(card, tool){
  card.addEventListener("click", () => {
    document.getElementById("edit-tool-id").value = tool.id;
    document.getElementById("edit-tool-name").value = tool.name;
    document.getElementById("edit-tool-logo").value = tool.logo;
    document.getElementById("edit-tool-url").value = tool.website;
    document.getElementById("edit-tool-description").value = tool.description;
    document.getElementById("edit-tool-category").value = tool.category;
    document.getElementById("edit-isFree-checkbox").checked = tool.isFree;
    document.getElementById("edit-tool-rating").value = tool.rating;

    document.getElementById("edit-modal").classList.remove("hidden");
    document.getElementById("edit-modal").classList.add("show");
    document.getElementById("modal-overlay").classList.remove("hidden");
  });
}

function setupEditModal(){
  document.getElementById("close-edit-modal").addEventListener("click", ()=> {
    document.getElementById("edit-modal").classList.add("hidden");
    document.getElementById("edit-modal").classList.remove("show");
    document.getElementById("modal-overlay").classList.add("hidden");
  })

  document.getElementById("edit-tool-form").addEventListener("submit", (e)=> {
    e.preventDefault();
    const updatedTool = {
      id:document.getElementById("edit-tool-id").value,
      name: document.getElementById("edit-tool-name").value,
      category: document.getElementById("edit-tool-category").value,
      isFree: document.getElementById("edit-isFree-checkbox").checked,
      rating: parseFloat(document.getElementById("edit-tool-rating").value),
      description: document.getElementById("edit-tool-description").value,
      website: document.getElementById("edit-tool-url").value,
      logo: document.getElementById("edit-tool-logo").value,
    }

    updateToolData(updatedTool);
    document.getElementById("edit-modal").classList.add("hidden");
    document.getElementById("edit-modal").classList.remove("show");
    document.getElementById("modal-overlay").classList.add("hidden");
    applyFilters();
    e.target.reset();
  });

  document.getElementById("delete-tool").addEventListener("click", ()=> {
    const id = document.getElementById("edit-tool-id").value;
    toolDelete(id);
    document.getElementById("edit-modal").classList.add("hidden");
    document.getElementById("edit-modal").classList.remove("show");
    document.getElementById("modal-overlay").classList.add("hidden");
    applyFilters();
  });

}

function toolDelete(id){
  const tool = tools.find(tool => tool.id === id);
  tools.splice(tools.indexOf(tool), 1);
}

function updateToolData(updatedTool){
  // console.log(updatedTool.id, typeof(updatedTool.id));
  tools = tools.map(tool=> {
    if(tool.id === updatedTool.id){
      return updatedTool;
    }
    return tool;
  });
}



// Set up event
document.addEventListener("DOMContentLoaded", () => {
  try{
    setupSearch();
    setupIsFreeFilter();
    setupCategories();
    setupSorting();
    setupModal();
    setupFeatured();
    // setupCardsModal();
    setupEditModal();
  }
  catch(e){
    console.error(e);
  }
})


// This calls the addCards() function when the page is first loaded
// document.addEventListener("DOMContentLoaded", showCards);

function quoteAlert() {
  console.log("Button Clicked!");
  // alert(
  //   "I guess I can kiss heaven goodbye, because it got to be a sin to look this good!"
  // );
}

function removeLastCard() {
  // titles.pop(); // Remove last item in titles array
  // showCards(); // Call showCards again to refresh
}

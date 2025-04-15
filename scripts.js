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
    <li>Category: ${tool.category}</li>
    <li>Rating: ${tool.rating}</li>
    <li>Free: ${tool.isFree ? "✅ Yes" : "❌ No"}</li>
    <li>Description: ${tool.description}</li>
    <li><a href="${tool.website}" target="_blank">Visit Website</a></li>  
  `

  // You can use console.log to help you debug!
  // View the output by right clicking on your website,
  // select "Inspect", then click on the "Console" tab
  console.log("new card:", tool.name, "- html: ", card);
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
  const isFreeFilter = document.getElementById("filter-free");
  if(!isFreeFilter) return;
  console.log("new isFreeFilter initialized");
  isFreeFilter.addEventListener("change", applyFilters);
}

function isFreeFilter(data){
  const isFreeFilter = document.getElementById("filter-free");
  const value = isFreeFilter.value;
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
  sortType.addEventListener("change", applyFilters)
}

function sortFilter(data){
  const sortType = document.getElementById("sort-type");
  const value = sortType.value;
  switch(value){
    case "rating-top":
      return data.sort(function (a, b) {
        if((b-a)>0) return -1;
      })
      break;
    case "rating-bottom":
      return data.sort(function (a, b) {
        return a.rating-b.rating;
      })

    case "naming-A-Z":
      return data.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })

    case "name-Z-A":
      return data.sort(function (a, b) {
        return b.name.localeCompare(b.name);
      })

    default:
      return data;
  }
}

// Clear filters logic
function clearAllFilters(){
  showCards(tools);
}



//  Apply filters
function applyFilters(){
  let filteredTools = [...tools];

  filteredTools = searchFilter(filteredTools);
  filteredTools = isFreeFilter(filteredTools);
  filteredTools = categoryFilter(filteredTools);
  filteredTools = sortFilter(filteredTools);

  showCards(filteredTools);
}

// Set up event
document.addEventListener("DOMContentLoaded", () => {
  try{
    setupSearch();
    setupIsFreeFilter();
    setupCategories();
    setupSorting();
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

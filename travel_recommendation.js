let travelData = null;

// Fetch data from the JSON file on page load
fetch('travel_recommendation_api.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data fetched successfully:', data);
        travelData = data; // Store the data globally
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// This function is called when the user clicks the "Search" button
function performSearch() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();

    let category = null;
    if (query.includes('beach')) {
        category = 'beaches';
    } else if (query.includes('temple')) {
        category = 'temples';
    } else if (query.includes('country')) {
        category = 'countries';
    }

    const resultsContainer = document.querySelector('.results-container');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!travelData) {
        // Data not yet loaded
        resultsContainer.innerHTML = '<p>Loading data, please try again...</p>';
        return;
    }

    if (!category) {
        resultsContainer.innerHTML = '<p>No matching results found. Try "beach", "temple", or "country".</p>';
        return;
    }

    const recommendations = travelData[category];
    if (!recommendations || recommendations.length === 0) {
        resultsContainer.innerHTML = '<p>No recommendations available for this category.</p>';
        return;
    }

    // Show at least two recommendations or fewer if less than two exist
    const displayCount = Math.min(2, recommendations.length);

    for (let i = 0; i < displayCount; i++) {
        const rec = recommendations[i];

        if (category === 'countries') {
            const firstCity = rec.cities && rec.cities.length > 0 ? rec.cities[0] : null;
            if (firstCity) {
                createRecommendationCard(firstCity.name, firstCity.imageUrl, firstCity.description, resultsContainer);
            }
        } else {
            createRecommendationCard(rec.name, rec.imageUrl, rec.description, resultsContainer);
        }
    }
}

// Helper function to create a recommendation card
function createRecommendationCard(title, imageUrl, description, container) {
    const card = document.createElement('div');
    card.style.border = '1px solid #ccc';
    card.style.background = '#ffffffcc';
    card.style.color = '#000';
    card.style.borderRadius = '8px';
    card.style.padding = '10px';
    card.style.margin = '10px 0';
    card.style.maxWidth = '400px';
    card.style.marginLeft = 'auto';
    card.style.marginRight = 'auto';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = title;
    img.style.width = '100%';
    img.style.borderRadius = '8px 8px 0 0';

    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    titleEl.style.margin = '10px 0 5px 0';
    titleEl.style.fontFamily = 'Arial, sans-serif';

    const descEl = document.createElement('p');
    descEl.textContent = description;
    descEl.style.margin = '5px 0';

    const visitBtn = document.createElement('button');
    visitBtn.textContent = 'Visit';
    visitBtn.style.padding = '8px 16px';
    visitBtn.style.background = 'darkgreen';
    visitBtn.style.color = '#fff';
    visitBtn.style.border = 'none';
    visitBtn.style.borderRadius = '4px';
    visitBtn.style.cursor = 'pointer';
    visitBtn.style.marginTop = '10px';

    card.appendChild(img);
    card.appendChild(titleEl);
    card.appendChild(descEl);
    card.appendChild(visitBtn);

    container.appendChild(card);
}

// Reset the search input
function resetSearch() {
    document.getElementById('searchInput').value = '';
    const resultsContainer = document.querySelector('.results-container');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
}

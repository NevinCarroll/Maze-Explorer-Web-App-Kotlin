// Fetch the high scores from the server endpoint
fetch('/highscores')
    .then(res => res.json())  // Parse the response as JSON
    .then(data => {
        // Get the container element where high scores will be displayed
        const container = document.getElementById('highscore-list');

        // If there are no high scores, display a placeholder message
        if (data.length === 0) {
            container.innerHTML = '<p>No high scores yet.</p>';
        } else {
            // Otherwise, iterate through the high score entries
            data.forEach((entry, i) => {
                // Create a <p> element for each score
                const p = document.createElement('p');
                // Set the text content: "Rank. Name - Time(s)"
                p.textContent = `${i + 1}. ${entry.name} - ${entry.time}s`;
                // Append the <p> to the container
                container.appendChild(p);
            });
        }
    })
    .catch(err => {
        console.error('Failed to load high scores:', err);
    });
fetch('/highscores')
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById('highscore-list');
        if (data.length === 0) container.innerHTML = '<p>No high scores yet.</p>';
        else {
            data.forEach((entry, i) => {
                const p = document.createElement('p');
                p.textContent = `${i+1}. ${entry.name} - ${entry.time}s`;
                container.appendChild(p);
            });
        }
    });
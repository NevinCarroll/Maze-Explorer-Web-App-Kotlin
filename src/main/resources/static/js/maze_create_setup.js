// Attach a submit event handler to the maze creation form
document.getElementById("maze-form").onsubmit = e => {
    // Prevent the default form submission (so the page doesn't reload)
    e.preventDefault();

    // Get the maze name from the input field and trim whitespace
    const name = document.getElementById("mazeName").value.trim();

    // Validate filename: allow only letters, numbers, underscores, and dashes
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
        alert("Invalid filename");  // Show an alert if the filename is invalid
        return;                     // Stop the form submission
    }

    // Save the maze name in sessionStorage to pass it to the editor page
    sessionStorage.setItem("mazeName", name);

    // Redirect the user to the maze editor page
    window.location.href = "/maze-editor";
};
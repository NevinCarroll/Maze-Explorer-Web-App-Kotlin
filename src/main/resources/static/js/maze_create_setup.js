document.getElementById("maze-form").onsubmit = e => {
    e.preventDefault();

    const name = document.getElementById("mazeName").value.trim();

    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
        alert("Invalid filename");
        return;
    }

    sessionStorage.setItem("mazeName", name);

    window.location.href = "/maze-editor";
};
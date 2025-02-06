    document.getElementById("resume").addEventListener("change", function () {
        const file = this.files[0]; // Get the uploaded file
        const maxSize = 500 * 1024; // 500 KB limit

        if (file && file.size > maxSize) {
            alert("File size exceeds 500 KB. Please upload a smaller file.");
            this.value = ""; // Reset the file input
            document.getElementById("file-name").textContent = "No file chosen";
        } else if (file) {
            document.getElementById("file-name").textContent = file.name; // Show file name
        }
    });

    document.getElementById("job-application").addEventListener("submit", function (event) {
        const file = document.getElementById("resume").files[0];
        const maxSize = 500 * 1024; // 500 KB limit

        if (file && file.size > maxSize) {
            alert("File size exceeds 500 KB. Please upload a smaller file.");
            event.preventDefault(); // Stop form submission
        }
    });
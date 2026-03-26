// script.js
console.log("ENZO Frontend Loaded!");

// Later, we will write a function here like:
// async function loadEvents() { ... }


// Wait for the HTML to fully load before running the script
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Find the elements we need
    const modal = document.getElementById('logoutModal');
    const confirmLogoutBtn = document.getElementById('confirmLogout');
    
    // Find the "Logout" link in the navbar
    const navLinks = document.querySelectorAll('.nav-links a');
    let logoutLink = null;
    navLinks.forEach(link => {
        if (link.textContent.trim() === 'Logout') {
            logoutLink = link;
        }
    });

    // 2. If the modal and link exist on this page, add the click rules
    if (logoutLink && modal) {
        
        // Rule A: Click navbar "Logout" -> Show the Modal
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault(); // Stops the link from doing its default behavior
            modal.style.display = 'flex'; // Shows the modal
        });

        // Rule B: Click anywhere on the dark background -> Hide the Modal
        modal.addEventListener('click', (event) => {
            // Check if they clicked the overlay, NOT the gray box itself
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Rule C: Click the red "Logout" button -> Go to login page
        confirmLogoutBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }
});
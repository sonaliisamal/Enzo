// ==========================================
// 1. GLOBAL AUTHENTICATION & LOGOUT LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('enzo_user'));
    const navLinksContainer = document.querySelector('.nav-links');

    // Kick out if not logged in
    if (!currentUser && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
        window.location.href = 'login.html';
    }

    // Add Admin Dashboard link if user is admin
    if (currentUser && navLinksContainer && currentUser.role === 'admin') {
        if (!window.location.pathname.includes('admin.html')) {
            const adminLink = document.createElement('li');
            adminLink.innerHTML = `<a href="admin.html" style="color: #d633ff; font-weight: bold;">Admin Dashboard</a>`;
            navLinksContainer.prepend(adminLink);
        }
    }

    // Logout Modal Logic
    const modal = document.getElementById('logoutModal');
    const confirmLogoutBtn = document.getElementById('confirmLogout');
    let logoutLink = null;
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.textContent.trim() === 'Logout') logoutLink = link;
    });

    if (logoutLink && modal) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            modal.style.display = 'flex';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        confirmLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('enzo_user');
            window.location.href = 'login.html';
        });
    }
});

// ==========================================
// 2. LOGIN & SIGNUP LOGIC
// ==========================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (data.success) {
                localStorage.setItem('enzo_user', JSON.stringify(data.data));
                window.location.href = 'index.html'; 
            } else {
                alert(data.message); 
            }
        } catch (error) {
            alert("Could not connect to the server.");
        }
    });
}

const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role: 'user' })
            });
            const data = await response.json();

            if (data.success) {
                alert("Account created successfully! Please log in.");
                window.location.href = 'login.html';
            } else {
                alert(data.message); 
            }
        } catch (error) {
            console.error(error);
        }
    });
}

// ==========================================
// 3. GLOBAL DELETE AND EDIT FUNCTIONS
// ==========================================
async function deleteEvent(eventId) {
    if (!confirm("Are you sure you want to delete this event?")) return; 
    try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`, { method: 'DELETE' });
        const data = await response.json();
        if (data.success) {
            alert("Event deleted successfully!");
            window.location.reload(); 
        }
    } catch (error) {
        alert("Error deleting event.");
    }
}

window.openEditModal = async function(eventId) {
    try {
        const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
        const data = await response.json();

        if (data.success) {
            const ev = data.data;
            document.getElementById('editEventId').value = ev.event_id;
            document.getElementById('eventName').value = ev.name;
            document.getElementById('eventDate').value = ev.date.split('T')[0]; 
            document.getElementById('eventTheme').value = ev.theme;
            document.getElementById('eventCapacity').value = ev.max_capacity;
            document.getElementById('startTime').value = ev.start_time;
            document.getElementById('endTime').value = ev.end_time;
            document.getElementById('eventDesc').value = ev.description;

            document.querySelector('#addEventModal h3').innerText = "Edit Event";
            document.getElementById('addEventModal').style.display = 'flex';
        }
    } catch (error) {
        alert("Failed to load event data.");
    }
};

// ==========================================
// 4. ADMIN DASHBOARD LOGIC
// ==========================================
if (window.location.pathname.includes('admin.html')) {
    const tableBody = document.getElementById('adminEventsTableBody');
    const addEventModal = document.getElementById('addEventModal');
    const addEventForm = document.getElementById('addEventForm');

    async function loadAdminEvents() {
        try {
            const response = await fetch('http://localhost:5000/api/events');
            const data = await response.json();
            tableBody.innerHTML = ''; 

            if (data.success) {
                data.data.forEach(event => {
                    const eventDate = new Date(event.date).toLocaleDateString();
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>#${event.event_id}</td>
                        <td><strong>${event.name}</strong></td>
                        <td>${eventDate}</td>
                        <td>${event.max_capacity}</td>
                        <td>
                            <button class="edit-btn" onclick="openEditModal(${event.event_id})">Edit</button>
                            <button class="delete-btn" onclick="deleteEvent(${event.event_id})">Delete</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        } catch (error) {
            console.error("Error loading events:", error);
        }
    }

    loadAdminEvents();

    document.getElementById('openAddEventModal').addEventListener('click', () => {
        document.getElementById('editEventId').value = ''; 
        addEventForm.reset(); 
        document.querySelector('#addEventModal h3').innerText = "Create New Event";
        addEventModal.style.display = 'flex';
    });

    document.getElementById('closeAddEventModal').addEventListener('click', () => {
        addEventModal.style.display = 'none';
    });

    addEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const eventId = document.getElementById('editEventId').value; 
        const method = eventId ? 'PUT' : 'POST'; 
        const url = eventId ? `http://localhost:5000/api/events/${eventId}` : 'http://localhost:5000/api/events';

        // USE FORMDATA INSTEAD OF JSON SO WE CAN SEND FILES
        const formData = new FormData();
        formData.append('name', document.getElementById('eventName').value);
        formData.append('date', document.getElementById('eventDate').value);
        formData.append('theme', document.getElementById('eventTheme').value);
        formData.append('max_capacity', document.getElementById('eventCapacity').value);
        formData.append('start_time', document.getElementById('startTime').value);
        formData.append('end_time', document.getElementById('endTime').value);
        formData.append('description', document.getElementById('eventDesc').value);

        // Grab the image file if they uploaded one
        const imageFile = document.getElementById('eventImage').files[0];
        if (imageFile) {
            formData.append('image', imageFile); // 'image' matches the backend multer setup
        }

        try {
            const response = await fetch(url, {
                method: method,
                // Notice we REMOVED the 'Content-Type' header! The browser sets it automatically for FormData.
                body: formData 
            });
            const data = await response.json();

            if (data.success) {
                alert(`Event ${eventId ? 'Updated' : 'Created'} Successfully!`);
                addEventModal.style.display = 'none'; 
                addEventForm.reset(); 
                document.getElementById('editEventId').value = ''; 
                loadAdminEvents(); 
            }
        } catch (error) {
            console.error("Error saving event:", error);
        }
    });
}

// ==========================================
// 5. DYNAMIC EVENTS PAGE LOGIC
// ==========================================
if (window.location.pathname.includes('events.html')) {
    const eventsList = document.getElementById('eventsList');

    async function loadUserEvents() {
        try {
            const response = await fetch('http://localhost:5000/api/events');
            const data = await response.json();
            eventsList.innerHTML = ''; 

            if (data.success) {
                data.data.forEach((event, index) => {
                    // Check if event has a database image, otherwise use a fallback poster
                    const imageUrl = event.image_url ? `http://localhost:5000${event.image_url}` : `images/poster${(index % 6) + 1}.jpg`;
                    
                    const card = document.createElement('div');
                    card.className = 'poster-card';
                    card.innerHTML = `
                        <a href="event-detail.html?id=${event.event_id}">
                            <img src="${imageUrl}" alt="${event.name}">
                        </a>
                    `;
                    eventsList.appendChild(card);
                });
            }
        } catch (error) {
            eventsList.innerHTML = '<p style="color:white;">Failed to load events.</p>';
        }
    } 
}

// ==========================================
// 6. EVENT DETAILS & JOIN LOGIC
// ==========================================
if (window.location.pathname.includes('event-detail.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');

    async function loadEventDetails() {
        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
            const data = await response.json();

            if (data.success) {
                const event = data.data;
                const eventDate = new Date(event.date).toLocaleDateString();

                // Inject text data
                document.getElementById('detailName').innerText = event.name;
                document.getElementById('detailDate').innerText = eventDate;
                document.getElementById('detailTheme').innerText = event.theme || "N/A";
                document.getElementById('detailCapacity').innerText = event.max_capacity;
                document.getElementById('detailTime').innerText = `${event.start_time} - ${event.end_time}`;
                document.getElementById('detailDesc').innerText = event.description || "No description provided.";
                
                // Inject image data
                const imageUrl = event.image_url ? `http://localhost:5000${event.image_url}` : `images/hacktag.jpeg`;
                document.getElementById('detailPoster').src = imageUrl;

            } else {
                alert("Event not found!");
                window.location.href = 'events.html';
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    if (eventId) {
        loadEventDetails();
    } else {
        window.location.href = 'events.html'; 
    }

    // Join Button Logic
    const joinBtn = document.getElementById('joinEventBtn');
    if (joinBtn) {
        joinBtn.addEventListener('click', async () => {
            const currentUser = JSON.parse(localStorage.getItem('enzo_user'));
            if (!currentUser) {
                alert("Please log in to join events!");
                window.location.href = 'login.html';
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/registrations/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: currentUser.user_id, event_id: eventId })
                });
                const data = await response.json();

                if (data.success) {
                    alert("Awesome! You have successfully joined the event.");
                    joinBtn.innerText = "Joined";
                    joinBtn.style.background = "#28a745"; 
                    joinBtn.disabled = true; 
                } else {
                    alert(data.message); 
                }
            } catch (error) {
                alert("Something went wrong. Please try again.");
            }
        });
    }
}


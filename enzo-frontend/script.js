// ==========================================
// 1. GLOBAL AUTHENTICATION & LOGOUT LOGIC
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('enzo_user'));
    const navLinksContainer = document.querySelector('.nav-links');

    if (!currentUser && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('signup.html')) {
        window.location.href = 'login.html';
    }

    if (currentUser && navLinksContainer && currentUser.role === 'admin') {
        if (!window.location.pathname.includes('admin.html')) {
            const adminLink = document.createElement('li');
            adminLink.innerHTML = `<a href="admin.html" style="color: #d633ff; font-weight: bold;">Dashboard</a>`;
            navLinksContainer.prepend(adminLink);
        }
    }

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
        const mobile = document.getElementById('mobile').value;
        const regNumber = document.getElementById('reg-number').value;
        
        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role: 'user', phone: mobile, reg_number: regNumber })
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
// 3. ADMIN DASHBOARD LOGIC
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
                            <button class="delete-btn" onclick="deleteEvent(${event.event_id})" style="background:#ff3b3b; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Delete</button>
                            <button onclick="viewAttendees(${event.event_id})" style="background:#9d26ff; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-left: 5px;">Attendees</button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }
        } catch (error) { console.error(error); }
    }
    loadAdminEvents();

    // Delete Event
    window.deleteEvent = async function(eventId) {
        if (!confirm("Are you sure you want to delete this event?")) return; 
        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.success) { alert("Event deleted!"); window.location.reload(); }
        } catch (error) { alert("Error deleting event."); }
    }

    // View Attendees Modal Logic
    window.viewAttendees = async function(eventId) {
        try {
            const response = await fetch(`http://localhost:5000/api/registrations/event/${eventId}/attendees`);
            const data = await response.json();

            if (data.success) {
                document.getElementById('totalAttendees').innerText = `Total Joined: ${data.count}`;
                const tbody = document.getElementById('attendeesTableBody');
                tbody.innerHTML = '';

                data.data.forEach(user => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="padding: 10px; border-bottom: 1px solid #ccc;">${user.name}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ccc;">${user.reg_number || 'N/A'}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ccc;">${user.phone || 'N/A'}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #ccc;">${user.email}</td>
                    `;
                    tbody.appendChild(tr);
                });
                document.getElementById('attendeesModal').style.display = 'flex';
            }
        } catch (e) { alert("Failed to load attendees."); }
    };

    document.getElementById('closeAttendeesModal')?.addEventListener('click', () => {
        document.getElementById('attendeesModal').style.display = 'none';
    });

    // Add/Edit Event Logic
    document.getElementById('openAddEventModal').addEventListener('click', () => {
        document.getElementById('editEventId').value = ''; 
        addEventForm.reset(); 
        document.querySelector('#addEventModal h3').innerText = "Create New Event";
        addEventModal.style.display = 'flex';
    });

    document.getElementById('closeAddEventModal').addEventListener('click', () => {
        addEventModal.style.display = 'none';
    });

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
                addEventModal.style.display = 'flex';
            }
        } catch (error) { alert("Failed to load event."); }
    };

    addEventForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const eventId = document.getElementById('editEventId').value; 
        const method = eventId ? 'PUT' : 'POST'; 
        const url = eventId ? `http://localhost:5000/api/events/${eventId}` : 'http://localhost:5000/api/events';

        const formData = new FormData();
        formData.append('name', document.getElementById('eventName').value);
        formData.append('date', document.getElementById('eventDate').value);
        formData.append('theme', document.getElementById('eventTheme').value);
        formData.append('max_capacity', document.getElementById('eventCapacity').value);
        formData.append('start_time', document.getElementById('startTime').value);
        formData.append('end_time', document.getElementById('endTime').value);
        formData.append('description', document.getElementById('eventDesc').value);

        const imageFile = document.getElementById('eventImage').files[0];
        if (imageFile) formData.append('image', imageFile); 

        try {
            const response = await fetch(url, { method: method, body: formData });
            const data = await response.json();
            if (data.success) {
                alert(`Event Saved!`);
                addEventModal.style.display = 'none'; 
                addEventForm.reset(); 
                loadAdminEvents(); 
            }
        } catch (error) { console.error(error); }
    });
}

// ==========================================
// 4. DYNAMIC EVENTS PAGE LOGIC (With Live Search)
// ==========================================
if (window.location.pathname.includes('events.html')) {
    const eventsList = document.getElementById('eventsList');
    const searchInput = document.getElementById('searchInput');
    const dateFilter = document.getElementById('dateFilter');
    const timeFilter = document.getElementById('timeFilter');
    const clearFilters = document.getElementById('clearFilters');

    let allEvents = []; // Master list to store events from the database

    // 1. Fetch all events ONCE when the page loads
    async function fetchAndLoadEvents() {
        try {
            const response = await fetch('http://localhost:5000/api/events');
            const data = await response.json();

            if (data.success) {
                allEvents = data.data; 
                renderEvents(allEvents); // Draw all of them initially
            }
        } catch (error) {
            eventsList.innerHTML = '<p style="color:white;">Failed to load events.</p>';
        }
    }

    // 2. The function that actually draws the HTML cards
    function renderEvents(eventsToDisplay) {
        eventsList.innerHTML = ''; 

        // If the filter results in nothing, show a message
        if (eventsToDisplay.length === 0) {
            eventsList.innerHTML = '<p style="color:#ccc; text-align:center; grid-column: 1/-1;">No events found matching your search criteria.</p>';
            return;
        }

        eventsToDisplay.forEach((event, index) => {
            const imageUrl = event.image_url ? `http://localhost:5000${event.image_url}` : `images/poster${(index % 6) + 1}.jpg`;
            
            const card = document.createElement('div');
            card.className = 'poster-card';
            card.style.flexDirection = 'column';
            card.innerHTML = `
                <a href="event-detail.html?id=${event.event_id}" style="text-decoration: none; color: white;">
                    <img src="${imageUrl}" alt="${event.name}" onerror="this.src='images/hacktag.jpeg'" style="background: #222; min-height: 200px;">
                    <h3 style="text-align: center; margin-top: 15px; font-family: 'Inter', sans-serif;">${event.name}</h3>
                </a>
            `;
            eventsList.appendChild(card);
        });
    }

    // 3. The Live Filter Logic
    function applyFilters() {
        const searchText = searchInput.value.toLowerCase();
        const filterDate = dateFilter.value; // format: "YYYY-MM-DD"
        const filterTime = timeFilter.value; // format: "HH:MM"

        const filteredEvents = allEvents.filter(event => {
            // Check Name Match
            const matchesSearch = event.name.toLowerCase().includes(searchText);
            
            // Check Date Match (Database dates start with YYYY-MM-DD)
            let matchesDate = true;
            if (filterDate) {
                matchesDate = event.date.startsWith(filterDate);
            }

            // Check Time Match (Show events starting at or after the selected time)
            let matchesTime = true;
            if (filterTime) {
                // simple string comparison works for 24-hour time strings like "14:30:00" >= "14:30"
                matchesTime = event.start_time >= filterTime; 
            }

            // Keep the event only if it matches ALL active filters
            return matchesSearch && matchesDate && matchesTime;
        });

        renderEvents(filteredEvents); // Redraw the grid with the filtered list
    }

    // 4. Attach Event Listeners to the inputs so it filters automatically
    searchInput?.addEventListener('input', applyFilters);
    dateFilter?.addEventListener('change', applyFilters);
    timeFilter?.addEventListener('change', applyFilters);

    // 5. Clear Button Logic
    clearFilters?.addEventListener('click', () => {
        searchInput.value = '';
        dateFilter.value = '';
        timeFilter.value = '';
        renderEvents(allEvents); // Show everything again
    });

    // Start the process!
    fetchAndLoadEvents();
}

// ==========================================
// 5. EVENT DETAILS & TOGGLE JOIN LOGIC
// ==========================================
if (window.location.pathname.includes('event-detail.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get('id');
    const currentUser = JSON.parse(localStorage.getItem('enzo_user'));
    const joinBtn = document.getElementById('joinEventBtn');
    let isRegistered = false;

    // 1. Hide Join button if Admin
    if (currentUser && currentUser.role === 'admin' && joinBtn) {
        joinBtn.style.display = 'none';
    }

    async function loadEventDetails() {
        try {
            const response = await fetch(`http://localhost:5000/api/events/${eventId}`);
            const data = await response.json();

            if (data.success) {
                const event = data.data;
                const eventDate = new Date(event.date).toLocaleDateString();

                document.getElementById('detailName').innerText = event.name;
                document.getElementById('detailDate').innerText = eventDate;
                document.getElementById('detailTheme').innerText = event.theme || "N/A";
                document.getElementById('detailCapacity').innerText = event.max_capacity;
                document.getElementById('detailTime').innerText = `${event.start_time} - ${event.end_time}`;
                document.getElementById('detailDesc').innerText = event.description || "No description provided.";
                
                const imageUrl = event.image_url ? `http://localhost:5000${event.image_url}` : `images/hacktag.jpeg`;
                document.getElementById('detailPoster').src = imageUrl;
            } else {
                alert("Event not found!");
                window.location.href = 'events.html';
            }
        } catch (error) { console.error("Error:", error); }
    }

    // 2. Check if already registered
    async function checkStatus() {
        if (!currentUser || currentUser.role === 'admin') return;
        try {
            const res = await fetch(`http://localhost:5000/api/registrations/check/${eventId}/${currentUser.user_id}`);
            const data = await res.json();
            if (data.success && data.isRegistered) {
                isRegistered = true;
                joinBtn.innerText = "Joined (Click to Cancel)";
                joinBtn.style.background = "#28a745"; // Green
            }
        } catch(e) {}
    }

    if (eventId) {
        loadEventDetails();
        checkStatus();
    } else {
        window.location.href = 'events.html'; 
    }

    // 3. Handle Join / Cancel Click
    if (joinBtn && (!currentUser || currentUser.role !== 'admin')) {
        joinBtn.addEventListener('click', async () => {
            if (!currentUser) {
                alert("Please log in to join events!");
                window.location.href = 'login.html';
                return;
            }

            if (isRegistered) {
                // Cancel Flow
                if (!confirm("Are you sure you want to cancel your registration?")) return;
                try {
                    const response = await fetch('http://localhost:5000/api/registrations/cancel', {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_id: currentUser.user_id, event_id: eventId })
                    });
                    const data = await response.json();
                    if (data.success) {
                        isRegistered = false;
                        joinBtn.innerText = "Join";
                        joinBtn.style.background = "linear-gradient(90deg, #a832d4, #d633ff)"; // Back to purple
                    }
                } catch (e) { alert("Failed to cancel."); }
            } else {
                // Join Flow
                try {
                    const response = await fetch('http://localhost:5000/api/registrations/register', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_id: currentUser.user_id, event_id: eventId })
                    });
                    const data = await response.json();

                    if (data.success) {
                        isRegistered = true;
                        joinBtn.innerText = "Joined (Click to Cancel)";
                        joinBtn.style.background = "#28a745"; // Turn Green
                    } else {
                        alert(data.message); 
                    }
                } catch (error) { alert("Something went wrong."); }
            }
        });
    }
}
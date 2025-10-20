
//Array to save all tickets
let tickets = [];
//ID for all tickets to keep control
let ticketIdCounter = 1;
//Variable if we are editing (Null if we are not editing)
let editingTicketId = null;
//Variable to store the current filter
let currentFilter = 'todos';
//Variable for search term
let searchTerm = '';

// DOM REFERENCES
const form = document.getElementById('ticket-form');
const formTitle = document.getElementById('form-title');
const SumitBtn = document.getElementById('sumit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const ticketsContainer = document.getElementById('tickets-container');

// Form Inputs
const titleInput = document.getElementById('ticket-title');
const descriptionInput = document.getElementById('ticket-description');
const priorityInput = document.getElementById('ticket-priority');
const statusInput = document.getElementById('ticket-status');

// Filter Buttons
const filterButtons = document.querySelectorAll('.filter-btn');

// Search Input
const searchInput = document.getElementById('search-input');
        
// Stadistics
const statsContainer = document.getElementById('stats-container');

//Function Create Ticket
 function createTicket(ticketData) {
    const newTicket = {
        id: ticketIdCounter++,
        title: ticketData.title,
        description: ticketData.description,
        priority: ticketData.priority,
        status: ticketData.status,
        createdAt: new Date().toLocaleString('es-MX')
};
            

tickets.push(newTicket);
            
console.log('✅ Ticket creado:', newTicket);
}

//Function Get Ticket
function getTickets(filter = 'todos') {
    let filteredTickets = tickets;
            
    if (filter !== 'todos') {
        filteredTickets = filteredTickets.filter(ticket => ticket.status === filter);
    }
            
    if (searchTerm) {
        filteredTickets = filteredTickets.filter(ticket => {
    
            const title = ticket.title.toLowerCase();
            const description = ticket.description.toLowerCase();
            const search = searchTerm.toLowerCase();
                    
    
            return title.includes(search) || description.includes(search);
        });
    }
            
    return filteredTickets;
}

//Function Update Ticket
function updateTicket(id, updatedData) {
    const index = tickets.findIndex(ticket => ticket.id === id);
            
    if (index !== -1) {
        tickets[index] = {
            ...tickets[index], 
            ...updatedData,     
            id: tickets[index].id, 
            createdAt: tickets[index].createdAt 
        };
                
        console.log('✅ Ticket actualizado:', tickets[index]);
        return true;
    }
            
    console.log('❌ Ticket no encontrado');
    return false;
}

//Function Delete Ticket
function deleteTicket(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este ticket?')) {
        tickets = tickets.filter(ticket => ticket.id !== id);
                
        console.log('🗑️ Ticket eliminado. ID:', id);
        renderTickets();
    }
}

function renderTickets() {
// Get the tickets depending on the filter
    const filteredTickets = getTickets(currentFilter);
            
// Clean container
    ticketsContainer.innerHTML = '';
            
// If there are no tickets, show this message
    if (filteredTickets.length === 0) {
        const message = searchTerm 
            ? 'No se encontraron tickets que coincidan con tu búsqueda' 
            : 'No hay tickets para mostrar';
                
        ticketsContainer.innerHTML = `
            <div class="empty-state">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                </svg>
                <h3>${message}</h3>
                <p>${searchTerm ? 'Intenta con otros términos de búsqueda' : 'Crea tu primer ticket usando el formulario de arriba'}</p>
            </div>
        `;
        return;
    }
            
// render each ticket
    filteredTickets.forEach(ticket => {
        const ticketCard = createTicketCard(ticket);
        ticketsContainer.appendChild(ticketCard);
    });
            
    // Update Stadistics
    updateStats();
}

/**
    * Function to create on the HTML
    * @param {Object} ticket - Ticket Object
    * @returns {HTMLElement} - DOM Element
    */

function createTicketCard(ticket) {
    // Div for the Card
    const card = document.createElement('div');
    card.className = 'ticket-card';
            
    card.innerHTML = `
                <div class="ticket-header">
                    <span class="ticket-id">#${ticket.id}</span>
                </div>
                <h3 class="ticket-title">${ticket.title}</h3>
                <p class="ticket-description">${ticket.description}</p>
                <div class="ticket-meta">
                    <span class="badge badge-priority-${ticket.priority}">
                        ${ticket.priority.toUpperCase()}
                    </span>
                    <span class="badge badge-status-${ticket.status}">
                        ${formatStatus(ticket.status)}
                    </span>
                </div>
                <small style="color: #718096; display: block; margin-bottom: 10px;">
                    Creado: ${ticket.createdAt}
                </small>
                <div class="ticket-actions">
                    <button class="btn btn-success" onclick="startEdit(${ticket.id})">
                        ✏️ Editar
                    </button>
                    <button class="btn btn-danger" onclick="deleteTicket(${ticket.id})">
                        🗑️ Eliminar
                    </button>
                </div>
    `;
            
    return card;
}

/**
    * Function to erease the state
    * @param {string} status - Ticket State
    * @returns {string} - Format Ticket
    */
function formatStatus(status) {
    const statusMap = {
        'pendiente': 'Pendiente',
        'en-progreso': 'En Progreso',
        'completado': 'Completado'
    };
    return statusMap[status] || status;
}
        
/**
    * Function calculate and show stadistics
    */
function updateStats() {
    const total = tickets.length;
    const pendientes = tickets.filter(t => t.status === 'pendiente').length;
    const enProgreso = tickets.filter(t => t.status === 'en-progreso').length;
    const completados = tickets.filter(t => t.status === 'completado').length;
            
    statsContainer.innerHTML = `
        <span style="color: #667eea;">📊 Total: ${total}</span>
        <span style="color: #718096;">⏳ Pendientes: ${pendientes}</span>
        <span style="color: #4299e1;">🔄 En Progreso: ${enProgreso}</span>
        <span style="color: #48bb78;">✅ Completados: ${completados}</span>
    `;
}
        
/**
    * Función para validar datos del formulario
    * @param {Object} data - Datos a validar
    * @returns {Object} - {isValid: boolean, errors: Array}
    */
function validateTicketData(data) {
    const errors = [];
            
    // Validate Title 
    if (!data.title || data.title.length < 5) {
        errors.push('El título debe tener al menos 5 caracteres');
    }
            
    // Validate Description
    if (!data.description || data.description.length < 10) {
        errors.push('La descripción debe tener al menos 10 caracteres');
    }
            
    // Validate Priority
    const validPriorities = ['baja', 'media', 'alta'];
    if (!validPriorities.includes(data.priority)) {
        errors.push('Debes seleccionar una prioridad válida');
    }
            
    // Validate Status
    const validStatuses = ['pendiente', 'en-progreso', 'completado'];
    if (!validStatuses.includes(data.status)) {
        errors.push('Debes seleccionar un estado válido');
    }
            
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}
        
/**
    * Function for message errors
    * @param {Array} errors
    */
function showErrors(errors) {
    const errorMessage = errors.join('\n• ');
    alert('⚠️ Por favor corrige los siguientes errores:\n\n• ' + errorMessage);
}

// Functions for Edit Content

/**
    *
    * @param {number} id - Id for the ticket
    */
function startEdit(id) {
    // Search ticket on array
    const ticket = tickets.find(t => t.id === id);
            
    if (!ticket) return;
            
    // Save ID ticket
    editingTicketId = id;
            
    // Fill ticket form
    titleInput.value = ticket.title;
    descriptionInput.value = ticket.description;
    priorityInput.value = ticket.priority;
    statusInput.value = ticket.status;
            
    // Change title and text button
    formTitle.textContent = '✏️ Editar Ticket';
    submitBtn.textContent = 'Actualizar Ticket';
    cancelBtn.style.display = 'inline-block';
            
    // Scroll to form
    form.scrollIntoView({ behavior: 'smooth' });
}

/**
    * Function to cancel edit
    */
function cancelEdit() {
    editingTicketId = null;
    form.reset();
    formTitle.textContent = '➕ Crear Nuevo Ticket';
    submitBtn.textContent = 'Crear Ticket';
    cancelBtn.style.display = 'none';
}

// EVENT LISTENERS

/**
    * Event for form sending
    */
form.addEventListener('submit', function(e) {
    e.preventDefault();
            
    const ticketData = {
        title: titleInput.value.trim(),
        description: descriptionInput.value.trim(),
        priority: priorityInput.value,
        status: statusInput.value
    };
            
    const validation = validateTicketData(ticketData);
            
    if (!validation.isValid) {
        showErrors(validation.errors);
        return;
    }
            
    if (editingTicketId !== null) {
        updateTicket(editingTicketId, ticketData);
        cancelEdit();
    } else {
        createTicket(ticketData);
    }
            
    // Clean the form
    form.reset();
            
    // Update view
    renderTickets();
});

/**
    * Event for cancel button
    */
cancelBtn.addEventListener('click', cancelEdit);

/**
    * Button event filter
    */
filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        filterButtons.forEach(btn => btn.classList.remove('active'));
                
        this.classList.add('active');
                
        currentFilter = this.dataset.filter;
                
        renderTickets();
    });
});
        
searchInput.addEventListener('input', function(e) {
    searchTerm = e.target.value.trim();
    renderTickets();
});
        /**
         * Function to create tickets reference
         */
        function initializeApp() {
            // Tickets for reference
            createTicket({
                title: 'Implementar sistema de login',
                description: 'Crear funcionalidad de autenticación con email y contraseña',
                priority: 'alta',
                status: 'en-progreso'
            });
            
            createTicket({
                title: 'Diseñar página de inicio',
                description: 'Crear mockups y diseño responsivo para la landing page',
                priority: 'media',
                status: 'pendiente'
            });
            
            createTicket({
                title: 'Corregir bugs en el dashboard',
                description: 'Resolver problemas reportados por usuarios en el panel de control',
                priority: 'alta',
                status: 'completado'
            });
            
            // Render first tickets
            renderTickets();
            
            console.log('✅ Aplicación inicializada correctamente');
        }

        initializeApp();
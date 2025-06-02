// Utility to safely parse JSON
function safeParseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error("❌ Failed to parse JSON from localStorage:", e.message);
    return [];
  }
}

// Initial parse and setup
let contacts = [];
let lastRawValue = "";

function updateContactsFromLocalStorage() {
  const storedContacts = localStorage.getItem("HideStatusList");

  // Skip update if value hasn't changed
  if (storedContacts === lastRawValue) return;

  lastRawValue = storedContacts;
  const parsedContacts = Array.isArray(safeParseJSON(storedContacts))
    ? safeParseJSON(storedContacts)
    : [];

  contacts = parsedContacts
    .map(contact => ({
      id: contact?.contact_id || "",
      name: contact?.contact_name || "Unnamed",
      avatar: contact?.receiver_profile_picture || "https://via.placeholder.com/36",
      receiverId: contact?.receiver_id || "", // Include receiver_id
    }))
    .filter(contact => contact.id && contact.name)
    .sort((a, b) => a.name.localeCompare(b.name));

  // Optional: Inject or update DOM elements (example)
  renderContactsToDOM(contacts);
}

// Example DOM rendering with display:none receiver_id
function renderContactsToDOM(contactList) {
  const container = document.getElementById("contact-list");
  if (!container) return;

  container.innerHTML = ""; // Clear previous entries

  contactList.forEach(contact => {
    const item = document.createElement("div");
    item.className = "contact-item";
    item.innerHTML = `
      <img src="${contact.avatar}" alt="${contact.name}" width="36" height="36" />
      <span class="contact-name">${contact.name}</span>
      <span class="receiver-id" style="display:none">${contact.receiverId}</span>
    `;
    container.appendChild(item);
  });
}

// Start polling every 5 seconds
setInterval(updateContactsFromLocalStorage, 1000);

// Initial load
updateContactsFromLocalStorage();

export default contacts;

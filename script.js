let currentSlot = "slot1";
function saveCharacter() {
  const name = document.getElementById("charName").value;
  const charClass = document.getElementById("charClass").value;
  const level = document.getElementById("charLevel").value;
  const hp = document.getElementById("charHP").value;
  const mp = document.getElementById("charMP").value;
  const ag = document.getElementById("charAG").value;

  const characterData = { name, charClass, level, hp, mp, ag };
  localStorage.setItem(currentSlot, JSON.stringify(characterData));
  displayCharacter(characterData);
}

function loadCharacterSlot() {
  currentSlot = document.getElementById("slotSelect").value;
  const data = JSON.parse(localStorage.getItem(currentSlot)) || {};
  document.getElementById("charName").value = data.name || "";
  document.getElementById("charClass").value = data.charClass || "";
  document.getElementById("charLevel").value = data.level || "";
  document.getElementById("charHP").value = data.hp || "";
  document.getElementById("charMP").value = data.mp || "";
  document.getElementById("charAG").value = data.ag || "";
  displayCharacter(data);
  const inventory = JSON.parse(localStorage.getItem(`${currentSlot}_inventory`)) || [];
  renderInventory(inventory);

  const quests = JSON.parse(localStorage.getItem(`${currentSlot}_quests`)) || [];
  renderQuests(quests);
}

function displayCharacter(data) {
  const output = `
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Class:</strong> ${data.charClass}</p>
    <p><strong>Level:</strong> ${data.level}</p>
    <p><strong>HP:</strong> ${data.hp}</p>
    <p><strong>MP:</strong> ${data.mp}</p>
    <p><strong>AG:</strong> ${data.ag}</p>
  `;
  document.getElementById("charOutput").innerHTML = output;
}

function addItem() {
  const item = document.getElementById("itemInput").value;
  if (item.trim() === "") return;

  const key = `${currentSlot}_inventory`;
  let inventory = JSON.parse(localStorage.getItem(key)) || [];
  inventory.push(item);
  localStorage.setItem(key, JSON.stringify(inventory));

  renderInventory(inventory);
  document.getElementById("itemInput").value = "";
}
function renderInventory(items) {
  const list = document.getElementById("inventoryList");
  list.innerHTML = "";
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `🧰 ${item}`;
    li.onclick = () => {
      items.splice(index, 1);
      localStorage.setItem(`${currentSlot}_inventory`, JSON.stringify(items));
      renderInventory(items);
    };
    list.appendChild(li);
  });
}

function addQuest() {
  const quest = document.getElementById("questInput").value;
  if (quest.trim() === "") return;

  const key = `${currentSlot}_quests`;
  let quests = JSON.parse(localStorage.getItem(key)) || [];
  quests.push(quest);
  localStorage.setItem(key, JSON.stringify(quests));

  renderQuests(quests);
  document.getElementById("questInput").value = "";
}

function renderQuests(quests) {
  const list = document.getElementById("questList");
  list.innerHTML = "";
  quests.forEach((quest, index) => {
    const li = document.createElement("li");
    li.textContent = `🗺️ ${quest}`;
    li.onclick = () => {
      quests.splice(index, 1);
      localStorage.setItem(`${currentSlot}_quests`, JSON.stringify(quests));
      renderQuests(quests);
    };
    list.appendChild(li);
  });
}
window.onload = () => {
  document.getElementById("slotSelect").value = "slot1";
  loadCharacterSlot(); // will now load character, inventory, and quests
};
function toggleTheme() {
  const body = document.body;
  body.classList.toggle("light-mode");

  const isLight = body.classList.contains("light-mode");
  document.getElementById("themeButton").textContent = isLight
    ? "Switch to Dark Mode"
    : "Switch to Light Mode";
}
function exportData() {
  const char = JSON.parse(localStorage.getItem(currentSlot)) || {};
  const inventory = JSON.parse(localStorage.getItem(`${currentSlot}_inventory`)) || [];
  const quests = JSON.parse(localStorage.getItem(`${currentSlot}_quests`)) || [];

  let content = `Character Summary\n====================\n`;
  content += `Name: ${char.name || ""}\n`;
  content += `Class: ${char.charClass || ""}\n`;
  content += `Level: ${char.level || ""}\n`;
  content += `HP: ${char.hp || ""}\n`;
  content += `MP: ${char.mp || ""}\n\n`;

  content += `Inventory:\n----------\n${inventory.join("\n") || "None"}\n\n`;
  content += `Active Quests:\n--------------\n${quests.join("\n") || "None"}\n`;

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.download = "rpg_summary.txt";
  link.href = window.URL.createObjectURL(blob);
  link.click();
}
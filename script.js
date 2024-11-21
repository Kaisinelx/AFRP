// Helper function to calculate bonuses (Strength, Toughness, etc.)
function calculateBonus(value) {
    return Math.floor(value / 10);
}

// Update derived stats when Primary Profile values change
function updateDerivedStats() {
    const strength = document.getElementById("strength").value || 0;
    const toughness = document.getElementById("toughness").value || 0;

    // Update Strength Bonus (SB) and Toughness Bonus (TB)
    document.getElementById("strengthBonus").value = calculateBonus(strength);
    document.getElementById("toughnessBonus").value = calculateBonus(toughness);
}

// Save all character sheet data to localStorage
function saveCharacterData() {
    const data = {
        name: document.getElementById("name").value,
        race: document.getElementById("race").value,
        career: document.getElementById("career").value,
        primaryProfile: Array.from(
            document.querySelectorAll(".primary-profile input")
        ).map((input) => input.value),
        secondaryProfile: Array.from(
            document.querySelectorAll(".secondary-profile input")
        ).map((input) => input.value),
        skills: Array.from(
            document.querySelectorAll(".skills-section tbody tr")
        ).map((row) => ({
            skill: row.querySelector("td:first-child").textContent,
            total: row.querySelector("td:nth-child(2) input").value,
            plus10: row.querySelector("td:nth-child(3) input").checked,
            plus20: row.querySelector("td:nth-child(4) input").checked,
        })),
    };

    localStorage.setItem("characterData", JSON.stringify(data));
    alert("Character data saved!");
}

// Load saved character sheet data from localStorage
function loadCharacterData() {
    const data = JSON.parse(localStorage.getItem("characterData"));

    if (!data) {
        alert("No saved data found!");
        return;
    }

    // Load character details
    document.getElementById("name").value = data.name || "";
    document.getElementById("race").value = data.race || "";
    document.getElementById("career").value = data.career || "";

    // Load primary profile
    const primaryInputs = document.querySelectorAll(".primary-profile input");
    data.primaryProfile.forEach((value, index) => {
        primaryInputs[index].value = value;
    });

    // Load secondary profile
    const secondaryInputs = document.querySelectorAll(".secondary-profile input");
    data.secondaryProfile.forEach((value, index) => {
        secondaryInputs[index].value = value;
    });

    // Load skills
    const skillRows = document.querySelectorAll(".skills-section tbody tr");
    data.skills.forEach((skill, index) => {
        const row = skillRows[index];
        row.querySelector("td:nth-child(2) input").value = skill.total;
        row.querySelector("td:nth-child(3) input").checked = skill.plus10;
        row.querySelector("td:nth-child(4) input").checked = skill.plus20;
    });

    alert("Character data loaded!");
}

// Reset the character sheet to default values
function resetCharacterSheet() {
    if (confirm("Are you sure you want to reset the sheet? All data will be lost.")) {
        document.querySelectorAll("input, textarea").forEach((input) => {
            if (input.type === "checkbox") {
                input.checked = false;
            } else {
                input.value = "";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
            tabButtons.forEach((btn) => btn.classList.remove("active"));
            tabContents.forEach((content) => content.classList.remove("active"));

            button.classList.add("active");
            const tabId = button.getAttribute("data-tab");
            document.getElementById(tabId).classList.add("active");
        });
    });

    // Skill functionality: Taken, +10%, +20%
    const skillRows = document.querySelectorAll(".skills-table tbody tr");

    skillRows.forEach((row) => {
        const takenCheckbox = row.querySelector(".skill-taken");
        const bonus10 = row.querySelector(".bonus-10");
        const bonus20 = row.querySelector(".bonus-20");
        const totalInput = row.querySelector(".skill-total");

        let baseTotal = 0; // Store the base total without bonuses
        let currentBonus = 0; // Track the currently applied bonus

        // Toggle total input and bonuses when "Taken" is checked/unchecked
        if (takenCheckbox) {
            takenCheckbox.addEventListener("change", () => {
                if (takenCheckbox.checked) {
                    bonus10.disabled = false;
                    bonus20.disabled = false;
                    baseTotal = parseInt(totalInput.value) || 0; // Initialize base total
                    totalInput.value = baseTotal + currentBonus; // Update total with current bonus
                } else {
                    bonus10.checked = false;
                    bonus20.checked = false;
                    bonus10.disabled = true;
                    bonus20.disabled = true;
                    totalInput.value = ""; // Clear total when skill is not taken
                    baseTotal = 0; // Reset base total
                    currentBonus = 0; // Reset current bonus
                }
            });
        }

        // Handle +10% bonus checkbox
        bonus10.addEventListener("change", () => {
            if (bonus10.checked) {
                currentBonus = 10; // Set current bonus to 10
                bonus20.checked = false; // Uncheck +20%
            } else {
                currentBonus = 0; // Remove current bonus
            }
            totalInput.value = baseTotal + currentBonus; // Update total
        });

        // Handle +20% bonus checkbox
        bonus20.addEventListener("change", () => {
            if (bonus20.checked) {
                currentBonus = 20; // Set current bonus to 20
                bonus10.checked = false; // Uncheck +10%
            } else {
                currentBonus = 0; // Remove current bonus
            }
            totalInput.value = baseTotal + currentBonus; // Update total
        });

        // Update base total when total value is manually edited
        totalInput.addEventListener("input", () => {
            baseTotal = parseInt(totalInput.value) - currentBonus || 0;
            totalInput.value = baseTotal + currentBonus; // Ensure total is consistent
        });
    });
});
document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector(".talents-table tbody");
    const addRowButton = document.getElementById("add-row");
    const removeRowButton = document.getElementById("remove-row");

    // Add Row
    addRowButton.addEventListener("click", () => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="text" placeholder="Enter Talent"></td>
            <td><input type="text" placeholder="Enter Description"></td>
        `;
        tableBody.appendChild(newRow);
    });

    // Remove Row
    removeRowButton.addEventListener("click", () => {
        if (tableBody.children.length > 1) {
            tableBody.removeChild(tableBody.lastChild);
        } else {
            alert("You must keep at least one row!");
        }
    });
});

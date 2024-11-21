document.addEventListener("DOMContentLoaded", () => {
    // ===================
    // Tab Switching Functionality
    // ===================
    function setupTabs(tabContainerSelector) {
        const tabButtons = document.querySelectorAll(`${tabContainerSelector} .tab-button`);
        const tabContents = document.querySelectorAll(`${tabContainerSelector} .tab-content`);

        tabButtons.forEach((button) => {
            button.addEventListener("click", () => {
                // Remove active class from all buttons and contents
                tabButtons.forEach((btn) => btn.classList.remove("active"));
                tabContents.forEach((content) => content.classList.remove("active"));

                // Add active class to clicked button and corresponding content
                button.classList.add("active");
                const tabId = button.getAttribute("data-tab");
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.classList.add("active");
                }
            });
        });
    }

    // Initialize tabs for all sections
    setupTabs(".talents-section");
    setupTabs(".skills-section");

    // ===================
    // Add/Remove Rows for Talents
    // ===================
    const talentsTableBody = document.querySelector("#talents .talents-table tbody");
    const addTalentRowButton = document.getElementById("add-row-talents");
    const removeTalentRowButton = document.getElementById("remove-row-talents");

    if (addTalentRowButton && removeTalentRowButton) {
        addTalentRowButton.addEventListener("click", () => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td><input type="text" placeholder="Enter Talent"></td>
                <td><input type="text" placeholder="Enter Description"></td>
            `;
            talentsTableBody.appendChild(newRow);
        });

        removeTalentRowButton.addEventListener("click", () => {
            if (talentsTableBody.children.length > 1) {
                talentsTableBody.removeChild(talentsTableBody.lastChild);
            } else {
                alert("You must keep at least one row!");
            }
        });
    }

    // ===================
    // Add/Remove Rows for Acquisitions
    // ===================
    const acquisitionsTableBody = document.querySelector("#acquisitions .acquisition-table tbody");
    const addAcquisitionRowButton = document.getElementById("add-row-acquisitions");
    const removeAcquisitionRowButton = document.getElementById("remove-row-acquisitions");

    if (addAcquisitionRowButton && removeAcquisitionRowButton) {
        addAcquisitionRowButton.addEventListener("click", () => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td><input type="text" placeholder="Enter Acquisition"></td>
                <td><input type="text" placeholder="Enter Description"></td>
            `;
            acquisitionsTableBody.appendChild(newRow);
        });

        removeAcquisitionRowButton.addEventListener("click", () => {
            if (acquisitionsTableBody.children.length > 1) {
                acquisitionsTableBody.removeChild(acquisitionsTableBody.lastChild);
            } else {
                alert("You must keep at least one row!");
            }
        });
    }

    // ===================
    // Skills Section: Auto Update Total with Bonuses
    // ===================
    const skillRows = document.querySelectorAll(".skills-table tbody tr");

    skillRows.forEach((row) => {
        const takenCheckbox = row.querySelector(".skill-taken");
        const bonus10 = row.querySelector(".bonus-10");
        const bonus20 = row.querySelector(".bonus-20");
        const totalInput = row.querySelector(".skill-total");
    
        let baseTotal = 0; // Store the base total without bonuses
        let currentBonus = 0; // Track the currently applied bonus
    
        // Enable/Disable bonuses when "Taken" is checked/unchecked
        if (takenCheckbox) {
            takenCheckbox.addEventListener("change", () => {
                if (takenCheckbox.checked) {
                    bonus10.disabled = false;
                    bonus20.disabled = false;
    
                    // Reinitialize baseTotal only when "Taken" is first checked
                    if (baseTotal === 0) {
                        baseTotal = parseInt(totalInput.value) - currentBonus || 0;
                    }
    
                    totalInput.value = baseTotal + currentBonus; // Update total with current bonus
                } else {
                    bonus10.checked = false;
                    bonus20.checked = false;
                    bonus10.disabled = true;
                    bonus20.disabled = true;
    
                    // Reset total and bonuses
                    totalInput.value = baseTotal; // Reset total to base value
                    currentBonus = 0; // Reset current bonus
                }
            });
        }
    
        // Handle +10% bonus checkbox
        bonus10.addEventListener("change", () => {
            if (bonus10.checked) {
                currentBonus = 10;
                bonus20.checked = false; // Uncheck +20%
            } else {
                currentBonus = 0; // Remove current bonus
            }
            totalInput.value = baseTotal + currentBonus; // Update total
        });
    
        // Handle +20% bonus checkbox
        bonus20.addEventListener("change", () => {
            if (bonus20.checked) {
                currentBonus = 20;
                bonus10.checked = false; // Uncheck +10%
            } else {
                currentBonus = 0; // Remove current bonus
            }
            totalInput.value = baseTotal + currentBonus; // Update total
        });
    
        // Update base total when the total value is manually edited
        totalInput.addEventListener("input", () => {
            baseTotal = parseInt(totalInput.value || 0) - currentBonus; // Recalculate base total
        });
    });

        // Update base total when the total value is manually edited
        totalInput.addEventListener("input", () => {
            const enteredValue = parseInt(totalInput.value || 0);
            baseTotal = enteredValue - currentBonus; // Recalculate base total based on current input
            updateTotal(); // Ensure the displayed total is correct
        });
    


    // ===================
    // Save, Load, and Reset Character Sheet
    // ===================
    function saveCharacterData() {
        const data = {
            name: document.getElementById("name").value,
            race: document.getElementById("race").value,
            career: document.getElementById("career").value,
            primaryProfile: Array.from(document.querySelectorAll(".primary-profile input")).map((input) => input.value),
            secondaryProfile: Array.from(document.querySelectorAll(".secondary-profile input")).map((input) => input.value),
            skills: Array.from(document.querySelectorAll(".skills-section tbody tr")).map((row) => ({
                skill: row.querySelector("td:first-child").textContent,
                total: row.querySelector(".skill-total").value,
                plus10: row.querySelector(".bonus-10").checked,
                plus20: row.querySelector(".bonus-20").checked,
            })),
        };

        localStorage.setItem("characterData", JSON.stringify(data));
        alert("Character data saved!");
    }

    function loadCharacterData() {
        const data = JSON.parse(localStorage.getItem("characterData"));
        if (!data) {
            alert("No saved data found!");
            return;
        }

        // Populate data into fields
        document.getElementById("name").value = data.name || "";
        document.getElementById("race").value = data.race || "";
        document.getElementById("career").value = data.career || "";
        const primaryInputs = document.querySelectorAll(".primary-profile input");
        const secondaryInputs = document.querySelectorAll(".secondary-profile input");

        data.primaryProfile.forEach((value, index) => {
            primaryInputs[index].value = value;
        });
        data.secondaryProfile.forEach((value, index) => {
            secondaryInputs[index].value = value;
        });

        // Populate skills
        const skillRows = document.querySelectorAll(".skills-section tbody tr");
        data.skills.forEach((skill, index) => {
            const row = skillRows[index];
            row.querySelector(".skill-total").value = skill.total;
            row.querySelector(".bonus-10").checked = skill.plus10;
            row.querySelector(".bonus-20").checked = skill.plus20;
        });

        alert("Character data loaded!");
    }

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

    // Attach save/load/reset buttons
    document.getElementById("saveButton").addEventListener("click", saveCharacterData);
    document.getElementById("loadButton").addEventListener("click", loadCharacterData);
    document.getElementById("resetButton").addEventListener("click", resetCharacterSheet);
});

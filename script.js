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

       setupTabs(".talents-section");
       setupTabs(".skills-section");
   
       // ===================
// Dynamic Current Value Calculation
// ===================
function updateCurrentValues() {
    // Main Profile Logic
    const mainAttributes = ['cs', 's', 't', 'ag', 'int', 'aff', 'wis', 'fel'];
    mainAttributes.forEach(attr => {
        const startingInput = document.querySelector(`.main-starting[data-attr="${attr}"]`);
        const currentInput = document.querySelector(`.main-current[data-attr="${attr}"]`);
        const checkboxes = document.querySelectorAll(`.main-checkbox[data-attr="${attr}"]`);

        const updateValue = () => {
            const startingValue = parseInt(startingInput.value || "0", 10);
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            const currentValue = startingValue + checkedCount * 5;
            currentInput.value = currentValue;
        };

        startingInput.addEventListener("input", updateValue);
        checkboxes.forEach(cb => cb.addEventListener("change", updateValue));

        updateValue();
    });

    // Secondary Profile Logic
    const secondaryAttributes = ['a', 'w', 'pow', 'def', 'm', 'ae', 'cp', 'fp'];
    secondaryAttributes.forEach(attr => {
        const startingInput = document.querySelector(`.secondary-starting[data-attr="${attr}"]`);
        const currentInput = document.querySelector(`.secondary-current[data-attr="${attr}"]`);
        const checkboxes = document.querySelectorAll(`.secondary-checkbox[data-attr="${attr}"]`);

        const updateValue = () => {
            const startingValue = parseInt(startingInput.value || "0", 10);
            const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
            const currentValue = startingValue + checkedCount * 1;
            currentInput.value = currentValue;
        };

        startingInput.addEventListener("input", updateValue);
        checkboxes.forEach(cb => cb.addEventListener("change", updateValue));

        updateValue();
    });
}


// Initialize updateCurrentValues
updateCurrentValues();

    // ===================
    // Add/Remove Rows for Talents
    // ===================
    const talentsTableBody = document.querySelector("#talents .talents-table tbody");
    const addTalentRowButton = document.getElementById("add-row-talents");
    const removeTalentRowButton = document.getElementById("remove-row-talents");

    if (addTalentRowButton && removeTalentRowButton) {
        // Ensure event listeners are not added multiple times
        addTalentRowButton.replaceWith(addTalentRowButton.cloneNode(true));
        removeTalentRowButton.replaceWith(removeTalentRowButton.cloneNode(true));

        // Reassign the buttons after cloning
        const newAddTalentRowButton = document.getElementById("add-row-talents");
        const newRemoveTalentRowButton = document.getElementById("remove-row-talents");

        // Add row functionality
        newAddTalentRowButton.addEventListener("click", () => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td><input type="text" placeholder="Enter Talent"></td>
                <td><input type="text" placeholder="Enter Description"></td>
            `;
            talentsTableBody.appendChild(newRow);
        });

        // Remove row functionality
        newRemoveTalentRowButton.addEventListener("click", () => {
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
        // Ensure event listeners are not added multiple times
        addAcquisitionRowButton.replaceWith(addAcquisitionRowButton.cloneNode(true));
        removeAcquisitionRowButton.replaceWith(removeAcquisitionRowButton.cloneNode(true));

        // Reassign the buttons after cloning
        const newAddAcquisitionRowButton = document.getElementById("add-row-acquisitions");
        const newRemoveAcquisitionRowButton = document.getElementById("remove-row-acquisitions");

        // Add row functionality
        newAddAcquisitionRowButton.addEventListener("click", () => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td><input type="text" placeholder="Enter Acquisition"></td>
                <td><input type="text" placeholder="Enter Description"></td>
            `;
            acquisitionsTableBody.appendChild(newRow);
        });

        // Remove row functionality
        newRemoveAcquisitionRowButton.addEventListener("click", () => {
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

        // Function to update the total input
        function updateTotal() {
            totalInput.value = baseTotal + currentBonus; // Update total with the base and current bonus
        }

        // Enable/Disable bonuses when "Taken" is checked/unchecked
        if (takenCheckbox) {
            takenCheckbox.addEventListener("change", () => {
                if (takenCheckbox.checked) {
                    bonus10.disabled = false;
                    bonus20.disabled = false;
                    baseTotal = parseInt(totalInput.value || 0) - currentBonus; // Initialize baseTotal
                    updateTotal(); // Update the total to reflect the current state
                } else {
                    bonus10.checked = false;
                    bonus20.checked = false;
                    bonus10.disabled = true;
                    bonus20.disabled = true;
                    baseTotal = 0; // Reset base total
                    currentBonus = 0; // Reset current bonus
                    totalInput.value = ""; // Clear the total value
                }
            });
        }

        // Handle +10% bonus checkbox
        bonus10.addEventListener("change", () => {
            if (bonus10.checked) {
                currentBonus = 10; // Apply +10% bonus
                bonus20.checked = false; // Uncheck +20% bonus
            } else {
                currentBonus = 0; // Remove any bonus
            }
            updateTotal(); // Update the total
        });

        // Handle +20% bonus checkbox
        bonus20.addEventListener("change", () => {
            if (bonus20.checked) {
                currentBonus = 20; // Apply +20% bonus
                bonus10.checked = false; // Uncheck +10% bonus
            } else {
                currentBonus = 0; // Remove any bonus
            }
            updateTotal(); // Update the total
        });

        // Update base total when the total value is manually edited
        totalInput.addEventListener("input", () => {
            const enteredValue = parseInt(totalInput.value || 0);
            baseTotal = enteredValue - currentBonus; // Recalculate base total
            updateTotal(); // Ensure the displayed total is correct
        });
    });

    // ===================
// Save, Load, and Reset Character Sheet
// ===================

function saveCharacterData() {
    // Collect Character Details
    const name = document.getElementById("name").value || "";
    const faction = document.getElementById("faction").value || "";
    const classPath = document.getElementById("classPath").value || "";

    // Collect Personal Details
    const personalInputs = document.querySelectorAll(".personal-details input");
    const personalDetails = Array.from(personalInputs).map(input => ({
        value: input.value || ""
    }));

    // Collect Main Profile
    const mainAttributes = ['cs', 's', 't', 'ag', 'int', 'aff', 'wis', 'fel'];
    const mainProfileData = mainAttributes.map(attr => {
        const startingInput = document.querySelector(`.main-starting[data-attr="${attr}"]`);
        const advanceInput = document.querySelector(`.main-advance[data-attr="${attr}"]`);
        const checkboxes = Array.from(document.querySelectorAll(`.main-checkbox[data-attr="${attr}"]`))
            .map(cb => cb.checked);

        return {
            starting: startingInput ? startingInput.value : "0",
            advance: advanceInput ? advanceInput.value : "0",
            checkboxes: checkboxes
        };
    });

    // Collect Secondary Profile
    const secondaryAttributes = ['a', 'w', 'pow', 'def', 'm', 'ae', 'cp', 'fp'];
    const secondaryProfileData = secondaryAttributes.map(attr => {
        const startingInput = document.querySelector(`.secondary-starting[data-attr="${attr}"]`);
        const advanceInput = document.querySelector(`.secondary-advance[data-attr="${attr}"]`);
        const checkboxes = Array.from(document.querySelectorAll(`.secondary-checkbox[data-attr="${attr}"]`))
            .map(cb => cb.checked);
            return {
                starting: startingInput ? startingInput.value : "0",
                advance: advanceInput ? advanceInput.value : "0",
                checkboxes: checkboxes
            };
        });

    // Collect Talents
    const talents = [];
    const talentRows = document.querySelectorAll("#talents .talents-table tbody tr");
    talentRows.forEach(row => {
        const talent = row.cells[0].querySelector("input").value || "";
        const description = row.cells[1].querySelector("input").value || "";
        talents.push({ talent, description });
    });

    // Collect Acquisitions
    const acquisitions = [];
    const acquisitionRows = document.querySelectorAll("#acquisitions .acquisition-table tbody tr");
    acquisitionRows.forEach(row => {
        const acquisition = row.cells[0].querySelector("input").value || "";
        const description = row.cells[1].querySelector("input").value || "";
        acquisitions.push({ acquisition, description });
    });

    // Collect Skills
    const skills = [];
    const skillRows = document.querySelectorAll(".skills-table tbody tr");
    skillRows.forEach(row => {
        const taken = row.querySelector(".skill-taken").checked;
        const total = row.querySelector(".skill-total").value || "0";
        const plus10 = row.querySelector(".bonus-10").checked;
        const plus20 = row.querySelector(".bonus-20").checked;
        const skillName = row.cells[1].textContent || ""; // Assuming skill name is in the second cell
        skills.push({ skill: skillName, taken, total, plus10, plus20 });
    });

    // Construct characterData object
    const characterData = {
        // Character Details
        name: name,
        faction: faction,
        classPath: classPath,
    
        // Personal Details
        personalDetails: personalDetails,
        gender: gender,
        age: age,
        dateOfBirth: dateOfBirth,
        birthplace: birthplace,
        nationality: nationality,
        religion: religion,
        height: height,
        weight: weight,
        eyes: eyes,
        hair: hair,
        marks: marks,
    
        // Profiles
        mainProfile: mainProfileData,
        secondaryProfile: secondaryProfileData,
    
        // Talents and Acquisitions
        talents: talents,
        acquisitions: acquisitions,
    
        // Skills
        skills: skills,
    };
    
    // Save to localStorage
    localStorage.setItem('characterData', JSON.stringify(characterData));

    alert("Character data saved successfully!");
}


// Load all data
function loadCharacterData() {
    const data = JSON.parse(localStorage.getItem("characterData"));
    if (!data) {
        alert("No saved data found!");
        return;
    }

    // Load Character Details
    document.getElementById("name").value = data.name || "";
    document.getElementById("faction").value = data.faction || "";
    document.getElementById("classPath").value = data.classPath || "";

    // Load Personal Details
    const personalInputs = document.querySelectorAll(".personal-details input");
    data.personalDetails.forEach((detail, index) => {
        if (personalInputs[index]) personalInputs[index].value = detail.value || "";
    });

    // Load Main Profile
    const mainAttributes = ['cs', 's', 't', 'ag', 'int', 'aff', 'wis', 'fel'];
    const mainProfileData = data.mainProfile || [];

    mainAttributes.forEach((attr, index) => {
        const startingInput = document.querySelector(`.main-starting[data-attr="${attr}"]`);
        const advanceInput = document.querySelector(`.main-advance[data-attr="${attr}"]`);
        const checkboxes = document.querySelectorAll(`.main-checkbox[data-attr="${attr}"]`);

        const profileData = mainProfileData[index];
        if (profileData) {
            if (startingInput) startingInput.value = profileData.starting || "0";
            if (advanceInput) advanceInput.value = profileData.advance || "0";

            // Load checkbox states
            if (profileData.checkboxes && Array.isArray(profileData.checkboxes)) {
                profileData.checkboxes.forEach((isChecked, idx) => {
                    if (checkboxes[idx]) checkboxes[idx].checked = isChecked || false;
                });
            } else {
                // If no saved states, set all to unchecked
                checkboxes.forEach(cb => cb.checked = false);
            }
        } else {
            if (startingInput) startingInput.value = "0";
            if (advanceInput) advanceInput.value = "0";
            checkboxes.forEach(cb => cb.checked = false);
        }
    });

    // Load Secondary Profile
    const secondaryAttributes = ['a', 'w', 'pow', 'def', 'm', 'ae', 'cp', 'fp'];
    const secondaryProfileData = data.secondaryProfile || [];

    secondaryAttributes.forEach((attr, index) => {
        const startingInput = document.querySelector(`.secondary-starting[data-attr="${attr}"]`);
        const advanceInput = document.querySelector(`.secondary-advance[data-attr="${attr}"]`);
        const checkboxes = document.querySelectorAll(`.secondary-checkbox[data-attr="${attr}"]`);

        const profileData = secondaryProfileData[index];
        if (profileData) {
            if (startingInput) startingInput.value = profileData.starting || "0";
            if (advanceInput) advanceInput.value = profileData.advance || "0";

            // Load checkbox states
            if (profileData.checkboxes && Array.isArray(profileData.checkboxes)) {
                profileData.checkboxes.forEach((isChecked, idx) => {
                    if (checkboxes[idx]) checkboxes[idx].checked = isChecked || false;
                });
            } else {
                // If no saved states, set all to unchecked
                checkboxes.forEach(cb => cb.checked = false);
            }
        } else {
            if (startingInput) startingInput.value = "0";
            if (advanceInput) advanceInput.value = "0";
            checkboxes.forEach(cb => cb.checked = false);
        }
    });     

    // Load Talents
    const talentsTableBody = document.querySelector("#talents .talents-table tbody");
    talentsTableBody.innerHTML = ""; // Clear existing rows
    data.talents.forEach((talent) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="text" value="${talent.talent}"></td>
            <td><input type="text" value="${talent.description}"></td>
        `;
        talentsTableBody.appendChild(newRow);
    });

    // Load Acquisitions
    const acquisitionsTableBody = document.querySelector("#acquisitions .acquisition-table tbody");
    acquisitionsTableBody.innerHTML = ""; // Clear existing rows
    data.acquisitions.forEach((acquisition) => {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="text" value="${acquisition.acquisition}"></td>
            <td><input type="text" value="${acquisition.description}"></td>
        `;
        acquisitionsTableBody.appendChild(newRow);
    });

    // Load Skills
    const skillRows = document.querySelectorAll(".skills-table tbody tr");
    data.skills.forEach((skill, index) => {
        const row = skillRows[index];
        if (row) {
            row.querySelector(".skill-taken").checked = skill.taken;
            row.querySelector(".skill-total").value = skill.total || "0";
            row.querySelector(".bonus-10").checked = skill.plus10;
            row.querySelector(".bonus-20").checked = skill.plus20;
        }
    });

   // After loading all data
updateCurrentValues();


    alert("Character data loaded successfully!");
}

// Reset all data
function resetCharacterSheet() {
    if (confirm("Are you sure you want to reset the sheet? All data will be lost.")) {
        document.querySelectorAll("input, textarea").forEach((input) => {
            if (input.type === "checkbox") {
                input.checked = false;
            } else {
                input.value = "";
            }
        });
        const talentsTableBody = document.querySelector("#talents .talents-table tbody");
        const acquisitionsTableBody = document.querySelector("#acquisitions .acquisition-table tbody");
        talentsTableBody.innerHTML = "<tr><td><input type='text'></td><td><input type='text'></td></tr>";
        acquisitionsTableBody.innerHTML = "<tr><td><input type='text'></td><td><input type='text'></td></tr>";
        alert("Character sheet has been reset!");
    }
}

// Attach event listeners
document.getElementById("saveButton").addEventListener("click", saveCharacterData);
document.getElementById("loadButton").addEventListener("click", loadCharacterData);
document.getElementById("resetButton").addEventListener("click", resetCharacterSheet);
 });

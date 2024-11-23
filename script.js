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
    // Update Current Values Based on Starting
    // ===================
    const startingInputs = document.querySelectorAll(".main-starting");
    const currentInputs = document.querySelectorAll(".main-current");

    function updateCurrentValues() {
        startingInputs.forEach((input) => {
            input.addEventListener("input", () => {
                const attr = input.dataset.attr; // Attribute identifier (e.g., "ws", "bs", etc.)
                const correspondingCurrent = document.querySelector(`.main-current[data-attr="${attr}"]`);

                if (correspondingCurrent) {
                    correspondingCurrent.value = input.value; // Update current value to match starting
                }
            });
        });
    }

    updateCurrentValues(); // Initialize event listeners for starting inputs

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
        const data = {
            name: document.getElementById("name").value,
            race: document.getElementById("race").value,
            career: document.getElementById("career").value,
            primaryProfile: Array.from(document.querySelectorAll(".primary-profile input")).map((input) => input.value),
            secondaryProfile: Array.from(document.querySelectorAll(".secondary-profile input")).map((input) => input.value),
            skills: Array.from(document.querySelectorAll(".skills-section tbody tr")).map((row) => ({
                skill: row.querySelector("td:nth-child(2)").textContent,
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
    function showPage(pageNumber) {
        // Hide all pages
        const pages = document.querySelectorAll(".page");
        pages.forEach((page) => {
            page.style.display = "none"; // Hide all pages
        });
    
        // Show the selected page
        const selectedPage = document.getElementById(`page-${pageNumber}`);
        if (selectedPage) {
            selectedPage.style.display = "block"; // Display the selected page
        }
    }
    
    // Initialize the first page to be visible on load
    document.addEventListener("DOMContentLoaded", () => {
        showPage(1); // Default to the first page
    });
    
    
        // Attach page navigation buttons
        const page1Button = document.querySelector("button[onclick='showPage(1)']");
        const page2Button = document.querySelector("button[onclick='showPage(2)']");
    
        if (page1Button) {
            page1Button.addEventListener("click", () => showPage(1));
        }
        if (page2Button) {
            page2Button.addEventListener("click", () => showPage(2));
        }
    
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
        // Save, Load, and Reset Character Sheet
        // ===================
        function saveCharacterData() {
            const data = {
                name: document.getElementById("name")?.value || "",
                race: document.getElementById("race")?.value || "",
                career: document.getElementById("career")?.value || "",
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
    
            alert("Character data loaded!");
        }
    
        function resetCharacterSheet() {
            if (confirm("Are you sure you want to reset the sheet? All data will be lost.")) {
                document.querySelectorAll("input").forEach((input) => {
                    if (input.type === "checkbox") {
                        input.checked = false;
                    } else {
                        input.value = "";
                    }
                });
            }
        }
    
        // Attach save/load/reset buttons
        const saveButton = document.getElementById("saveButton");
        const loadButton = document.getElementById("loadButton");
        const resetButton = document.getElementById("resetButton");
    
        if (saveButton) saveButton.addEventListener("click", saveCharacterData);
        if (loadButton) loadButton.addEventListener("click", loadCharacterData);
        if (resetButton) resetButton.addEventListener("click", resetCharacterSheet);
    });
    
    document.addEventListener("DOMContentLoaded", () => {
        const saveButton = document.getElementById("saveButton");
        const loadButton = document.getElementById("loadButton");
        const resetButton = document.getElementById("resetButton");
    
        if (saveButton) {
            saveButton.addEventListener("click", saveCharacterData);
        }
        if (loadButton) {
            loadButton.addEventListener("click", loadCharacterData);
        }
        if (resetButton) {
            resetButton.addEventListener("click", resetCharacterSheet);
        }
    })
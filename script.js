
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

// Save all data
function saveCharacterData() {
    const data = {
        // Character Details
        name: document.getElementById("name")?.value || "",
        faction: document.getElementById("faction")?.value || "",
        classPath: document.getElementById("class-path")?.value || "",

        // Personal Details
        personalDetails: Array.from(document.querySelectorAll(".personal-details input")).map((input) => ({
            value: input.value || "",
        })),

        // Save Main and Secondary Profiles
mainProfile: Array.from(document.querySelectorAll(".main-profile-row")).map((row) => ({
    starting: Array.from(row.querySelectorAll(".main-starting")).map((input) => input.value || "0"),
    advance: Array.from(row.querySelectorAll(".main-advance")).map((input) => input.value || "0"),
    current: Array.from(row.querySelectorAll(".main-current")).map((input) => input.value || "0"),
    checkboxes: Array.from(row.querySelectorAll(".checkbox-group")).map((group) => 
        Array.from(group.querySelectorAll("input[type='checkbox']")).map((checkbox) => checkbox.checked || false)
    ),
})),
secondaryProfile: Array.from(document.querySelectorAll(".secondary-profile-row")).map((row) => ({
    starting: Array.from(row.querySelectorAll(".secondary-starting")).map((input) => input.value || "0"),
    advance: Array.from(row.querySelectorAll(".secondary-advance")).map((input) => input.value || "0"),
    current: Array.from(row.querySelectorAll(".secondary-current")).map((input) => input.value || "0"),
    checkboxes: Array.from(row.querySelectorAll(".checkbox-group")).map((group) => 
        Array.from(group.querySelectorAll("input[type='checkbox']")).map((checkbox) => checkbox.checked || false)
    ),
})),


        // Talents and Acquisitions
        talents: Array.from(document.querySelectorAll("#talents .talents-table tbody tr")).map((row) => ({
            talent: row.querySelector("td:nth-child(1) input")?.value || "",
            description: row.querySelector("td:nth-child(2) input")?.value || "",
        })),
        acquisitions: Array.from(document.querySelectorAll("#acquisitions .acquisition-table tbody tr")).map((row) => ({
            acquisition: row.querySelector("td:nth-child(1) input")?.value || "",
            description: row.querySelector("td:nth-child(2) input")?.value || "",
        })),

        // Skills (Basic and Advanced)
        basicSkills: Array.from(document.querySelectorAll("#basic-skills .skills-table tbody tr")).map((row) => ({
            skill: row.querySelector("td:nth-child(2)")?.textContent || "",
            total: row.querySelector(".skill-total")?.value || "",
            taken: row.querySelector(".skill-taken")?.checked || false,
            plus10: row.querySelector(".bonus-10")?.checked || false,
            plus20: row.querySelector(".bonus-20")?.checked || false,
        })),
        advancedSkills: Array.from(document.querySelectorAll("#advanced-skills .skills-table tbody tr")).map((row) => ({
            skill: row.querySelector("td:nth-child(2)")?.textContent || "",
            total: row.querySelector(".skill-total")?.value || "",
            taken: row.querySelector(".skill-taken")?.checked || false,
            plus10: row.querySelector(".bonus-10")?.checked || false,
            plus20: row.querySelector(".bonus-20")?.checked || false,
        })),
    };

    try {
        localStorage.setItem("characterData", JSON.stringify(data));
        alert("Character data saved successfully!");
    } catch (error) {
        console.error("Error saving data to localStorage:", error);
        alert("An error occurred while saving your data.");
    }
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
    document.getElementById("class-path").value = data.classPath || "";

    // Load Personal Details
    const personalInputs = document.querySelectorAll(".personal-details input");
    data.personalDetails.forEach((detail, index) => {
        if (personalInputs[index]) personalInputs[index].value = detail.value || "";
    });

  // Load Main Profile
  const mainProfileRows = document.querySelectorAll(".main-profile-row");
  data.mainProfile.forEach((item, rowIndex) => {
      if (mainProfileRows[rowIndex]) {
          const row = mainProfileRows[rowIndex];

          // Populate starting, advance, and current values
          const startingInputs = row.querySelectorAll(".main-starting");
          const advanceInputs = row.querySelectorAll(".main-advance");
          const currentInputs = row.querySelectorAll(".main-current");

          item.starting.forEach((value, index) => {
              if (startingInputs[index]) startingInputs[index].value = value || "0";
          });

          item.advance.forEach((value, index) => {
              if (advanceInputs[index]) advanceInputs[index].value = value || "0";
          });

          item.current.forEach((value, index) => {
              if (currentInputs[index]) currentInputs[index].value = value || "0"; // Use saved value
          });

          // Populate checkboxes
          const checkboxGroups = row.querySelectorAll(".checkbox-group");
          item.checkboxes.forEach((groupValues, groupIndex) => {
              const checkboxes = checkboxGroups[groupIndex]?.querySelectorAll("input[type='checkbox']");
              if (checkboxes) {
                  groupValues.forEach((isChecked, checkboxIndex) => {
                      if (checkboxes[checkboxIndex]) checkboxes[checkboxIndex].checked = isChecked || false;
                  });
              }
          });
      }
  });

  // Load Secondary Profile
  const secondaryProfileRows = document.querySelectorAll(".secondary-profile-row");
  data.secondaryProfile.forEach((item, rowIndex) => {
      if (secondaryProfileRows[rowIndex]) {
          const row = secondaryProfileRows[rowIndex];

          // Populate starting, advance, and current values
          const startingInputs = row.querySelectorAll(".secondary-starting");
          const advanceInputs = row.querySelectorAll(".secondary-advance");
          const currentInputs = row.querySelectorAll(".secondary-current");

          item.starting.forEach((value, index) => {
              if (startingInputs[index]) startingInputs[index].value = value || "0";
          });

          item.advance.forEach((value, index) => {
              if (advanceInputs[index]) advanceInputs[index].value = value || "0";
          });

          item.current.forEach((value, index) => {
              if (currentInputs[index]) currentInputs[index].value = value || "0"; // Use saved value
          });

          // Populate checkboxes
          const checkboxGroups = row.querySelectorAll(".checkbox-group");
          item.checkboxes.forEach((groupValues, groupIndex) => {
              const checkboxes = checkboxGroups[groupIndex]?.querySelectorAll("input[type='checkbox']");
              if (checkboxes) {
                  groupValues.forEach((isChecked, checkboxIndex) => {
                      if (checkboxes[checkboxIndex]) checkboxes[checkboxIndex].checked = isChecked || false;
                  });
              }
          });
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
    // Save Character Data
    // ===================
    function saveCharacterData() {
        const data = {
            // Personal Details
            name: document.getElementById("name")?.value || "",
            race: document.getElementById("race")?.value || "",
            career: document.getElementById("career")?.value || "",
            gender: document.getElementById("gender")?.value || "",
            age: document.getElementById("age")?.value || "",
            dateOfBirth: document.getElementById("dateOfBirth")?.value || "",
            birthplace: document.getElementById("birthplace")?.value || "",
            nationality: document.getElementById("nationality")?.value || "",
            religion: document.getElementById("religion")?.value || "",
            height: document.getElementById("height")?.value || "",
            weight: document.getElementById("weight")?.value || "",
            eyes: document.getElementById("eyes")?.value || "",
            hair: document.getElementById("hair")?.value || "",
            marks: document.getElementById("marks")?.value || "",

            // Main and Secondary Profiles
            mainProfile: Array.from(document.querySelectorAll(".main-starting")).map((input) => ({
                value: input.value || "",
                checked: input.type === "checkbox" ? input.checked : undefined,
            })),
            secondaryProfile: Array.from(document.querySelectorAll(".main-advance")).map((input) => ({
                value: input.value || "",
                checked: input.type === "checkbox" ? input.checked : undefined,
            })),

            // Talents and Acquisitions
            talents: Array.from(document.querySelectorAll("#talents .talents-table tbody tr")).map(row => ({
                talent: row.querySelector("td:nth-child(1) input")?.value || "",
                description: row.querySelector("td:nth-child(2) input")?.value || "",
            })),
            acquisitions: Array.from(document.querySelectorAll("#acquisitions .acquisition-table tbody tr")).map(row => ({
                acquisition: row.querySelector("td:nth-child(1) input")?.value || "",
                description: row.querySelector("td:nth-child(2) input")?.value || "",
            })),

            // Skills (Basic and Advanced)
            skills: Array.from(document.querySelectorAll(".skills-table tbody tr")).map(row => ({
                skill: row.querySelector("td:nth-child(2)")?.textContent || "",
                total: row.querySelector(".skill-total")?.value || "",
                plus10: row.querySelector(".bonus-10")?.checked || false,
                plus20: row.querySelector(".bonus-20")?.checked || false,
            })),
        };

        localStorage.setItem("characterData", JSON.stringify(data));
        alert("Character data saved!");
    }

    // ===================
    // Load Character Data
    // ===================
    function loadCharacterData() {
        const data = JSON.parse(localStorage.getItem("characterData"));
        if (!data) {
            alert("No saved data found!");
            return;
        }

        // Populate Personal Details
        document.getElementById("name").value = data.name || "";
        document.getElementById("race").value = data.race || "";
        document.getElementById("career").value = data.career || "";
        document.getElementById("gender").value = data.gender || "";
        document.getElementById("age").value = data.age || "";
        document.getElementById("dateOfBirth").value = data.dateOfBirth || "";
        document.getElementById("birthplace").value = data.birthplace || "";
        document.getElementById("nationality").value = data.nationality || "";
        document.getElementById("religion").value = data.religion || "";
        document.getElementById("height").value = data.height || "";
        document.getElementById("weight").value = data.weight || "";
        document.getElementById("eyes").value = data.eyes || "";
        document.getElementById("hair").value = data.hair || "";
        document.getElementById("marks").value = data.marks || "";

         // Populate Main and Secondary Profiles
    const mainStartingInputs = document.querySelectorAll(".main-starting");
    const mainAdvanceInputs = document.querySelectorAll(".main-advance");
    const mainCurrentInputs = document.querySelectorAll(".main-current");

    data.mainProfile.forEach((item, index) => {
        if (mainStartingInputs[index]) {
            mainStartingInputs[index].value = item.value || "";
            if (mainStartingInputs[index].type === "checkbox") {
                mainStartingInputs[index].checked = item.checked || false;
            }
        }
    });

    data.secondaryProfile.forEach((item, index) => {
        if (mainAdvanceInputs[index]) {
            mainAdvanceInputs[index].value = item.value || "";
            if (mainAdvanceInputs[index].type === "checkbox") {
                mainAdvanceInputs[index].checked = item.checked || false;
            }
        }
    });

    // Dynamically calculate the Current values for Main and Secondary Profiles
    mainCurrentInputs.forEach((input, index) => {
        const startingValue = parseInt(mainStartingInputs[index]?.value || 0);
        const advanceValue = parseInt(mainAdvanceInputs[index]?.value || 0);
        input.value = startingValue + advanceValue;
    });

        // Populate Talents
        const talentsTableBody = document.querySelector("#talents .talents-table tbody");
        talentsTableBody.innerHTML = ""; // Clear existing rows
        data.talents.forEach(talent => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td><input type="text" value="${talent.talent}"></td>
                <td><input type="text" value="${talent.description}"></td>
            `;
            talentsTableBody.appendChild(newRow);
        });

        // Populate Acquisitions
        const acquisitionsTableBody = document.querySelector("#acquisitions .acquisition-table tbody");
        acquisitionsTableBody.innerHTML = ""; // Clear existing rows
        data.acquisitions.forEach(acquisition => {
            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td><input type="text" value="${acquisition.acquisition}"></td>
                <td><input type="text" value="${acquisition.description}"></td>
            `;
            acquisitionsTableBody.appendChild(newRow);
        });

        // Populate Skills
        const skillRows = document.querySelectorAll(".skills-table tbody tr");
        data.skills.forEach((skill, index) => {
            const row = skillRows[index];
            if (row) {
                row.querySelector(".skill-total").value = skill.total;
                row.querySelector(".bonus-10").checked = skill.plus10;
                row.querySelector(".bonus-20").checked = skill.plus20;
            }
        });

        alert("Character data loaded!");
    }

    // ===================
    // Reset Character Sheet
    // ===================
    function resetCharacterSheet() {
        if (confirm("Are you sure you want to reset the sheet? All data will be lost.")) {
            document.querySelectorAll("input, textarea").forEach(input => {
                if (input.type === "checkbox") {
                    input.checked = false;
                } else {
                    input.value = "";
                }
            });
        }
    }

    // Attach Event Listeners
    const saveButton = document.getElementById("saveButton");
    const loadButton = document.getElementById("loadButton");
    const resetButton = document.getElementById("resetButton");

    if (saveButton) saveButton.addEventListener("click", saveCharacterData);
    if (loadButton) loadButton.addEventListener("click", loadCharacterData);
    if (resetButton) resetButton.addEventListener("click", resetCharacterSheet);
});

document.addEventListener("DOMContentLoaded", () => {
    const maxEncInput = document.getElementById("maxEnc");
    const totalEncInput = document.getElementById("totalEnc");

    // Example placeholder value for 'S' (can be dynamically populated)
    const S = 10;

    // Calculate Maximum Enc Capacity
    maxEncInput.value = S * 30;

    // Calculate Total Encumbrance
    const tableRows = document.querySelectorAll(".inventory-table tbody tr");
    tableRows.forEach((row) => {
        row.addEventListener("input", () => {
            let totalEnc = 0;
            tableRows.forEach((row) => {
                const encCells = row.querySelectorAll("td:nth-child(3), td:nth-child(6), td:nth-child(9)");
                encCells.forEach((cell) => {
                    const encValue = parseInt(cell.textContent) || 0;
                    totalEnc += encValue;
                });
            });
            totalEncInput.value = totalEnc;
        });
    });
});

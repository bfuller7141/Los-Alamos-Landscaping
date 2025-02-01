function updateSubject(event) {
      // Get the input elements
      const firstNameElement = document.getElementById("first-name");
      const lastNameElement = document.getElementById("last-name");
      const subjectField = document.getElementById("subject");
  
      // Ensure all elements exist before accessing .value
      if (firstNameElement && lastNameElement && subjectField) {
        const firstName = firstNameElement.value.trim();
        const lastName = lastNameElement.value.trim();
        
        // Set the dynamic subject line
        subjectField.value = `New Estimate Request from ${firstName} ${lastName}`;
  
      // Allow the form to submit
      return true;
    }
  
    // Ensure the function is triggered before form submission
      // Ensure the function is triggered before form submission
      document.getElementById("estimate-form").addEventListener("submit", updateSubject);
    }
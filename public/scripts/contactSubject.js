document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");

  if (!contactForm) {
    console.warn("Contact form not found. Script execution aborted.");
    return;
  }

  contactForm.addEventListener("submit", function (event) {
    // Get the input elements
    const firstNameElement = document.getElementById("first-name");
    const lastNameElement = document.getElementById("last-name");
    const subjectField = document.getElementById("subject");

    // Ensure all elements exist before accessing .value
    if (firstNameElement && lastNameElement && subjectField) {
      const firstName = firstNameElement.value.trim();
      const lastName = lastNameElement.value.trim();

      // Set the dynamic subject line
      subjectField.value = `New Contact Submission from ${firstName} ${lastName}`;
    }
  });
});
console.log("app.js loaded");

const button = document.getElementById("testBtn");
const input = document.getElementById("numberInput");
const result = document.getElementById("result");
const successModal = document.getElementById("successModal");
const modalMessage = document.getElementById("modalMessage");
const closeModalBtn = document.getElementById("closeModalBtn");
const simpleTestBtn = document.getElementById("simpleTestBtn");

console.log("Button element:", button);
console.log("Input element:", input);
console.log("Modal element:", successModal);
console.log("Modal message element:", modalMessage);
console.log("Close button element:", closeModalBtn);
console.log("Simple test button:", simpleTestBtn);

// Simple test button to verify clicks work
if (simpleTestBtn) {
  simpleTestBtn.addEventListener("click", function () {
    alert("Test button works! Clicks are being detected.");
    console.log("Simple test button clicked successfully");
  });
}

// Load saved number from localStorage on page load
window.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded event fired");
  const savedNumber = localStorage.getItem("savedNumber");
  if (savedNumber) {
    input.value = savedNumber;
    console.log("Loaded saved number:", savedNumber);
  }
});

// Close modal when close button is clicked
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", function () {
    console.log("Close button clicked");
    successModal.classList.remove("show");
  });
}

// Close modal when clicking outside of it
window.addEventListener("click", function (event) {
  if (event.target === successModal) {
    console.log("Clicked outside modal");
    successModal.classList.remove("show");
  }
});

if (button) {
  console.log("Button found, adding click listener");
  button.addEventListener("click", async function () {
    console.log("Button clicked!");
    try {
      const value = input.value;
      console.log("Input value:", value);
      
      if (!value) {
        console.log("No value entered");
        alert("Please enter a number");
        return;
      }

      console.log("Saving to localStorage...");
      // Save to localStorage
      localStorage.setItem("savedNumber", value);

      console.log("Showing modal IMMEDIATELY...");
      // Show the large modal popup IMMEDIATELY (before Firebase)
      if (modalMessage) {
        modalMessage.textContent = "Number saved: " + value;
      }
      if (successModal) {
        successModal.classList.add("show");
      }

      console.log("Triggering confetti...");
      // Trigger confetti animation
      if (typeof confetti !== 'undefined') {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        // Optional: trigger more confetti bursts
        setTimeout(() => {
          confetti({
            particleCount: 50,
            spread: 100,
          });
        }, 200);
      } else {
        console.error("Confetti library not loaded");
      }

      if (result) {
        result.textContent = "Saved locally. Syncing to cloud...";
      }

      // Now save to Firebase in the background (non-blocking)
      console.log("Saving to Firebase in background...");
      
      db.collection("test").add({
        number: Number(value),
        created: new Date()
      }).then(() => {
        console.log("Firebase saved successfully");
        if (result) {
          result.textContent = "Saved to cloud: " + value;
        }
      }).catch((firebaseError) => {
        console.error("Firebase error:", firebaseError);
        if (result) {
          result.textContent = "Local save OK. Cloud sync failed: " + firebaseError.message;
        }
      });
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      alert("Error: " + error.message);
      if (result) {
        result.textContent = "Error: " + error.message;
      }
    }
  });
} else {
  console.error("Button with id 'testBtn' not found");
}
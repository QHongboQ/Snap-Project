/*This is an object, contain three arrays, I will add elements later, after I read the file*/
const email = {
  isSpam: [],
  title: [],
  result: []
}

// Define variables
let allRows = [];

// Load the CSV file using Papa Parse
Papa.parse("fraud_email_.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,
  complete: loadFile
});

// Load the CSV file and parse it
function loadFile(results) {
  allRows = results.data;
  loadEmails(3);
}


// The basic function to load emails, every function needed call this one
function loadEmails(count, filterType) {
  // Clear all data, and re-load the email data
  resetEmailData();

  // This variable serve for filter
  // If I need first ten spam, I will skip legit email
  // So when I found one spam email, this variable will plus one
  let added = 0;

  for (let i = 0; i < allRows.length; i++) {
    let row = allRows[i];

    // Function of filter, spam or legit
    if (filterType === "spam" && row.Class !== "1") {
      continue;
    }
    if (filterType === "legit" && row.Class !== "0") {
      continue;
    }

    addRowToEmail(row);
    added++;

    // This also serve for filter
    // If I need first ten spam or legit email
    // I will stop when I found ten emails
    if (added >= count) {
      break;
    }
  }

  displayEmails();
}


// This function will add the email data to the email object
function addRowToEmail(row) {
  // Interact with "header: true," when the file has header 
  // Using row.Class to access the first column of the CSV file, which is 0 or 1
  // Using row.Text to access the second column of the CSV file, which is the email text
  const IsSpam = row.Class;
  // Load the first 10 words of the email text as the title
  const Title = row.Text.split(" ").slice(0, 10).join(" ") + " ...";

  // Add the email data to the email object
  email.isSpam.push(IsSpam);
  email.title.push(Title);
  if (IsSpam == "1") {
    email.result.push("This is a spam email. Be cautious.");
  } else {
    email.result.push("This is a legitimate email. It is safe.");
  }
}

// This function will add the email data to the email object
function addEmail() {
  // Arrive to the maximum number of emails
  if (email.title.length >= 10) {
    alert("You can only add up to 10 emails.");
    return;
  }

  // If still has space, I will add the next email
  const nextRow = allRows[email.title.length];
  addRowToEmail(nextRow);
  displayEmails();
}


// Button to remove the last email
function removeLastEmail() {
  if (email.title.length > 0) {
    // Remove the last email from the arrays
    email.isSpam.pop();
    email.title.pop();
    email.result.pop();
    // Display the updated emails
    displayEmails();
  } else {
    // When the arrays are empty, I will alert the user
    alert("All cards have been removed. Nothing left to delete.");
  }
}


// Main function to display the emails in the container
function displayEmails() {
  // Access the element with the ID "email-container" and clear its content
  const container = document.getElementById("email-container");
  // Clear the container before displaying new emails
  container.innerHTML = "";

  // Until the length of the email title, I will create a card for each email
  for (let i = 0; i < email.title.length; i++) {
    let title = email.title[i];
    let isSpam = email.isSpam[i];
    let result = email.result[i];

    // Check the value of isSpam and set the image URL accordingly
    let imageURL;
    if (isSpam == "1") {
      imageURL = "Fraud.png";
    } else {
      imageURL = "No_Fraud.png";
    }

    // Interact with the HTML, create a card for each email
    const card = document.createElement("div"); // Access the div element
    card.className = "email-card";  // <div class="email-card"></div>
    card.innerHTML =
    '<img src="' + imageURL + '" class="email-status" />' +
    '<p class="email-title">Title: ' + title + '</p>' +
    '<p class="alert-text">' + result + '</p>';
    
    // DOM operation, append the card to the container
    container.appendChild(card);
  }
}


// Set the array as empty, to clear the data
function resetEmailData() {
  email.isSpam = [];
  email.title = [];
  email.result = [];
}

// Function to show all emails
function showAll() {
  loadEmails(10);
}

// Filter function to show spam emails
function showSpam() {
  loadEmails(10, "spam");
}

// Filter function to show legitimate emails
function showLegit() {
  loadEmails(10, "legit");
}
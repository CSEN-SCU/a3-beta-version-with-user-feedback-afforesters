/*
    * This is a sample content script that will run on the pages specified in the manifest.
*/

// Remove the youtube home feed
document.querySelector('ytd-browse[role="main"][page-subtype="home"] #contents').remove();

// Create a new <p> element
var message = document.createElement("p");
message.textContent = "Feed Hidden";
message.style = "font-size: 50px; color: red; text-align: center;";

// Get the element with id "primary" from the youtube home page.
var primaryElement = document.getElementById("primary");

// Append the <p> element to the "primary" element
primaryElement.appendChild(message);

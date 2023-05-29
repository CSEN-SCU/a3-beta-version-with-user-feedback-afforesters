console.log('Running Content Script');

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.cmd === 'TIME_IS_UP') {
    blockScreen();
    sendResponse({ status: 'done' });
  }
});

// Function to block the screen
function blockScreen() {
  // Create a div element to cover the screen
  const blockerDiv = document.createElement('div');
  blockerDiv.style.position = 'fixed';
  blockerDiv.style.top = '0';
  blockerDiv.style.left = '0';
  blockerDiv.style.width = '100%';
  blockerDiv.style.height = '100%';
  blockerDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  blockerDiv.style.zIndex = '9999';

  const img = document.createElement('img');
  img.style.position = 'fixed';
  img.style.top = '50%';
  img.style.left = '50%';
  img.style.transform = 'translate(-50%, -50%)';
  img.style.zIndex = '10000';
  img.src =
    'https://www.shutterstock.com/image-vector/times-red-sign-vector-illustration-260nw-1338912215.jpg';
  // Add the div element to the page

  const unblockDiv = document.createElement('button');
  unblockDiv.classList.add('button-container-div');
  unblockDiv.textContent = 'Close Tab';
  unblockDiv.style.position = 'absolute';
  unblockDiv.style.textAlign = 'center';
  unblockDiv.style.border = '4px solid coral';
  unblockDiv.style.height = '10vh';
  unblockDiv.style.width = '10vh';
  unblockDiv.style.zIndex = '10001';
  unblockDiv.style.top = '20%';
  unblockDiv.style.left = '47%';
  unblockDiv.style.margin = '0';
  unblockDiv.style.backgroundColor = 'white';
  // Add event listener to the button
  unblockDiv.addEventListener('click', () => {
    // Close the current tab
    window.close();
  });

  document.body.appendChild(blockerDiv);
  document.body.appendChild(img);
  document.body.appendChild(unblockDiv);
}

console.log('Running Content Script');

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

let isBlocked = false;

const extractDomainName = (url) => {
  if (url === '') {
    return '';
  } else {
    const re = new RegExp('^(?:https?://)?(?:[^@/\n]+@)?(?:www.)?([^:/?\n]+)');
    return re.exec(url)[1];
  }
};

const domainName = extractDomainName(window.location.href);
console.log('domainName', domainName);

const checkIfBlockCurrentPage = async () => {
  const { LOCAL_TIMERS } = await chrome.storage.local.get('LOCAL_TIMERS');
  const timers = JSON.parse(LOCAL_TIMERS);
  const timerKey = `timer-${domainName}`;
  const timer = timers[timerKey];

  if (timer && timer.time >= timer.timeLimit && timer.type === 'max') {
    blockScreen();
    console.log('block current page');
    isBlocked = true;
  } else {
    console.log('current page is not blocked');
  }
};

checkIfBlockCurrentPage();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('receive: ', request);
  if (request.cmd === 'TIME_IS_UP') {
    blockScreen();
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
  unblockDiv.classList.add('rainbow');
  unblockDiv.textContent = 'Close Tab';
  unblockDiv.style.position = 'fixed';
  unblockDiv.style.textAlign = 'center';
  unblockDiv.style.height = '10vh';
  unblockDiv.style.width = '10vh';
  unblockDiv.style.zIndex = '10001';
  unblockDiv.style.top = '20%';
  unblockDiv.style.left = '50%';
  unblockDiv.style.margin = '0';
  unblockDiv.style.transform = 'translate(-50%, -50%)';

  // const unblockDiv2 = document.createElement('button');
  // unblockDiv2.classList.add('rainbow');
  // unblockDiv2.textContent = 'Reset Timer';
  // unblockDiv2.style.position = 'fixed';
  // unblockDiv2.style.textAlign = 'center';
  // unblockDiv2.style.height = '10vh';
  // unblockDiv2.style.width = '10vh';
  // unblockDiv2.style.zIndex = '10001';
  // unblockDiv2.style.top = '80%';
  // unblockDiv2.style.left = '50%';
  // unblockDiv2.style.margin = '0';
  // unblockDiv2.style.transform = 'translate(-50%, -50%)';
  //unblockDiv.style.backgroundColor = 'white';
  // Add event listener to the button
  unblockDiv.addEventListener('click', () => {
    // Close the current tab
    window.close();
  });

  // unblockDiv2.addEventListener('click', async () => {
  //   // Close the current tab
  //   document.body.removeChild(blockerDiv);
  //   document.body.removeChild(img);
  //   document.body.removeChild(unblockDiv);
  //   document.body.removeChild(unblockDiv2);

  //   await chrome.runtime.sendMessage({
  //     from: 'content',
  //     cmd: 'RESET_TIMER',
  //   });
  // });

  document.body.appendChild(blockerDiv);
  document.body.appendChild(img);
  // document.body.appendChild(unblockDiv);
  // document.body.appendChild(unblockDiv2);
}

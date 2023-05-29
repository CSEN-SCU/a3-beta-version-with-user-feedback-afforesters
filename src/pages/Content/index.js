import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.cmd === 'TIME_IS_UP') {
//     alert('time is up!!!');
//   }
// });

// when there is a minimum time limit or maximum time limit then popup a black screen

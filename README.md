# Mindful Tabs

## Description

This extension is to optimize the user's browsing experience by providing effective tab prioritization and time management tools. By visualizing tab priorities and implementing time restrictions, the extension aims to help users stay organized, maintain focus, and make the most of their time spent online.

## Author:

Jonathan Stock, Junhan Deng, Andy Qin, John Davey and Prajeet Santosh.

## Features

Tab Prioritization Management: Users can assign color-based priority levels to their tabs, allowing them to quickly identify and manage their workflow. This visual aid helps users prioritize their work and stay organized.

Maximum Limit Timer: The extension automatically blocks websites once a pre-defined time limit is reached. This prevents users from accessing the designated websites once their allocated time has expired, helping them maintain discipline and avoid excessive browsing.

Minimum Limit Timer: The extension includes a functionality that restricts users from closing the tab or browser window until a minimum usage time has been reached. This encourages users to spend a minimum amount of time on specific tasks or websites before they can move on, promoting better focus and productivity.

## Template we use

Chrome Extension (MV3) Boilerplate with React 18 and Webpack 5
https://github.com/lxieyang/chrome-extension-boilerplate-react

## Installing and Running

### Procedures:

1. Check if your [Node.js](https://nodejs.org/) version is >= **18**.
2. Clone this repository.
3. Change the package's `name`, `description`, and `repository` fields in `package.json`.
4. Change the name of your extension on `src/manifest.json`.
5. Run `npm install` to install the dependencies.
6. Run `npm start`
7. Load your extension on Chrome following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.
8. Happy hacking.

## Structure

All your extension's code must be placed in the `src` folder.

The boilerplate is already prepared to have a popup, an options page, a background page, and a new tab page (which replaces the new tab page of your browser). But feel free to customize these.

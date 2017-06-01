# jsGrid_odbc Documentation
An application stack for displaying MS Access data using the odbc driver
Used for Enrollment Data Creation

## Table of Contents
  * [Setup](#setup)
    * [Installation](#installation)
    * [Running](#running-locally)
    * [Jenkins Address](#jenkins-server-address)
  * [File Structure](#file-structure)
  * [Usage](#usage)
  * [Authors](#authors)
  * [License](#license)

## Setup
### Installation:
```
$ git clone
$ cd jsGrid_odbc
$ npm install
```
### Running Locally:
```
$ node app.js
```
In Your Browser, Navigate to
```
localhost:3000
```
### Jenkins Server Address:
```
10.115.17.17:3000
```

## File Structure 
```
.
|-public  *static assets
|---css
|---js
|-routes  *express route handlers
|-views   *ejs view templates
|---pages *ejs page files
|-app.js  *entry point 
|-package.json  *npm modules
```
## Usage

### Main Page
 Feature  | Function |
| ------------- | ------------- |
| Click to Add Row Button | Go to Data Creation Page  |
| Search Button | Go to Search and Status Update Page  |
| Environment Textfield | Display current selected environment  |
### Left Environment Selection Pane
 Feature  | Function |
| ------------- | ------------- |
| TST Button | Select TST Environment and Refresh  |
| OAT Button | Select OAT Environment and Refresh   |
| SIT2 Button | Select SIT2 Environment and Refresh   |
### Data Creation Page
**_NOTE: YOU MUST CLICK ON THE SMALL PLUS SIGN ON THE LEFT MOST COLUMN TO COMMIT YOUR INSERTION
DATA IN THE INSERTION ROW WILL NOT BE UPDATED TO THE SERVER_**

 Feature  | Function |
| ------------- | ------------- |
| Title Bar Plus Sign (Big) | Show the Insertion Row  |
| Left Most Column Plus Sign (Small) | Load data in insertion row and wait for saving |
| Save Button | Commit changes to server |
| Home Button | Go back to main page |
### Search and Submit New Status Page
**_NOTE: YOU MUST CLICK ON ```Submit New Status``` Button to Save Your Changes!_**

 Feature  | Function |
| ------------- | ------------- |
| Search Bar | Search Filter Values (blank will show no result) |
| Left most column controls | Hover to see description |
| Submit New Status Button | Commit changes to server |
| Home Button | Go back to main page |
### Commit Results Page
 Feature  | Function |
| ------------- | ------------- |
| Table | Showin Rows that Are Successfully Uploaded to the Server |

## Authors

* **Joshua Sun** - *Initial work* - [JSun](https://github.com/jsun98)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

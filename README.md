# Life Experiences Web Application

This is a Web Application that allow users to strore their precious life experiences to DATABASE.

- Did CRUD operations on databases.
- Worked on a Single Page Application.

##### To Connect to your Own Database Edit the database.json by Filling your Credentials.

    host
    user
    password
    database


<br>

## Installation of Node App

### 1. Install

```Bash
# From the root of the directory
npm install
```

### 2. Running Server

```Bash
# PORT eg. 8080,5500,etc
npm run dev PORT
# Server will be accessible at http://localhost:PORT
```

## Directory Structure

```Bash
# This contains the Backend Node Server, with our Web Application and API
app.js

# These are the package configuration files for npm to install dependencies
package.json
package-lock.json

# This is the Frontend HTML file that you see when you visit the document root
public/index.html

# This is the Frontend browser JavaScript file
public/index.js

# This is the Frontend Custom Style Sheet file
public/style.css

```

<br>

## Functionalities

#### 1. LOGIN/SIGNUP
#### 2. ADD Experience
#### 3. DELETE Experience
#### 4. UPDATE Experience

<br>

### HTTP Web Server

Used NodeJS runtime to create a simple web server.

### Web Application Framework (Web Application, API)

An Application Programming Interface (API) is essentially just an interface, we're using to serve our set of routes for the client browser JavaScript to interact using HTTP protocol to access Backend functionality.

Created a RESTful API: https://restfulapi.net/ using Express.js

HTTP Methods to consider:

- GET: read data (nothing changes)

- POST: create data

- PUT: update data

- DELETE: delete data

In Express it's very simple to create a single "route". A route is just an endpoint you can access from your JavaScript

### NodeJS Libraries

```JavaScript
// Strict Mode
'use strict'

// Express App library
const express = require("express");
const app     = express();

// Path utility library
const path    = require("path");

// File Upload library
const fileUpload = require('express-fileupload');
app.use(fileUpload());

// File reading and manipulating library
const fs = require('fs');

// Establishing Database connections
const mysql = require("mysql2/promise");

// Minimization, this is to obfuscate our JavaScript
// Obfuscation and Minimization are ways to reduce payload size
// And to get scripts to clients quicker because of the smaller size
const JavaScriptObfuscator = require('javascript-obfuscator');
```

## How does everything work together?

1. Install the dependencies (only need to do this once) and spin up your node server as described in installation above.

_Note: We're using "nodemon" (instead of say `node run dev`) because it hot-reloads app.js whenever it's changed_

2. View Web Application at http://localhost:PORT

3. The HTML is loaded when you visit the page and see forms and contents.

4. The CSS is also loaded, and you'll see the page has style.

5. The JavaScript file is loaded (index.js) and will run a bunch of "on load" AJAX calls to populate dropdowns, change elements.

6. When buttons are clicked, more AJAX calls are made to the backend, that recieve a response update the HTML.

7. An AJAX call is made from your browser, it makes an HTTP (GET, POST...) call to our web server.

8. The app.js web server receives the request with the route, and request data (JSON, url parameters, files...).

9. Express looks for the route you defined, then runs the callback function you provided.

10. The callback function (for this module) should just return a hard coded JSON response

11. The AJAX call gets a response back from our server (either a 200 OK or maybe an error like a 404 not found) and either calls the "success" callback function or the "fail" function.

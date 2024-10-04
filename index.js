const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

// Middleware for parsing JSON
app.use(bodyParser.json());

// Serve static files from "public" directory
app.use(express.static(path.join(__dirname, 'public')));

/*
1. Creating an Express.js Route for Home Page
- Write a route in Express.js that serves a `home.html` file. Create a new HTML file called `home.html` that contains an
`<h1>` tag with the message "Welcome to ExpressJs Tutorial". Ensure that the home page is served to the client when the `/home` route is accessed.

Answer: The `/home` route is set up to serve the `home.html` file located in the `public` directory.
This file contains an `<h1>` tag with the message "Welcome to ExpressJs Tutorial".
*/

router.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/home.html'));
});

/*
2. Serving JSON Data from a User File
- Modify the route `/profile` to return all details from a `user.json` file in JSON format.
The file should be sent as a response when a client makes a request to the `/profile` route.

Answer: The `/profile` route reads the `user.json` file and returns its content in JSON format.
If an error occurs (e.g., the file cannot be read), a 500 error is returned.
*/

router.get('/profile', (req, res) => {
    fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Failed to load user data' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

/*
3. Implementing User Authentication
- Modify the `/login` route to accept `username` and `password` as JSON body parameters.
- Read user data from `user.json` file.
- If the `username` and `password` are valid, return the following response:
    {
        "status": true,
        "message": "User Is valid"
    }
- If the `username` is invalid, return:
    {
        "status": false,
        "message": "User Name is invalid"
    }
- If the `password` is invalid, return:
    {
        "status": false,
        "message": "Password is invalid"
    }

Answer: The `/login` route accepts `username` and `password` from the request body,
checks these credentials against the `user.json` file, and returns an appropriate response based on the validation results.
*/

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(path.join(__dirname, 'user.json'), 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Server error' });
            return;
        }

        const user = JSON.parse(data);
        if (username !== user.username) {
            res.json({ status: false, message: 'User Name is invalid' });
        } else if (password !== user.password) {
            res.json({ status: false, message: 'Password is invalid' });
        } else {
            res.json({ status: true, message: 'User Is valid' });
        }
    });
});

/*
4. Creating a Logout Route
- Modify the `/logout` route to accept a `username` as a parameter.
- Return a message in HTML format that displays `<b>{username} successfully logged out.<b>` when a user accesses the `/logout` route.

Answer: The `/logout` route accepts a `username` parameter and returns a success message in HTML format.
*/

router.get('/logout/:username', (req, res) => {
    const { username } = req.params;
    res.send(`<b>${username} successfully logged out.</b>`);
});

/*
5. Add error handling middleware to handle below error
- Return 500 page with message "Server Error"

Answer: An error handling middleware is added to catch server errors and return a 500 error page with the message "Server Error".
*/

app.use((err, req, res, next) => {
    res.status(500).send('Server Error');
});

// Apply routes
app.use('/', router);

// Dynamic port binding
app.listen(process.env.port || 8081, () => {
    console.log('Web Server is listening at port ' + (process.env.port || 8081));
});

/*
6. Explain the Purpose of `express.Router()` in the Code Above.
- Why is `express.Router()` used in Express.js applications, and how does it benefit the code structure?

Answer: `express.Router()` is used to create modular route handlers in Express.js applications.
It allows us to group routes together and then use them as middleware in the main app.
This helps in organizing the code structure by separating route logic into smaller, more manageable sections. It is particularly useful when working with large applications.

7. Error Handling in Express.js
- How would you implement error handling in the Express routes to ensure that any issues (such as file not found or server errors) are appropriately handled? Provide an example.

Answer: Error handling in Express is typically done using middleware functions.
The error handling middleware function takes four parameters: `err`, `req`, `res`, and `next`.
You can use this function to catch errors and return appropriate responses.
For example, the middleware added at the end of the code catches server errors and returns a 500 status with the message "Server Error".

Example:
```javascript
app.use((err, req, res, next) => {
    res.status(500).send('Server Error');
});

8. Dynamic Port Binding in Express.js
Explain how the app.listen(process.env.port || 8081) line works and why it's useful in production environments.

Answer: The line app.listen(process.env.port || 8081) binds the Express server to a specific port.
process.env.port is an environment variable that can be set dynamically (usually by the hosting service or the deployment environment).
If no environment variable is set, the server defaults to port 8081.
This is useful in production environments where the hosting service may specify a port, allowing the server to be flexible in different environments. */

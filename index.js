var connection = require("./connection");
var express = require("express");
var app = express();
var crypto = require('crypto');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the Home HTML file as the main landing page
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/home.html');
});

// Serve the login HTML file
app.get('/login', function(req, res) {
    res.sendFile(__dirname + '/login.html');
});

app.post("/submit_student_login", function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    var sql = "SELECT * FROM students WHERE email = ? AND password_hash = ?";
    connection.query(sql, [email, password], function(error, results) {
        if (error) {
            console.error('Error fetching student:', error);
            res.status(500).json({ success: false, message: "Internal server error" });
            return;
        }
        if (results.length > 0) {
            console.log("Login successful!");
            res.json({ success: true });
        } else {
            console.log("Invalid credentials!");
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});

// Handle teacher login
app.post("/submit_teacher_login", function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    var sql = "SELECT * FROM teachers WHERE email = ? AND password_hash = ?";
    connection.query(sql, [email, password], function(error, results) {
        if (error) {
            console.error('Error fetching teacher:', error);
            res.status(500).json({ success: false, message: "Internal server error" });
            return;
        }
        if (results.length > 0) {
            console.log("Login successful!");
            res.json({ success: true });
        } else {
            console.log("Invalid credentials!");
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});

// Handle manager login
app.post("/submit_manager_login", function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    var sql = "SELECT * FROM admin_managers WHERE email = ? AND password_hash = ?";
    connection.query(sql, [email, password], function(error, results) {
        if (error) {
            console.error('Error fetching manager:', error);
            res.status(500).json({ success: false, message: "Internal server error" });
            return;
        }
        if (results.length > 0) {
            console.log("Login successful!");
            res.json({ success: true });
        } else {
            console.log("Invalid credentials!");
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});

// Serve the registration HTML file
app.get('/registration', function(req, res) {
    res.sendFile(__dirname + '/registration.html');
});

app.post("/submit_student_registration", function(req, res) {
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;

    var sql = "INSERT INTO students (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)";
    var values = [firstName, lastName, email, password];

    connection.query(sql, values, function(error, result) {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(400).send("Error: The email address is already registered.");
            } else {
                console.error('Error inserting data:', error);
                res.status(500).send("Error registering student");
            }
            return;
        }
        res.redirect('/login');
    });
});

app.post("/submit_teacher_registration", function(req, res) {
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;

    var sql = "INSERT INTO teachers (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)";
    var values = [firstName, lastName, email, password];

    connection.query(sql, values, function(error, result) {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(400).send("Error: The email address is already registered.");
            } else {
                console.error('Error inserting data:', error);
                res.status(500).send("Error registering teacher");
            }
            return;
        }
        res.redirect('/login');
    });
});

app.post("/submit_manager_registration", function(req, res) {
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password;

    var sql = "INSERT INTO admin_managers (first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?)";
    var values = [firstName, lastName, email, password];

    connection.query(sql, values, function(error, result) {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(400).send("Error: The email address is already registered.");
            } else {
                console.error('Error inserting data:', error);
                res.status(500).send("Error registering admin manager");
            }
            return;
        }
        res.redirect('/login');
    });
});

// Serve the event HTML file
app.get('/event', function(req, res) {
    res.sendFile(__dirname + '/event.html');
});

// Handle event creation form submission
app.post("/create_event", function(req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var date = req.body.date;
    var venue = req.body.venue;

    var sql = "INSERT INTO events (name, description, event_date, venue) VALUES (?, ?, ?, ?)";
    var values = [name, description, date, venue];

    connection.query(sql, values, function(error, result) {
        if (error) {
            console.error('Error creating event:', error);
            res.status(500).send("Error creating event");
            return;
        }
        console.log("Event created successfully!");
        res.send("Event created successfully!");
    });
});

// Add a new route to fetch events
app.get("/get_events", function(req, res) {
    var sql = "SELECT name, description, event_date, venue FROM events";

    connection.query(sql, function(error, results) {
        if (error) {
            console.error('Error fetching events:', error);
            res.status(500).send("Error fetching events");
            return;
        }
        res.json(results);
    });
});

// Serve the menu HTML file
app.get('/menu', function(req, res) {
    res.sendFile(__dirname + '/menu.html');
});

// Handle menu suggestion form submission
app.post("/submit_menu_suggestion", function(req, res) {
    var menuItem = req.body.menu_item;
    var sql = "INSERT INTO menu_suggestions (menu_item, votes) VALUES (?, 0)";

    connection.query(sql, [menuItem], function(error, result) {
        if (error) {
            console.error('Error adding menu suggestion:', error);
            res.status(500).send("Error adding menu suggestion");
            return;
        }
        console.log("Menu suggestion added successfully!");
        res.redirect('/menu');
    });
});

// Get menu suggestions
app.get("/get_menu_suggestions", function(req, res) {
    var sql = "SELECT suggestion_id, menu_item, votes FROM menu_suggestions";

    connection.query(sql, function(error, results) {
        if (error) {
            console.error('Error fetching menu suggestions:', error);
            res.status(500).send("Error fetching menu suggestions");
            return;
        }
        res.json(results);
    });
});

// Handle voting on menu items
app.post("/vote_menu_item", function(req, res) {
    var suggestionId = req.body.suggestion_id;
    var sql = "UPDATE menu_suggestions SET votes = votes + 1 WHERE suggestion_id = ?";

    connection.query(sql, [suggestionId], function(error, result) {
        if (error) {
            console.error('Error voting on menu item:', error);
            res.status(500).send("Error voting on menu item");
            return;
        }
        console.log("Vote registered successfully!");
        res.json({ message: "Vote registered successfully!" });
    });
});

// Serve the performance HTML file
app.get('/performance', function(req, res) {
    res.sendFile(__dirname + '/performance.html');
});

// Handle performance proposal form submission
app.post("/submit_performance_proposal", function(req, res) {
    var performanceType = req.body.performance_type;
    var duration = req.body.duration;
    var requirements = req.body.requirements;

    var sql = "INSERT INTO performance_proposals (performance_type, duration, requirements, votes) VALUES (?, ?, ?, 0)";

    connection.query(sql, [performanceType, duration, requirements], function(error, result) {
        if (error) {
            console.error('Error adding performance proposal:', error);
            res.status(500).send("Error adding performance proposal");
            return;
        }
        console.log("Performance proposal added successfully!");
        res.redirect('/performance');
    });
});

// Get performance proposals
app.get("/get_performance_proposals", function(req, res) {
    var sql = "SELECT proposal_id, performance_type, duration, requirements, votes FROM performance_proposals";

    connection.query(sql, function(error, results) {
        if (error) {
            console.error('Error fetching performance proposals:', error);
            res.status(500).send("Error fetching performance proposals");
            return;
        }
        res.json(results);
    });
});

// Handle voting on performance proposals
app.post("/vote_performance_proposal", function(req, res) {
    var proposalId = req.body.proposal_id;
    var sql = "UPDATE performance_proposals SET votes = votes + 1 WHERE proposal_id = ?";

    connection.query(sql, [proposalId], function(error, result) {
        if (error) {
            console.error('Error voting on performance proposal:', error);
            res.status(500).send("Error voting on performance proposal");
            return;
        }
        console.log("Vote registered successfully!");
        res.json({ message: "Vote registered successfully!" });
    });
});

// Serve the tasks management HTML file
app.get('/tasksManagement', function(req, res) {
    res.sendFile(__dirname + '/tasksManagement.html');
});

// Handle task submission
app.post("/submit_task", function(req, res) {
    var taskDescription = req.body.task_description;
    var assignedTo = req.body.assigned_to;
    var status = req.body.status;

    var sql = "INSERT INTO tasks (task_description, assigned_to, completion_status) VALUES (?, ?, ?)";

    connection.query(sql, [taskDescription, assignedTo, status], function(error, result) {
        if (error) {
            console.error('Error adding task:', error);
            res.status(500).send("Error adding task");
            return;
        }
        console.log("Task added successfully!");
        res.redirect('/tasksManagement');
    });
});

// Get all tasks
app.get("/get_tasks", function(req, res) {
    var sql = "SELECT task_id, task_description, assigned_to, completion_status FROM tasks";

    connection.query(sql, function(error, results) {
        if (error) {
            console.error('Error fetching tasks:', error);
            res.status(500).send("Error fetching tasks");
            return;
        }
        res.json(results);
    });
});

// Update task status
app.post("/update_task_status", function(req, res) {
    var taskId = req.body.task_id;
    var newStatus = req.body.status;

    var sql = "UPDATE tasks SET completion_status = ? WHERE task_id = ?";

    connection.query(sql, [newStatus, taskId], function(error, result) {
        if (error) {
            console.error('Error updating task status:', error);
            res.status(500).send("Error updating task status");
            return;
        }
        console.log("Task status updated successfully!");
        res.json({ message: "Task status updated successfully!" });
    });
});

// Serve the attendance HTML file
app.get('/attendance', function(req, res) {
    res.sendFile(__dirname + '/attendance.html');
});

// Handle check-in of attendees
app.post("/check_in_attendee", function(req, res) {
    var attendeeId = req.body.attendee_id;
    var attendeeType = req.body.attendee_type;
    var eventDate = req.body.event_date;

    var sql = "INSERT INTO attendance (attendee_id, attendee_type, event_date) VALUES (?, ?, ?)";

    connection.query(sql, [attendeeId, attendeeType, eventDate], function(error, result) {
        if (error) {
            console.error('Error checking in attendee:', error);
            res.status(500).send("Error checking in attendee");
            return;
        }
        console.log("Attendee checked in successfully!");
        res.redirect('/attendance');
    });
});

// Fetch attendance records
app.get("/get_attendance", function(req, res) {
    var sql = "SELECT attendee_id, attendee_type, event_date FROM attendance";

    connection.query(sql, function(error, results) {
        if (error) {
            console.error('Error fetching attendance records:', error);
            res.status(500).send("Error fetching attendance records");
            return;
        }
        res.json(results);
    });
});

app.get('/budgetManagement', function(req, res) {
    res.sendFile(__dirname + '/budgetManagement.html');
});

app.post('/record_expense', function(req, res) {
    const { expense_description, amount, expense_date, event_id } = req.body;

    if (!expense_description || !amount || !expense_date || !event_id) {
        res.status(400).send('All fields are required.');
        return;
    }

    const parsedAmount = parseFloat(amount);
    const parsedEventId = parseInt(event_id, 10);

    if (isNaN(parsedAmount) || isNaN(parsedEventId)) {
        res.status(400).send('Invalid amount or event ID.');
        return;
    }

    const sql = "INSERT INTO budget_tracking (expense_description, expense_amount, expense_date, event_id) VALUES (?, ?, ?, ?)";
    connection.query(sql, [expense_description, parsedAmount, expense_date, parsedEventId], function(error) {
        if (error) {
            console.error('Error recording expense:', error);
            res.status(500).send('Error recording expense');
            return;
        }
        console.log('Expense recorded successfully!');
        res.send('Expense recorded successfully!');
    });
});

app.get('/get_events', function(req, res) {
    const sql = 'SELECT event_id, name FROM events';
    connection.query(sql, function(error, results) {
        if (error) {
            console.error('Error fetching events:', error);
            res.status(500).send('Error fetching events');
            return;
        }
        res.json(results);
    });
});

app.get('/get_expenses', function(req, res) {
    const sql = `
        SELECT bt.expense_description, bt.expense_amount, bt.expense_date, bt.event_id
        FROM budget_tracking bt
        LEFT JOIN events e ON bt.event_id = e.event_id
    `;
    connection.query(sql, function(error, results) {
        if (error) {
            console.error('Error fetching expenses:', error);
            res.status(500).send('Error fetching expenses');
            return;
        }
        res.json(results);
    });
});

// Serve the reports HTML file
app.get('/reports', function(req, res) {
    res.sendFile(__dirname + '/reports.html');
});

// Handle fetching budget report
app.get("/get_budget_report", function(req, res) {
    var sql = "SELECT * FROM budget_tracking";

    connection.query(sql, function(error, results) {
        if (error) {
            console.error('Error fetching budget report:', error);
            res.status(500).send("Error fetching budget report");
            return;
        }
        res.json(results);
    });
});

// Handle fetching attendance report
app.get("/get_attendance_report", function(req, res) {
    var sql = "SELECT * FROM attendance";

    connection.query(sql, function(error, results) {
        if (error) {
            console.error('Error fetching attendance report:', error);
            res.status(500).send("Error fetching attendance report");
            return;
        }
        res.json(results);
    });
});

// Handle fetching tasks report
app.get("/get_tasks_report", function(req, res) {
    var sql = "SELECT * FROM tasks";

    connection.query(sql, function(error, results) {
        if (error) {
            console.error('Error fetching tasks report:', error);
            res.status(500).send("Error fetching tasks report");
            return;
        }
        res.json(results);
    });
});

// Handle fetching events
app.get('/get_events', function(req, res) {
    const sql = "SELECT event_id, name FROM events";
    connection.query(sql, function(error, results) {
        if (error) {
            console.error('Error fetching events:', error);
            res.status(500).send("Error fetching events");
            return;
        }
        res.json(results);
    });
});

// Serve the announcements HTML file
app.get('/adminAnnouncements', function(req, res) {
    res.sendFile(__dirname + '/adminAnnouncements.html');
});

// Handle announcement creation
app.post("/create_announcement", function(req, res) {
    const { title, description, departments } = req.body;
    const sql = "INSERT INTO announcements (title, description, departments) VALUES (?, ?, ?)";

    connection.query(sql, [title, description, departments], function(error) {
        if (error) {
            console.error('Error creating announcement:', error);
            res.status(500).send("Error creating announcement");
            return;
        }
        console.log("Announcement created successfully!");
        res.end(); // End the response without redirecting
    });
});

// Fetch all announcements
app.get("/get_announcements", function(req, res) {
    const sql = "SELECT title, description, departments FROM announcements";
    connection.query(sql, function(error, results) {
        if (error) {
            console.error('Error fetching announcements:', error);
            res.status(500).send("Error fetching announcements");
            return;
        }
        res.json(results); // Send announcements as JSON
    });
});

// Serve the userAnnouncements HTML file
app.get('/userAnnouncements', function(req, res) {
    res.sendFile(__dirname + '/userAnnouncements.html');
});

// Get announcements data
app.get('/get_announcements', function(req, res) {
    var sql = "SELECT * FROM announcements";
    connection.query(sql, function(error, results) {
        if (error) {
            console.error('Error fetching announcements:', error);
            res.status(500).json({ success: false });
            return;
        }
        res.json(results);
    });
});

app.listen(8000, function() {
    console.log("Server is running on port 8000");
});

document.addEventListener('DOMContentLoaded', function() {
    const taskList = document.getElementById('task-list');
    const addTaskButton = document.getElementById('add-important-task');
    const dateDisplay = document.getElementById('current-date');

    // Function to create a new task element
    function createTaskElement(taskData = {}) {
        const taskContainer = document.createElement('div');
        taskContainer.className = 'task-container';
        
        // Create a container for the checkbox and text
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';

        // Create checkbox
        const taskCheckbox = document.createElement('input');
        taskCheckbox.type = 'checkbox';
        taskCheckbox.disabled = !taskData.description; // Disable checkbox if no description
        taskCheckbox.checked = taskData.checked || false; // Set checked state if available

        // Create task input field
        const taskInput = document.createElement('input');
        taskInput.type = 'text';
        taskInput.placeholder = 'Enter task description';
        taskInput.value = taskData.description || ''; // Set value if available

        // Append checkbox and text input to task content container
        taskContent.appendChild(taskCheckbox);
        taskContent.appendChild(taskInput);

        // Create time input field
        const timeInput = document.createElement('input');
        timeInput.type = 'datetime-local';
        timeInput.value = taskData.time || ''; // Set value if available
        
        // Create delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';

        // Add elements to container
        taskContainer.appendChild(taskContent);
        taskContainer.appendChild(timeInput);
        taskContainer.appendChild(deleteButton);
        
        // Add event listener for the checkbox
        taskCheckbox.addEventListener('change', function() {
            if (taskCheckbox.checked) {
                taskInput.style.textDecoration = 'line-through';
                taskInput.disabled = true;
            } else {
                taskInput.style.textDecoration = 'none';
                taskInput.disabled = false;
            }
            saveTasks(); // Save tasks whenever a task is checked or unchecked
        });

        // Add event listener for the delete button
        deleteButton.addEventListener('click', function() {
            taskContainer.remove();
            saveTasks(); // Save tasks whenever a task is deleted
            setupReminders(); // Recheck reminders after task deletion
        });

        // Update task data on input change
        taskInput.addEventListener('input', function() {
            // Enable or disable checkbox based on input value
            if (taskInput.value.trim() === '') {
                taskCheckbox.disabled = true;
                taskCheckbox.checked = false;
                taskInput.style.textDecoration = 'none';
                taskInput.disabled = false;
            } else {
                taskCheckbox.disabled = false;
            }
            saveTasks(); // Save tasks whenever task input changes
            setupReminders(); // Recheck reminders on task input change
        });

        timeInput.addEventListener('input', function() {
            saveTasks(); // Save tasks whenever time input changes
            setupReminders(); // Recheck reminders when time input changes
        });

        return taskContainer;
    }

    // Add new task when the button is clicked
    addTaskButton.addEventListener('click', function() {
        const taskContainers = document.querySelectorAll('.task-container');
        const lastTask = taskContainers[taskContainers.length - 1];
        const lastTaskInput = lastTask ? lastTask.querySelector('input[type="text"]') : null;

        if (lastTaskInput && lastTaskInput.value.trim() === '') {
            alert('Please fill the previous task before adding a new one.');
            return;
        }

        const newTask = createTaskElement();
        taskList.appendChild(newTask);
        saveTasks(); // Save tasks whenever a new task is added
        setupReminders(); // Recheck reminders when a new task is added
    });

    // Function to set up reminders
    function setupReminders() {
        // Clear any existing reminders
        clearTimeouts();

        const tasks = document.querySelectorAll('.task-container');
        tasks.forEach(task => {
            const timeInput = task.querySelector('input[type="datetime-local"]');
            const taskInput = task.querySelector('input[type="text"]');
            
            if (timeInput && timeInput.value) {
                const reminderTime = new Date(timeInput.value);
                const currentTime = new Date();
                const reminderDelay = reminderTime - currentTime - 15 * 60 * 1000; // 15 minutes before the appointment

                if (reminderDelay > 0) {
                    setTimeout(() => {
                        if (Notification.permission === 'granted') {
                            new Notification('Reminder', {
                                body: `You have an upcoming appointment: ${taskInput.value}`,
                            });
                        } else {
                            console.log('Notification permission not granted.');
                        }
                    }, reminderDelay);
                }
            }
        });
    }

    // Clear existing timeouts
    let timeouts = [];
    function clearTimeouts() {
        timeouts.forEach(timeout => clearTimeout(timeout));
        timeouts = [];
    }

    // Function to save tasks to localStorage
    function saveTasks() {
        const tasks = document.querySelectorAll('.task-container');
        const taskArray = Array.from(tasks).map(task => {
            const taskInput = task.querySelector('input[type="text"]').value;
            const timeInput = task.querySelector('input[type="datetime-local"]').value;
            const taskCheckbox = task.querySelector('input[type="checkbox"]').checked;
            return {
                description: taskInput,
                time: timeInput,
                checked: taskCheckbox
            };
        });
        localStorage.setItem('tasks', JSON.stringify(taskArray));
    }

    // Function to load tasks from localStorage
    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(taskData => {
                const newTask = createTaskElement(taskData);
                taskList.appendChild(newTask);
            });
            setupReminders(); // Setup reminders for loaded tasks
        }
    }

    // Request notification permission
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    // Load tasks from localStorage
    loadTasks();

    // Display today's date
    const today = new Date().toLocaleDateString();
    dateDisplay.textContent = `Today’s Date: ${today}`;
});

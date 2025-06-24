const taskInput = document.getElementById('taskInput');
const dueDateInput = document.getElementById('dueDateInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const sortTasksBtn = document.getElementById('sortTasksBtn');
const searchInput = document.getElementById('searchInput');
const taskList = document.getElementById('taskList');
const categorySelect = document.getElementById('categorySelect');


let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filteredTasks = tasks) {
    taskList.innerHTML = '';
    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = ` <span class="task-name ${task.completed ? 'complete' : ''}">${task.name}</span>
          <span class="due-date">${task.dueDate}</span>
          <span class="categoryy">${task.category}</span>
          <button  class="editbtn"><i class="fa-solid fa-pen-to-square fa-xl"></i></button>
          <button class="deletebtn"><i class="fa-solid fa-delete-left fa-xl"></i></button>
          <button class="completebtn">${task.completed ? 'Mark as Incomplete <i class="fa-solid fa-circle-xmark fa-xl"></i>' : ' Mark as Completed <i class="fa-solid fa-square-check fa-xl"></i>'}</button>`;

        if (task.completed) {
            li.classList.add('complete');
        }
        const editBtn = li.querySelector('.editbtn');
        const deleteBtn = li.querySelector('.deletebtn');
        const completeBtn = li.querySelector('.completebtn');
        editBtn.addEventListener('click', () => editTask(index));
        deleteBtn.addEventListener('click', () => deleteTask(index));
        completeBtn.addEventListener('click', () => toggleComplete(index));
        taskList.appendChild(li);
    });
}

function addTask() {
    const taskName = taskInput.value.trim();
    const dueDate = dueDateInput.value;
    const category = categorySelect.value;

    if (taskName === '' || dueDate === '') return;

    tasks.push({ name: taskName, dueDate: dueDate, category: category, completed: false });
    saveTasks();

    const li = document.createElement('li');
    li.classList.add('pop');
    li.innerHTML = `...`;

    taskList.appendChild(li);
    li.addEventListener('animationend', () => {
        li.classList.remove('pop');
        renderTasks();
    });

    taskInput.value = '';
    dueDateInput.value = '';
}

function editTask(index) {
    const newTaskName = prompt('Edit task:', tasks[index].name);
    if (newTaskName !== null) {
        tasks[index].name = newTaskName;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(index) {
    const liToDelete = taskList.children[index];
    liToDelete.classList.add('scale-down');
    liToDelete.addEventListener('animationend', () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    });
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function searchTasks() {
    const searchText = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.name.toLowerCase().includes(searchText));
    renderTasks(filteredTasks);
}

function sortTasksByDueDate() {
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    saveTasks();
    renderTasks();
}

addTaskBtn.addEventListener('click', addTask);
searchInput.addEventListener('input', searchTasks);
sortTasksBtn.addEventListener('click', sortTasksByDueDate);

renderTasks();

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('time').textContent = timeString;
}

updateTime();
setInterval(updateTime, 1000);
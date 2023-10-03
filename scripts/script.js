document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const saveTaskBtn = document.getElementById('save-task-btn');
    const removeAllBtn = document.getElementById('remove-all-btn');
    const removeCompletedBtn = document.getElementById('remove-completed-btn');

    let tasks = [];

    function createTaskElement(task, index) {
        const li = document.createElement('li');
        if (task.completed) {
            li.classList.add('completed');
        }
        li.innerHTML = `
            <span class="checkbox" data-index="${index}">${task.completed ? '✅' : '❌'}</span>
            <span class="task-text" data-index="${index}">${task.text}</span>
            <button class="remove-btn" style="margin-top: 5px" data-index="${index}">Remove</button>
        `;
        return li;
    }

    function renderTasks() {
        taskList.innerHTML = '';
       tasks.sort((a, b) => b.date - a.date);
        tasks.forEach((task, index) => {
            taskList.appendChild(createTaskElement(task, index));
        });
    }

    function addOrUpdateTask(e, editIndex = null) {
        if ((e.keyCode && e.keyCode !== 13 && e.keyCode !== 27) || !taskInput.value.trim()) return;

        // The key code: Enter - 13, ESC is 27

        if (e.keyCode === 27) {
            taskInput.value = '';
       saveTaskBtn.onclick = addOrUpdateTask;
            return;
        }

        if (editIndex !== null) {
            tasks[editIndex] = {
                text: taskInput.value.trim(),
                date: new Date(),
                completed: tasks[editIndex].completed
            };
        } else {
            tasks.unshift({
                text: taskInput.value.trim(),
                date: new Date(),
                completed: false
            });
        }
        taskInput.value = '';
       saveTaskBtn.onclick = addOrUpdateTask;
        renderTasks();
    }

    taskList.addEventListener('click', function(e) {
        const index = e.target.dataset.index;
        if (e.target.classList.contains('checkbox') || e.target.classList.contains('task-text')) {
            tasks[index].completed = !tasks[index].completed;
            renderTasks();
        } else if (e.target.classList.contains('remove-btn')) {
            tasks.splice(index, 1);
            renderTasks();
        }
    });

    taskList.addEventListener('dblclick', function(e) {
        if (e.target.classList.contains('task-text')) {
            const index = e.target.dataset.index;
            taskInput.value = tasks[index].text;
            taskInput.focus();
            saveTaskBtn.onclick = (e) => addOrUpdateTask(e, index);
        }
    });

    saveTaskBtn.addEventListener('click', addOrUpdateTask);
    taskInput.addEventListener('keydown', addOrUpdateTask);

    removeAllBtn.addEventListener('click', function() {
        if (!tasks.some(task => !task.completed) || confirm('Are you sure?')) {
            tasks = [];
            renderTasks();
        }
    });

    removeCompletedBtn.addEventListener('click', function() {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
    });

    renderTasks();
});

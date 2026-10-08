let tasksData = {};

// COLUMNS

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const columns = [todo, progress, done];

// DRAG ELEMENT


let dragElement = null;


// MODAL ELEMENTS


const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

const taskTitleInput = document.querySelector("#task-title-input");
const taskDescInput = document.querySelector("#task-desc-input");


// UPDATE COUNTS + SAVE DATA


function updateTasksData() {

    tasksData = {};

    columns.forEach(col => {

        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector(".right");

        tasksData[col.id] = Array.from(tasks).map(task => {

            return {
                title: task.querySelector("h2").innerText,
                desc: task.querySelector("p").innerText
            };

        });

        count.innerText = tasks.length;
    });


    localStorage.setItem("tasks", JSON.stringify(tasksData));

    console.log("Tasks Data:", tasksData);
}


function loadTasks() {

    const savedTasks = localStorage.getItem("tasks");

    // Agar localStorage mein kuch saved nahi hai
    if (!savedTasks) {
        return;
    }

    const data = JSON.parse(savedTasks);

    for (const colId in data) {

        const column = document.querySelector(`#${colId}`);

        data[colId].forEach(taskData => {

            const div = document.createElement("div");

            div.classList.add("task");
            div.setAttribute("draggable", "true");

            div.innerHTML = `
                <h2>${taskData.title}</h2>
                <p>${taskData.desc}</p>
                <button>Delete</button>
            `;

            column.appendChild(div);

        // Is naye loaded task ko bhi drag/delete functionality do
            addDragEventOnTask(div);
        });
    }
}

// DRAG EVENTS ON TASK


function addDragEventOnTask(task) {

    task.addEventListener("dragstart", () => {

        dragElement = task;

        console.log("Dragging:", dragElement);
    });


    task.addEventListener("dragend", () => {

        dragElement = null;
    });


    // DELETE BUTTON

    const deleteButton = task.querySelector("button");

    deleteButton.addEventListener("click", () => {

        task.remove();

        updateTasksData();
    });
}

// EXISTING TASKS

const tasks = document.querySelectorAll(".task");

tasks.forEach(task => {

    addDragEventOnTask(task);

});

// COLUMN DRAG EVENTS


function addDragEventsOnColumn(column) {

    // DRAG ENTER

    column.addEventListener("dragenter", (e) => {

        e.preventDefault();

        column.classList.add("hover-over");
    });


    // DRAG OVER

    column.addEventListener("dragover", (e) => {

        e.preventDefault();
    });


    // DRAG LEAVE

    column.addEventListener("dragleave", () => {

        column.classList.remove("hover-over");
    });


    // DROP

    column.addEventListener("drop", (e) => {

        e.preventDefault();

        if (dragElement === null) {
            return;
        }

        console.log("Dropped:", dragElement, column);

        column.appendChild(dragElement);

        column.classList.remove("hover-over");

        updateTasksData();
    });
}


// Apply drag events to all columns

columns.forEach(column => {

    addDragEventsOnColumn(column);

});

// OPEN / CLOSE MODAL

toggleModalButton.addEventListener("click", () => {

    modal.classList.add("active");
});


modalBg.addEventListener("click", () => {

    modal.classList.remove("active");
});

// ADD NEW TASK

addTaskButton.addEventListener("click", () => {

    const taskTitle = taskTitleInput.value.trim();
    const taskDesc = taskDescInput.value.trim();


    // Don't create empty task

    if (taskTitle === "" || taskDesc === "") {

        alert("Please enter task title and description");

        return;
    }


    // Create new div

    const div = document.createElement("div");

    div.classList.add("task");

    div.setAttribute("draggable", "true");


    // Add HTML inside task

    div.innerHTML = `
        <h2>${taskTitle}</h2>
        <p>${taskDesc}</p>
        <button>Delete</button>
    `;


    // Add task to TODO

    todo.appendChild(div);


    // IMPORTANT:
    // New task ko drag + delete functionality dena

    addDragEventOnTask(div);


    // Update counts + localStorage

    updateTasksData();


    // Clear inputs

    taskTitleInput.value = "";
    taskDescInput.value = "";


    // Close modal

    modal.classList.remove("active");
});

// INITIAL COUNT

// updateTasksData();

loadTasks();
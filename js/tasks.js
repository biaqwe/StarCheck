const taskInput=document.getElementById('taskInput');
const submitTaskBtn=document.getElementById('submitTaskBtn');
const addTaskBtn=document.getElementById('addTaskBtn');
const taskList=document.getElementById('taskList');
const completedBtn=document.getElementById('completedBtn');
const inProgressBtn=document.getElementById('inProgressBtn');
const allTasksBtn=document.getElementById('allTasksBtn');
const taskInputContainer=document.querySelector('.taskInput');
const logoutBtn=document.getElementById('logoutBtn');

let tasks=[];
let edit=-1;

//toggle the visibility of the input field for new tasks
addTaskBtn.addEventListener('click', ()=>{
    if(taskInputContainer.style.display==='block'){
        taskInputContainer.style.display='none';
        addTaskBtn.innerHTML='<i class="fas fa-plus"></i>';
        taskInput.value='';
    }
    else{
        taskInputContainer.style.display='block';
        addTaskBtn.innerHTML='<i class="fas fa-times"></i>';
    }
    edit=-1;
});

//if edit=-1 (new task being added) calls addTask() function, otherwise calls updateTask() to modify the content of an existing task
submitTaskBtn.addEventListener('click', ()=>{
    if(edit===-1){
        addTask();
    }
    else{
        updateTask();
    }
});

completedBtn.addEventListener('click', ()=>{
    displayTasks(true);
});

inProgressBtn.addEventListener('click', ()=>{
    displayTasks(false);
});

allTasksBtn.addEventListener('click', ()=>{
    displayTasks();
});

//fetches a user's tasks and calls displayTask() function
function fetchTasks(){
    fetch('../php/fetchTasks.php')
    .then(response=>response.json())
    .then(data=>{
        tasks=data;
        displayTasks();
    })
    .catch(error=>console.error('error fetching tasks:', error));
}

//updates the page to display the user's name
function fetchName(){
    fetch('../php/fetchName.php')
        .then(response=>response.json())
        .then(data=>{
            if(data.success){
                const name=data.user.name;
                const title=document.getElementById('userTitle');
                title.textContent=`${name}'s to-do list `;
                const star=document.createElement('img');
                star.id='star';
                star.src='../images/star.png';
                title.appendChild(star);
            }
            else{
                console.error('error fetching name:', data.error);
            }
        })
        .catch(error=>console.error('error fetching name:', error));
}

function addTask(){
    //adds a new task
    const taskText=taskInput.value.trim();
    if(taskText){
        fetch('../php/addTask.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({task_text: taskText})
        })
        .then(response=>response.json())
        .then(data=>{
            if(data.success){
                const newTask={
                    id: data.task.id,
                    task_text: data.task.task_text,
                    completed: data.task.completed
                };
                //updates the tasks array with the new task
                tasks.unshift(newTask);
                //creates a card element to display in the task list
                const newCard=createCard(newTask, 0);
                taskList.prepend(newCard);
                //clears input field
                taskInput.value='';
                //hides the task input field
                taskInputContainer.style.display='none';
                addTaskBtn.innerHTML='<i class="fas fa-plus"></i>';
            }
            else{
                alert(data.error || 'error adding task');
            }
        })
        .catch(error=>console.error('error adding task:', error));
    }
}

//creates a card for the task, adds buttons for completion, editing and deleting
function createCard(task, index){
    const taskCard=document.createElement('div');
    taskCard.className=`card ${task.completed ? 'completedCard' : ''}`;
    taskCard.innerHTML=
    `
        <div class="taskBtns">
            <button class="completeBtn" onclick="completeTask(${index})">
                <i class="fa-solid fa-star"></i>
            </button>
        </div>
        <div class="taskContent">
            <span class="${task.completed ? 'completed' : ''}">${task.task_text}</span>
        </div>
        <div class="taskActions">
            <button class="editBtn" onclick="editTask(${index})"><i class="fas fa-edit"></i></button>
            <button class="deleteBtn" onclick="deleteTask(${index})"><i class="fas fa-trash"></i></button>
        </div>
    `;
    return taskCard;
}

//if showCompleted==null displays all tasks, if true displays completed tasks, if false displays tasks in progress
function displayTasks(showCompleted=null){
    taskList.innerHTML='';
    tasks.forEach((task, index)=>{
        if(showCompleted===null || task.completed==showCompleted){
            const taskCard=createCard(task, index);
            taskList.appendChild(taskCard);
        }
    });
}

//flips current completed value, refreshes the displayed tasks
function completeTask(index){
    const task=tasks[index];
    const status=!task.completed;
    tasks[index].completed=status;
    fetch('../php/completeTask.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({task_id: task.id, completed: status})
    })
    .then(response=>response.json())
    .then(data=>{
        if(data.success){
            displayTasks();
        }
        else{
            alert(data.error || 'error updating status');
        }
    })
    .catch(error=>console.error('error completing task:', error));
}

//deletes the task at the specified index, refreshes the displayed tasks
function deleteTask(index){
    const taskText=tasks[index].task_text;
    fetch('../php/deleteTask.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task_text: taskText })
    })
    .then(response=>response.json())
    .then(data=>{
        console.log(data);
        if(data.success){
            tasks.splice(index, 1);
            displayTasks();
        }
        else{
            alert(data.error || 'error deleting task');
        }
    })
    .catch(error=>console.error('error deleting task:', error));
}

function editTask(index){
    edit=index;
    //adds the text of the task to be edited to the input field
    taskInput.value=tasks[index].task_text;
    //displays the input field for editing a task
    taskInputContainer.style.display='block';
    //changes submit button text to edit
    submitTaskBtn.textContent='edit';
}

//updates the text of the task after editing
function updateTask(){
    const taskText=taskInput.value.trim();
    if(taskText){
        const task=tasks[edit];
        fetch('../php/editTask.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({oldTask: task.task_text, newTask: taskText})
        })
        .then(response=>response.json())
        .then(data=>{
            if(data.success){
                tasks[edit].task_text=taskText;
                //clears input field
                taskInput.value='';
                //hides the task input field
                taskInputContainer.style.display='none';
                //resets the edit
                edit=-1;
                //changes the submit button text back to submit
                submitTaskBtn.textContent='submit'; 
                //refreshes the displayed tasks
                displayTasks();
            }
            else{
                alert(data.error || 'error updating task');
            }
        })
        .catch(error=>console.error('error updating task:', error));
    }
}

logoutBtn.addEventListener('click', ()=>{
    window.location.href='login.html';
});

document.addEventListener('DOMContentLoaded', ()=>{
    //save theme preference in local storage to keep after page refresh and across pages
    const body=document.body;
    const theme=document.getElementById('theme');
    const themeIcon=theme.querySelector("i");
    const storedTheme=localStorage.getItem('theme');

    if(storedTheme==='dark'){
        body.classList.add('dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
    else{
        body.classList.remove('dark');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }

    fetchTasks();
    fetchName();

    //dark mode toggle
    theme.addEventListener('click', function(){
        body.classList.toggle('dark');
        if(body.classList.contains('dark')){
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        }
        else{
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
});


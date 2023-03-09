const form = document.querySelector('#form');
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('#tasksList');
const emptyList = document.querySelector('#emptyList');

let tasks = [];
if (localStorage.getItem('tasks')) {
	tasks = JSON.parse(localStorage.getItem('tasks'));
	tasks.forEach(task => renderTask(task));
}

checkEmptyList();

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

function addTask(e) {
	e.preventDefault();

	const taskText = taskInput.value;
	const newTask = {
		id: Date.now(),
		text: taskText,
		done: false
	};
	tasks.push(newTask);
	renderTask(newTask)
	taskInput.value = '';
	taskInput.focus();
	checkEmptyList();
	saveToLocalStorage();
};
function deleteTask(e) {
	if (e.target.dataset.action !== 'delete') return

	const parenNode = e.target.closest('li');
	const id = Number(parenNode.id);
	const index = tasks.findIndex(task => task.id === id);
	tasks.splice(index, 1);
	// tasks = tasks.filter(item => item.id === id ? false : true);
	parenNode.remove();
	checkEmptyList();
	saveToLocalStorage();
};
function doneTask(e) {
	if (e.target.dataset.action !== 'done') return;

	const parenNode = e.target.closest('li');
	const id = Number(parenNode.id);
	const task = tasks.find(task => task.id === id);
	task.done = !task.done;

	const taskTitle = parenNode.querySelector('.task-title');
	taskTitle.classList.toggle('task-title--done');
	saveToLocalStorage();
}
function checkEmptyList() {
	if (tasks.length === 0) {
		const emptyListEHTML = `
			<li id="emptyList" class="list-group-item empty-list">
				<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
				<div class="empty-list__title">List is empty</div>
			</li>`;
		tasksList.insertAdjacentHTML('afterbegin', emptyListEHTML);
	};

	if (tasks.length > 0) {
		const emptyListEl = document.querySelector('#emptyList');
		emptyListEl ? emptyListEl.remove() : null;
	}
};
function saveToLocalStorage() {
	localStorage.setItem('tasks', JSON.stringify(tasks))
};
function renderTask(task) {
	const cssClass = task.done ? 'task-title task-title--done' : 'task-title';
	const taskHtml = `
	<li id = "${task.id}" class="list-group-item d-flex justify-content-between task-item">
		<span class="${cssClass}">${task.text}</span>
		<div class="task-item__buttons">
			<button type="button" data-action="done" class="btn-action">
				<img src="./img/tick.svg" alt="Done" width="18" height="18">
			</button>
			<button type="button" data-action="delete" class="btn-action">
				<img src="./img/cross.svg" alt="Done" width="18" height="18">
			</button>
		</div>
	</li>`;

	tasksList.insertAdjacentHTML('beforeend', taskHtml);
}

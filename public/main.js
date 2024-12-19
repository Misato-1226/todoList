const saveTask = (tasks) => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const getTask = () => {
  const tasks = localStorage.getItem("tasks");
  console.log(tasks);
  return tasks ? JSON.parse(tasks) : [];
};

let tasks = getTask();

const newTask = document.getElementsByClassName("new_task")[0];
const submitButton = document.getElementsByClassName("submit")[0];
const taskList = document.getElementsByClassName("task_list")[0];

submitButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  const taskValue = newTask.value;
  tasks.push(taskValue);
  saveTask(tasks); //ローカルストレージにタスクを保存する関数
  const taskIndex = tasks.length - 1; //タスクを削除するときに、インデックスを特定させるため。
  addTask(taskValue, taskIndex); //リストにタスクを追加する関数
  console.log(tasks);

  newTask.value = "";
});

const addTask = (task, taskIndex) => {
  const taskItem = document.createElement("li");
  taskItem.classList.add("mt-3");

  //liタグの子要素となるspanタグ。
  const taskContent = document.createElement("span");
  taskContent.innerHTML = task;
  taskItem.appendChild(taskContent);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add(
    "bg-stone-500",
    "text-white",
    "text-sm",
    "rounded-md",
    "hover:bg-stone-400",
    "px-3",
    "py-1",
    "ml-3",
    "cursor-pointer"
  );
  deleteButton.innerHTML = "削除する";
  taskItem.appendChild(deleteButton);

  const editButton = document.createElement("button");
  editButton.classList.add(
    "bg-stone-500",
    "text-white",
    "text-sm",
    "rounded-md",
    "hover:bg-stone-400",
    "px-3",
    "py-1",
    "ml-1",
    "cursor-pointer"
  );
  editButton.innerHTML = "編集する";
  taskItem.appendChild(editButton);

  deleteButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    //削除するボタンが押されたときに、インデックス番号を確認する。

    const currentTaskIndex = Array.from(taskList.children).indexOf(taskItem);
    if (currentTaskIndex !== -1) {
      tasks.splice(currentTaskIndex, 1); // 正しいインデックスを使って削除
      saveTask(tasks); //ローカルストレージに変更を再保存。
      console.log("インデックス番号", currentTaskIndex);
      deleteTask(taskItem);
    }
  });

  editButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    editTask(taskItem, taskContent, taskIndex);
  });

  //liタグをulの子要素にする。
  taskList.appendChild(taskItem);
};

//ローカルストレージに保存されているタスクを表示させる。
let index = 0;
tasks.forEach((task) => {
  addTask(task, index);
  index++;
});

const deleteTask = (task) => {
  taskList.removeChild(task);
};

const editTask = (taskItem, taskContent, taskIndex) => {
  const disableButton = taskItem.children[2];
  disableButton.disabled = true;
  const currentValue = taskContent.innerText;
  const editDiv = document.createElement("div");
  editDiv.classList.add("mt-3");
  const newTaskInput = document.createElement("input");
  newTaskInput.type = "text";
  newTaskInput.value = currentValue;

  const saveButton = document.createElement("button");
  saveButton.classList.add("underline", "ml-3", "cursor-pointer");
  saveButton.innerHTML = "保存";

  const cancelButton = document.createElement("button");
  cancelButton.classList.add("underline", "ml-3", "cursor-pointer");
  cancelButton.innerHTML = "キャンセル";

  taskContent.value = "";
  editDiv.appendChild(newTaskInput);
  editDiv.appendChild(saveButton);
  editDiv.appendChild(cancelButton);
  taskItem.appendChild(editDiv);

  saveButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    const updatedTask = newTaskInput.value.trim();
    if (updatedTask) {
      taskContent.innerHTML = updatedTask;
      taskItem.removeChild(editDiv);
      tasks[taskIndex] = updatedTask;
      saveTask(tasks);
      disableButton.disabled = false;
    }
  });

  cancelButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    //編集を隠す
    taskItem.removeChild(editDiv);

    disableButton.disabled = false;
  });
};

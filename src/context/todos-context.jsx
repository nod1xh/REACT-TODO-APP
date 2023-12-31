import { createContext, useState } from "react";
import { date } from "../utils/date";
import { v4 as uuidv4 } from "uuid";
import Button from "../components/Button";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

export const TodoContext = createContext({
  todos: [],
  modalOpen: false,
  isEditing: false,
  taskName: "",
  editedTask: "",
  addTodo: () => {},
  removeTodo: () => {},
  editTask: () => {},
  modalIsEditing: () => {},
  removeAllTodos: () => {},
  openModal: () => {},
  closeModal: () => {},
  dateChange: () => {},
  setTodos: () => {},
  setTodoId: () => {},
  setTaskName: () => {},
  setEditedTask: () => {},
  modalIsFiltering: () => {},
  moveToCompleted: () => {},
});

export default function TodoContextProvider({ children }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [todoId, setTodoId] = useState(uuidv4());
  const [isEditing, setIsEditing] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [editedTask, setEditedTask] = useState("");
  const [completedTodos, setCompletedTodos] = useState([]);

  const styles = "border-1 rounded-md bg-slate-100 px-3 py-1 m-1 end-0";

  const moveToCompleted = (todoId) => {
    setTodos((prevTodos) => {
      const updatedTodos = prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, completed: true } : todo
      );

      const completedTask = updatedTodos.find(
        (todo) => todo.id === todoId && todo.completed
      );

      if (completedTask) {
        setCompletedTodos((prevCompletedTodos) => {
          // Check if the task is already in completedTodos array
          const isTaskInCompleted = prevCompletedTodos.some(
            (todo) => todo.id === completedTask.id
          );

          // Add the task only if it's not already in completedTodos (If variable isTaskInCompleted is false)
          return isTaskInCompleted
            ? prevCompletedTodos
            : [...prevCompletedTodos, completedTask];
        });
      }

      return updatedTodos.filter((todo) => !todo.completed);
    });
  };

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setIsEditing(false);
  }

  const newTodo = {
    id: todoId,
    name: taskName,
    timestamp: date(),
    completed: false,
    action: (
      <>
        <Button onClick={removeTodo} className={styles}>
          <MdDelete />
        </Button>
        {completedTodos > 0 ? null : (
          <Button onClick={modalIsEditing} className={styles}>
            <FaEdit />
          </Button>
        )}
      </>
    ),
  };

  function addTodo() {
    setTodos([...todos, newTodo]);
    console.log(todos);
    closeModal();
  }

  function removeTodo() {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
    setCompletedTodos((prevTodos) =>
      prevTodos.filter((todo) => todo.id !== todoId)
    );
    console.log(todos);
  }

  function modalIsEditing() {
    setIsEditing(true);
    setModalOpen(true);
    setTodoId(newTodo.id);
    setEditedTask(newTodo.name);
  }

  function editTask(todoId, editedTask) {
    console.log("Editing todo with id:", todoId);
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === todoId ? { ...todo, name: editedTask } : todo
      )
    );
    setIsEditing(false);
    setModalOpen(false);
  }

  function removeAllTodos() {
    setTodos([]);
  }

  const ctxValue = {
    todos,
    modalOpen,
    isEditing,
    taskName,
    editedTask,
    completedTodos,
    todoId,
    addTodo,
    removeTodo,
    editTask,
    modalIsEditing,
    removeAllTodos,
    openModal,
    closeModal,
    setTodos,
    setTaskName,
    setEditedTask,
    moveToCompleted,
    setTodoId,
  };

  return (
    <TodoContext.Provider value={ctxValue}>{children}</TodoContext.Provider>
  );
}

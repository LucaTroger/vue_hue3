import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { userStore } from './userStore';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([]);
  const filterStatus = ref('all');
  const filterUser = ref('all');

  const users = userStore();

  async function fetchTodos() {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
    const data = await response.json();

    const blub = JSON.parse(localStorage.getItem('todoStatus') || '{}');
    todos.value = data.map((todo: Todo) => ({
      ...todo,
      completed: blub[todo.id] ?? todo.completed
    }));
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find(t => t.id === id);
    if (!todo) return;
    todo.completed = !todo.completed;

    const local = JSON.parse(localStorage.getItem('todoStatus') || '{}');
    local[id] = todo.completed;
    localStorage.setItem('todoStatus', JSON.stringify(local));
  }

  const filteredTodos = computed(() =>
    todos.value.filter(todo => {
      const matchesStatus =
        filterStatus.value === 'all' ||
        (filterStatus.value === 'done' && todo.completed) ||
        (filterStatus.value === 'open' && !todo.completed);

      const matchesUser =
        filterUser.value === 'all' || todo.userId === Number(filterUser.value);

      return matchesStatus && matchesUser;
    })
  );

  function getUserTodo(todo: Todo) {
    return users.getUser(todo.userId);
  }

  return {
    todos,
    fetchTodos,
    toggleTodo,
    filterStatus,
    filterUser,
    filteredTodos,
    getUserTodo
  };
});
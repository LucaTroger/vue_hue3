<script setup lang="ts">
import { onMounted } from 'vue'
import { useTodoStore } from '@/stores/todoStore'

const todoStore = useTodoStore()

onMounted(() => {
  todoStore.fetchTodos()
})
</script>

<template>
  <div>
    <h1>To-Dos</h1>
    <div>
      <label>Completion:
        <select v-model="todoStore.filterStatus">
          <option value="all">All</option>
          <option value="done">Done</option>
          <option value="open">Not done</option>
        </select>
      </label>
      <label>User (by ID):
        <select v-model="todoStore.filterUser">
          <option value="all">All</option>
          <option v-for="user in todoStore.todos.map(t => t.userId).filter((v, i, a) => a.indexOf(v) === i)" :key="user" :value="user">
            {{ user }}
          </option>
        </select>
      </label>
    </div>
    <ul>
      <li v-for="todo in todoStore.filteredTodos" :key="todo.id">
        <label>
          <input type="checkbox" :checked="todo.completed" @change="todoStore.toggleTodo(todo.id)" />
          {{ todo.title }} ({{ todo.userId }})
        </label>
      </li>
    </ul>
  </div>
</template>
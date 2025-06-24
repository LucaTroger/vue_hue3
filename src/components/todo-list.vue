<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import { userStore } from '../stores/userStore'

const todoStore = useTodoStore()
const usersStore = userStore()

const time = ref(new Date().toLocaleTimeString())
let intervalId: number | undefined

onMounted(() => {
  usersStore.fetchUsers()
  todoStore.fetchTodos()
  intervalId = window.setInterval(() => {
    time.value = new Date().toLocaleTimeString()
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})

const taskAmount = computed(() => todoStore.filteredTodos.length)
const checkedTasks = computed(() => todoStore.filteredTodos.filter(t => t.completed).length)
const uncheckedTasks = computed(() => todoStore.filteredTodos.filter(t => !t.completed).length)
</script>

<template>
  <p>Current time {{ time }}</p>
  <div>
    <label>Status:
      <select v-model="todoStore.filterStatus">
        <option value="all">All</option>
        <option value="open">Not done</option>
        <option value="done">Done</option>
      </select>
    </label>
    <label>User:
      <select v-model="todoStore.filterUser">
        <option value="all">All</option>
        <option v-for="user in usersStore.users" :key="user.id" :value="user.id">
          {{ user.username }}
        </option>
      </select>
    </label>
  </div>
  <div v-if="taskAmount > 0">
      <p>Amount of tasks {{ taskAmount }}</p>
      <p>Amount of checked tasks {{ checkedTasks }}</p>
      <p>Amount of unchecked tasks {{ uncheckedTasks }}</p>
    <ul>
      <li v-for="todo in todoStore.filteredTodos" :key="todo.id">
        <input type="checkbox" :checked="todo.completed" @change="todoStore.toggleTodo(todo.id)" />
        {{ todo.title }}
        — <b>{{ usersStore.users.find(u => u.id === todo.userId)?.username || 'Unbekannt' }}</b>
      </li>
    </ul>
  </div>
  <div v-else>
    <p>Keine Aufgaben - Füge eine hinzu</p>
  </div>
</template>
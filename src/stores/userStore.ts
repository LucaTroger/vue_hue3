import { defineStore } from 'pinia';
import { ref } from 'vue';

export const userStore = defineStore('users', () => {

    interface Company {
        name: string;
        catchPhrase: string;
        bs: string;
    }

    interface Address {
        street: string;
        suite: string;
        city: string;
        zipcode: string;
        geo: {
            lat: string;
            lng: string;
        };
    }
    interface Users {
        id: number;
        name: string;
        username: string;
        email: string;
        address: Address;
        phone: string;
        website: string;
        company: Company;
    }

    const users = ref<Users[]>([]);

    async function fetchUsers() {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        users.value = await response.json();
    }

    function getUser(id: number) {
        return users.value.find(user => user.id === id);
    }

    return {
        users,
        fetchUsers,
        getUser
    };
});
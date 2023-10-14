import {ref, reactive } from 'vue';
import router from '../router/index';
import { defineStore } from 'pinia';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const notify = (message) => {
  toast(message, {
    autoClose: 1000,
    position: toast.POSITION.TOP_RIGHT,
  });
}

const authStore = defineStore('auth', () => {
    const isAuthenticated = ref();
    const authenticatedUser = ref({});
    const profile = reactive({});

    if(JSON.parse(localStorage.getItem('authenticatedUser')))
        authenticatedUser.value = JSON.parse(localStorage.getItem('authenticatedUser'));

    function login(formData){
        fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                
                username: formData.username,
                password: formData.password,
            })
        })
        .then(res => res.json())
        .then((res) => {
            isAuthenticated.value = true;
            authenticatedUser.value = res;

            localStorage.setItem('isAuthenticated', isAuthenticated.value);
            localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser.value));
            
            router.push('/');
        });
    }

    function logout(){
        isAuthenticated.value = false;
        authenticatedUser.value = {};

        localStorage.setItem('isAuthenticated', isAuthenticated.value);
        localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser.value));

        router.push('/login');
    }

    async function getProfile(){
        await fetch(`https://dummyjson.com/auth/users/${authenticatedUser.value.id}`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${authenticatedUser.value.token}`, 
            'Content-Type': 'application/json'
            }, 
        })
        .then(res =>  res.json())
        .then(res => {
            Object.assign(profile, res);
        });
    }

    return { isAuthenticated, authenticatedUser, login, logout, profile, getProfile};

});

export default authStore;
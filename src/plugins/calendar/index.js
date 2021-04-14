import calendar from './Calendar.vue';

function install(_vue){
    _vue.component('my-calendar', calendar)
}

export  default{
    install
}
import {defineStore} from "pinia";

export const AdminStore=defineStore("admin",{
  state :()=>{
    return{
      id:0,
      account:"",
      token:"",
      password:"",
      isSave:false
    }
  },
  actions:{},
  getters:{}
})

const inquirer = require("inquirer");
const connection = require("./config/connection");
const { listAllDepartments } = require("./lib/queries")
const { displayAllDepartments } = require("./lib/displays")
/*
  There are a lot of menu items presented to users in this app. The only real way you cam manage them 
  is by creating a function to handle each one.

  I'm giving you a bit of starter code below.
*/ 


function createDepartmentsArray(arr){
  // console.log(arr)
  let newArr = []
  arr.forEach((object) => newArr.push(object.Department))
  // console.log(newArr)
  return newArr
}

function createRolesArray(arr){
  let newArr = []
  arr.forEach((object) => newArr.push(object.Role_Title))
  return newArr
}

function createEmployeeArray(arr){
  let newArr = []
  arr.forEach((object) => newArr.push(`${object.First_Name} ${object.Last_Name}`))
  return newArr
}


module.exports = {
  createDepartmentsArray: createDepartmentsArray,
  createRolesArray: createRolesArray,
  createEmployeeArray: createEmployeeArray, 
}
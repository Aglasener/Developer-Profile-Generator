const fs = require("fs");
const inquirer = require("inquirer");
const util = require("util");
const axios = require("axios");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser () {
    return inquirer.prompt([
            
            {
            type: "input",
            message: "What is your GitHub Username?",
            name: "username"
            },
            
            {
            type: "input",
            message: "What is your favorite color?",
            name: "color"
            }
        ]);
    }

function accessGithub (answers) {

        return axios.get(
            `https://api.github.com/users/${answers.username}`
        );

}

function generateHTML(info) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <title>Document</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4">Hi! My name is ${info.name}</h1>
    <h3>Example heading <span class="badge badge-secondary">Contact Me</span></h3>
    <ul class="list-group">
      <li class="list-group-item">My GitHub username is ${info.avatar_url}</li>
      <li class="list-group-item">LinkedIn: ${info.public_repos}</li>
    </ul>
  </div>
</div>
</body>
</html>`;}

async function init() {
    console.log("respond to prompts");
    try{
        const answers = await promptUser();
        const response = await accessGithub(answers);
        console.log(response.data);
        const html = await generateHTML(response.data);
        await writeFileAsync("index.html", html);
        console.log("successfully wrote to index.html");
    } catch(err) {
        console.log(err);
    }
};

init();

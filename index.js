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

function generateHTML(info, colorChoice) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
  <style>
  .container{background-color:${colorChoice}}
  .jumbotron{background-color:${colorChoice}}  
  </style>
  <title>My Resume</title>
</head>
<body>
  <div class="jumbotron jumbotron-fluid">
  <div class="container">
    <h1 class="display-4 justify-content-center" style = "background-color: white;">
      <div class="row">
          <div class="col-md">
            <img src="${info.avatar_url}"></img>
          </div>
          <div class="col-md justify-content-center align-self-center">
          ${info.name}
          </br>  
          (${info.login})
          </div>
      </div>
    </h1>
    
    <ul class="list-group">
      <li class="list-group-item"><a href ="${info.html_url}">My GitHub Profile</a></li>
      <li class="list-group-item"><a href ="${info.blog}">My Blog</a></li>
      <li class="list-group-item"><a href="https://www.google.com/maps/place/${info.location}">My Location</a></li>
      <li class="list-group-item">User Bio: ${info.bio}</li>
      <li class="list-group-item">Number of Public Repositories: ${info.public_repos}</li>
      <li class="list-group-item">Number of Followers: ${info.followers}</li>
      <li class="list-group-item">Number of GitHub stars: ${info.public_gists}</li>
      <li class="list-group-item">Number of Users Following: ${info.following}</li>
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
        const html = await generateHTML(response.data,answers.color);
        await writeFileAsync("index.html", html);
        console.log("successfully wrote to index.html");
    } catch(err) {
        console.log(err);
    }
};

init();

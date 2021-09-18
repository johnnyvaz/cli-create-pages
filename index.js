#!/usr/bin/env node
const program = require("commander");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");

const newCourse = (name, category) => {
  res = `---
  title: ${name}
  description: descrição curta
  img: https://images.unsplash.com/photo-1580752300992-559f8e0734e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80
  alt: descrição da imagem
  author:
  name: Autor
  tags:
  - ${category}
  ---
  ## ${name}

  descrição curta`

  return res
}
const routerTemplate = `const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
   try {
     res.send("ok");
   } catch (error) {
     console.error(error);
     next(error);
   }
});

module.exports = router;`;

const exist = (dir) => {
  try {
    fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (e) {
    return false;
  }
};

const mkdirp = (dir) => {
  const dirname = path
    .relative(".", path.normalize(dir))
    .split(path.sep)
    .filter(p => !!p);
  dirname.forEach((d, idx) => {
    const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
    if (!exist(pathBuilder)) {
      fs.mkdirSync(pathBuilder);
    }
  });
};

const makeTemplate = (type, name, directory) => {
  mkdirp(directory);
  if (type === "curso") {
    const pathToFile = path.join(directory, `${name}.md`);
    if (exist(pathToFile)) {
      console.error(chalk.bold.red("File Exists"));
    } else {
      fs.writeFileSync(pathToFile, newCourse());
      console.log(chalk.green(pathToFile, `Curso ${name} Criado`));
    }
  } else if (type === "categoria") {
    const pathToFile = path.join(directory, `${name}.md`);
    if (exist(pathToFile)) {
      console.error(chalk.bold.red("Categoria já existe!"));
    } else {
      fs.writeFileSync(pathToFile, routerTemplate);
      console.log(chalk.green(pathToFile, `Categoria ${name} Successfully`));
    }
  } else {
    console.error(chalk.bold.red("Selecione umas das opções: Curso ou Categoria"));
  }
};

let triggered = false;
program
  .version("0.0.1", "-v, --version")
  .usage("[options]");

program
  .command("template <type>")
  .usage("--name <name> --path [path]")
  .description("Create Template")
  .alias("tmpl")
  .option("-n, --name <name>", "Enter file Name", "index")
  .option("-d, --directory [path]", "Enter file Path", ".")
  .action((type, options) => {
    makeTemplate(type, options.name, options.directory);
    triggered = true;
  });

program
  .command("*", { noHelp: true })
  .action(() => {
    console.log("Cannot find the command");
    program.help();
    triggered = true;
  });

program
  .parse(process.argv);

if (!triggered) {
  inquirer.prompt([{
    type: "list",
    name: "type",
    message: "O que você vai criar agora?",
    choices: ["curso", "categoria"],
  }, {
    type: "input",
    name: "name",
    message: "Descrição",
    default: "index",
  }, {
    type: "input",
    name: "directory",
    message: "Type File Directory",
    default: ".",
  }, {
    type: "confirm",
    name: "confirm",
    message: "Creation? ",
  }])
    .then((answers) => {
      if (answers.confirm) {
        makeTemplate(answers.type, answers.name, answers.directory);
        console.log(chalk.rgb(128, 128, 128)("Terminal Closed"));
      }
    });
}
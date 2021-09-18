#!/usr/bin/env node
const program = require("commander");
const fs = require("fs");
// const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");

const newCourse = (name, category) => {
  res = `---
title: ${name}
description: descrição curta
img: https://vazio
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

// const newCategory = (name, description) => {
//   res = `
//   ---
//     name: ${name}
//     description: ${description}
//     img: https://empty
//   ---
//   `
//   return res
// }

const exist = (dir) => {
  try {
    fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    return true;
  } catch (e) {
    return false;
  }
};

categorias = [ "moda", "administração", "mecanica" ]

const mkdirp = (dir) => {
  // const dirname = path
  //   .relative(".", path.normalize(dir))
  //   .split(path.sep)
  //   .filter(p => !!p);
  const dirname = "content/"
    
  // dirname.forEach((d, idx) => {
    // const pathBuilder = dirname.slice(0, idx + 1).join(path.sep);
    
    if (!exist(dirname+dir)) {
      
      fs.mkdirSync(dirname+dir);
    }
  // });
};

const makeTemplate = (type, name, category) => {
  const fileName = name.replace(/ /g, "-")
  mkdirp(category);
  if (type === "curso") {
    const pathToFile = `content/${category}/${fileName}.md`;
    if (exist(pathToFile)) {
      console.error(chalk.bold.red("Registro já existe"));
    } else {
      fs.writeFileSync(pathToFile, newCourse(name, category));
      console.log(chalk.green(pathToFile, `Curso ${name} Criado`));
    }
  // } else if (type === "categoria") {
  //   const pathToFile = path.join(category, `${name}.md`);
  //   if (exist(pathToFile)) {
  //     console.error(chalk.bold.red("Categoria já existe!"));
  //   } else {
  //     fs.writeFileSync(pathToFile, routerTemplate);
  //     console.log(chalk.green(pathToFile, `Categoria ${name} Successfully`));
  //   }
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
  .option("-c, --category [category]", "Digite a categoria", categorias)
  .action((type, options) => {
    makeTemplate(type, options.name, options.category);
    triggered = true;
  });

program
  .command("*", { noHelp: true })
  .action(() => {
    console.log("comando não encontrado!");
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
    choices: ["curso", "categoria(inativo)"],
  }, {
    type: "input",
    name: "name",
    message: "Nome",
  }, 
  {
    type: "list",
    name: "category",
    message: "Selecione uma categoria:",
    choices: categorias,
  },
  {
    type: "confirm",
    name: "confirm",
    message: "Creation? ",
  }])
    .then((answers) => {
      if (answers.confirm) {
        makeTemplate(answers.type, answers.name, answers.category);
        console.log(chalk.rgb(128, 128, 128)("Programa finalizado"));
      }
    });
}
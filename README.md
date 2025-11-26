# Project details

Application to generate a chat with React by connecting to socket private channels of a backend development project in NodeJS.

|                |Version							|
|----------------|-------------------------------|
|React|`18.2.0`            |
|NPM          |`11.5.2`            |
|Node.js          |`22.14.0`|

## Instructions

To run the frontend project, follow these steps:

- Clone the project, either with the command git clone `https://github.com/dev-shelvin-batista/react-socket-chat.git` or using a GitHub graphical tool.

- After cloning the repository, install the node dependencies using the command `npm install` inside the `react-socket-chat` project folder. If an error occurs, add the --force option.

- Run the command `npm run start` to start the server. By default, the url `http://localhost:3000` is used.

## Docker Instructions

To run the frontend project in a Docker container, follow these steps:

- Clone the project, either with the command git clone `https://github.com/dev-shelvin-batista/react-socket-chat.git` or using a GitHub graphical tool.

- Access the folder in a command terminal using the cd command.

- The project already has a Dockerfile that generates the image to create the container. Just create the image with the `docker build -t react-socket-chat .` command.

- Create the container from the image created by running the `docker run --rm -p 3000:3000 react-socket-chat` command.

- After running the above command, the container will be active and you will be able to access the frontend project from the host with the URL `http://localhost:3000/`.

- You can change the port to be used on the host by modifying the port in the **docker run** command in the **-p** option.
/*
Hello sir in this assignment i used different packages different from your mentioned packages because 
I am familar with these concepts and I did practice with these concepts 
These are some of the packages i used in this assignment 
  your mentioned concepts         --    i am familar concepts
            sha-256               --   bcrypt (to encrypt the message) 
            sockets.io            --  http methd POST (to handle the api)
            mangodb               --  sqlite3 (to manage Databaes)
    
  but in the future i definetly try to learn the concepts you mentioned in this assignment
  as of now i did this assignment with my knowledge sorry for that.
*/

//emmiter.js

const bcrypt = require("bcrypt");
const data = require("./data.json"); // Load the constant list of data
const apiUrl = "http://localhost:3001/api/data";

async function generateRandomMessage() {
  const randomData = data[Math.floor(Math.random() * data.length)];
  const secretKey = await bcrypt.hash(
    JSON.stringify({
      name: randomData.name,
      origin: randomData.origin,
      destination: randomData.destination,
    }),
    40
  );

  return {
    ...randomData,
    secret_key: secretKey,
  };
}

async function sendData() {
  const numberOfMessages = Math.floor(Math.random() * 450) + 49;

  for (let i = 0; i < numberOfMessages; i++) {
    const payload = await generateRandomMessage();

    try {
      await fetch(apiUrl, payload);
      console.log("Data sent successfully:", payload);
    } catch (error) {
      console.error("Error sending data:", error.message);
    }
  }
}

setInterval(sendData, 10000); // Send data every 10 seconds

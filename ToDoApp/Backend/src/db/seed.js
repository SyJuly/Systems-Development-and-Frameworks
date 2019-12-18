const {users, todos} = require('./data');

const createUsers = async(driver) =>{
  users.forEach(async user => {
    console.log("creating user")
    const session = driver.session();
    await session.run(
        'CREATE (:User {id: $id, name: $name, email: $email, password: $password})',
        user
    );
    await session.close();
  })
}
const createTodos = (driver) =>{
  todos.forEach(async todo => {
    console.log("creating todo")
    const session = driver.session();
    await session.run(
        'CREATE (t:Todo {id: $id, message: $message, finished: $finished})\n' +
        'WITH t \n' +
        'MATCH (u:User{id:$publishedBy})\n' +
        'MERGE (u)-[:PUBLISHED]->(t)\n',
        todo
    );
    await session.close();
  })
}

const seedDatabase = async(driver) => {
  await createUsers(driver);
  await createTodos(driver);
}

module.exports.seedDatabase = seedDatabase;
let users = require("../mocks/users");
const bodyParser = require("../helpers/bodyParser");

module.exports = {
  listUsers(request, response) {
    const { order } = request.query;

    const sortedUsers = users.sort((a, b) => {
      if (order === "desc") return a.id < b.id ? 1 : -1;

      return a.id > b.id ? 1 : -1;
    });

    response.send(200, sortedUsers);
  },

  getUSerById(request, response) {
    const { id } = request.params;

    const user = users.find((userObject) => userObject.id === Number(id));

    if (!user) return response.send(404, { error: "User not found" });

    response.send(200, user);
  },

  createUser(request, response) {
    const lastUserId = users[users.length - 1].id;
    const newUser = {
      id: lastUserId + 1,
      name: request.body.name,
    };

    users.push(newUser);

    response.send(200, newUser);
  },

  updateUser(request, response){
    let {id} = request.params;
    const {name} = request.body;

    id  = Number(id);

    let user = users.find(userObject => userObject.id === id);

    if (!user)
      return response.send(404, 'User not found');

    user.name = name;
    
    response.send(200, {id, name});
  },

  deleteUser(request, response) {
    let {id} = request.params;

    id  = Number(id);

    const userIndex = users.findIndex(userObject => userObject.id === id);

    if (userIndex === -1)
      return response.send(404, 'User not found');

    delete users[userIndex];
    
    response.send(200, {deleted: true});
  }

};

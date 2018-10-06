class Users {

  constructor() {
    this.users = [];
  }

  addUser(id, name, room) {
    var user = {id, name, room};
    this.users.push(user);
    return user;
  }

  removeUser(id) {
    var user = this.users.filter((user) => user.id === id)[0];

    if(user) {
        this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }

  getUser(id) {
    return this.users.filter((user) => user.id === id)[0];
  }

  getUserList(room) {
    var users = this.users.filter((user) => user.room === room);
    var names = users.map((user) => user.name);
    return names;
  }

  getNumberOfUsers(room) {
    var num = 0;
    this.users.forEach((user) => {
      if (user.room === room) {
        num++;
      }
    });
    return num;
  }
}

module.exports = {Users};

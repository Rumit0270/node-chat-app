const { Users } = require('./users');
const expect = require('expect');




describe('Users', () => {
  var users;

  beforeEach(() => {
      users = new Users();
      users.users = [
        {id: 1, name: 'Jack', room: 'Arsenal'},
        {id: 2, name: 'Aaron', room: 'Arsenal'},
        {id: 3, name: 'Hazard', room: 'Chelsea'},
      ];
  });


  it('should add new user', () => {
    var users = new Users();
    var user = {id: 10, name: 'Rumit', room: 'Arsenal'};
    var res = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });


  it('should all names of users in a room', () => {
    var userListArsenal = users.getUserList('Arsenal');
    var userListChelsea = users.getUserList('Chelsea');
    expect(userListArsenal).toEqual(['Jack', 'Aaron']);
    expect(userListChelsea).toEqual(['Hazard']);
  });


  it('should remove a user', () => {
    var user = users.removeUser(1);
    expect(user).toEqual({id: 1, name: 'Jack', room: 'Arsenal'});
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var user = users.removeUser(5);
    expect(user).toNotExist();
    expect(users.users.length).toBe(3);
  })

  it('should return a user with given valid id', () => {
    var user = users.getUser(users.users[0].id);
    expect(user).toEqual(users.users[0]);
  });

  it('should not return a user with given invalid id', () => {
    var user = users.getUser(5);
    expect(user).toNotExist();
  });

});

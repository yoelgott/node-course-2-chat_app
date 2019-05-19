class Users {
    constructor() {
        this.users = [];
    };

    add_user (id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    };

    remove_user (id) {
        var user = this.get_user(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        };
        return user;
    };

    get_user (id) {
        var user = this.users.find((user) => user.id === id);
        return user;
    };

    get_user_list (room) {
        var users = this.users.filter((user) => user.room === room);
        var names_array = users.map((user) => user.name);
        return names_array;
    };
};

module.exports = {Users};

var users = new Users();

users.add_user(1, 'yoel', '2');
users.add_user(2, 'noam', '1');
users.add_user(3, 'itai', '1');

console.log(users.get_user_list('1'));

var u = users.remove_user(3);
console.log(u);

console.log(users.get_user_list('1'));

console.log(users.get_user(1));

console.log(users);
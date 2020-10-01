class Users {

    constructor() {
        this.people = [];
    };

    addPerson(id, name, room) {
        let person = { id, name, room };
        this.people.push(person);
        return this.people;
    };

    getPerson(id) {
        let person = this.people.filter(person => person.id === id)[0];
        return person;
    };

    getPeople() {
        return this.people
    };

    getPeoplePerRoom(room) {
        let roomPeople = this.people.filter(person => person.room === room);
        return roomPeople;
    };

    deletePerson(id) {
        let deletedPerson = this.getPerson(id);
        this.people = this.people.filter(person => person.id != id);
        return deletedPerson;
    };


}

module.exports = {
    Users
}
const fs = require('fs/promises');
const chalk = require('chalk');
const { v4: uuidv4 } = require('uuid');

const readFileToObg = async (path) => {
    try {
        return JSON.parse(await fs.readFile(path));
    } catch (error) {
        console.error(chalk.red(error.message))
        return null;
    }
}
const writeObgToFile = async (path, data) => {
    try {
        await fs.writeFile(path, JSON.stringify(data, null, 4));
    } catch (error) {
        console.error(chalk.red(error.message));
        return null;
    }
}
const normalizeId = (id) => {
    if (typeof id === 'string') {
        return parseInt(id)
    } else { return id }
}
// const contactsPath = path.join(__dirname, "..", "db", "contacts.json");

const listContacts = async (path) => {
    const allContacts = await readFileToObg(path)
    return allContacts;
}

const getContactById = async (path, contactId) => {
    const id = normalizeId(contactId)
    const allContacts = await readFileToObg(path);
    const contactToFind = allContacts.find(contact => contact.id === id);
    if (!contactToFind) {
        console.warn(chalk.red('No such contact to get!'));
        return null;
    }
    return contactToFind;
}

const removeContact = async (path, contactId) => {
    const id = normalizeId(contactId);
    const allContacts = await readFileToObg(path);
    const indexToFind = allContacts.findIndex(contact => contact.id === id)
    if (indexToFind === -1) {
        console.warn(chalk.red('No such contact to remove!'));
        return null;
    }
    const deletedContact = allContacts.splice(indexToFind, 1)
    const contactsAfterDelete = allContacts;
    await writeObgToFile(path, contactsAfterDelete)
    return deletedContact;
}

const addContact = async (path, name, email, phone) => {
    const contacts = await readFileToObg(path);
    const newContact = { id: uuidv4(), name, email, phone };
    contacts.push(newContact);
    await writeObgToFile(path, contacts);
    return newContact;
}
module.exports = { listContacts, getContactById, removeContact, addContact }
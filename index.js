const path = require('path');
const { Command } = require('commander');
const program = new Command();

const { listContacts, getContactById, removeContact, addContact } = require('./contacts/contacts.js')

program
    .option('-a, --action <type>', 'choose action')
    .option('-i, --id <type>', 'user id')
    .option('-n, --name <type>', 'user name')
    .option('-e, --email <type>', 'user email')
    .option('-p, --phone <type>', 'user phone');


const contactsPath = path.join(__dirname, "db", "contacts.json");
program.parse(process.argv);

const argv = program.opts();

async function invokeAction({ action, id, name, email, phone }) {
    switch (action) {
        case 'list':
            const allData = await listContacts(contactsPath);
            console.table(allData)
            return allData;

        case 'get':
            const contact = await getContactById(contactsPath, id)
            console.table(contact)
            return contact;

        case 'add':
            const newContact = await addContact(contactsPath, name, email, phone);
            console.table(newContact)
            return newContact;

        case 'remove':
            const removedContact = await removeContact(contactsPath, id)
            console.table(removedContact)
            return removedContact;

        default:
            console.warn('\x1B[31m Unknown action type!');
    }
}

invokeAction(argv);

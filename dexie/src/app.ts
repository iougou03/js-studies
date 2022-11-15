import Dexie from "dexie";

interface IContact {
  id: number;
  first: string;
  last: string;
}

interface IEmailAddress {
  id: number;
  contactId: number; // "Foreign key" will goes here
  type: string; // type of email such as "work" , "spam" ...
  email: string;
}

interface IPhoneNumber {
  id: number;
  contactId: number;
  type: string;
  phone: string;
}

class MyAppDatabase extends Dexie {
  contacts!: Dexie.Table<IContact, number>;
  // └ Table <table interface , primarykey type>

  emails!: Dexie.Table<IEmailAddress, number>;

  phones!: Dexie.Table<IPhoneNumber, number>;

  constructor() {
    super("MyAppDatabase");

    this.version(1).stores({
      contacts: "++id, first, last",
      emails: "++id, contactId, type, email",
      phones: "++id, contactId, type, phone",
    });
  }
}

var db = new MyAppDatabase();

/* This is a 'physical' class that is mapped to
 * the contacts table. We can have methods on it that
 * we could call on retrieved database objects.
 */
class Contact implements IContact {
  id!: number;
  first: string;
  last: string;
  emails: IEmailAddress[];
  phones: IPhoneNumber[];
  
  constructor (first: string, last: string, id?:number) {
    this.first = first;
    this.last = last;
    if (id) this.id = id;

    this.emails = [];
    this.phones = [];
  }
  
  loadEmailsAndPhones() {
    return Promise.all(
        [
        db.emails
        .where('contactId').equals(this.id)
        .toArray(emails => this.emails = emails),
        
        db.phones
        .where('contactId').equals(this.id)
        .toArray(phones => this.phones = phones)
        ] 
      )
      .then(x => this);
  }
  
  save() {
    return db.transaction('rw', db.contacts, db.emails, db.phones, () => {
      return Promise.all(
        // Save existing arrays
        [
        Promise.all(this.emails.map(email => db.emails.put(email))),

        Promise.all(this.phones.map(phone => db.phones.put(phone)))
        ]
      )
      .then(results => {
        // Remove items from DB that is was not saved here:
        var emailIds = results[0], // array of resulting primary keys
        phoneIds = results[1]; // array of resulting primary keys
        
        db.emails.where('contactId').equals(this.id)
          .and(email => emailIds.indexOf(email.id) === -1)
          .delete();
        
        db.phones.where('contactId').equals(this.id)
          .and(phone => phoneIds.indexOf(phone.id) === -1)
          .delete();
        
        // At last, save our own properties.
        // (Must not do put(this) because we would get
        // reduntant emails/phones arrays saved into db)
        db.contacts.put(new Contact(this.first, this.last, this.id))
          .then(id => this.id = id);
      });
    });
  }
}

db.contacts.mapToClass(Contact);
import { openDB } from "idb";

function demo1() {
  openDB('db1', 1, {
    upgrade(db) {
      db.createObjectStore('store1');
      db.createObjectStore('store2');
    },
  });
  openDB('db2', 1, {
    upgrade(db) {
      db.createObjectStore('store3', { keyPath: 'id' });
      db.createObjectStore('store4', { autoIncrement: true });
    },
  });
}

async function demo2() {
  // connect with database called 'db1'
  const db1 = await openDB('db1', 1);
  
  // add(store_name, value, key)
  db1.add('store1', 'hello world', 'message');
  db1.add('store1', true, 'delivered');
  // delivered will be top of the table since IndexedDB sort key automatically
  db1.close();
}

async function demo3() {
  const db1 = await openDB('db1', 1);
  db1
    .add('store1', 'hello again!!', 'new message')
    .then(result => {
      console.log('success!', result);
    })
    .catch(err => {
      console.error('error: ', err);
    });

  // although close() function is called, but won't close in real world since
  // it will wait until all queued operations are completed.
  db1.close();
}

async function demo4() {
  const db2 = await openDB('db2', 1);
  db2.add('store3', { id: 'cat001', strength: 10, speed: 10 });
  db2.add('store3', { id: 'cat002', strength: 11, speed: 9 });
  db2.add('store4', { id: 'cat003', strength: 8, speed: 12 });
  db2.add('store4', { id: 'cat004', strength: 12, speed: 13 });
  db2.close();
}

async function demo5() {
  const db2 = await openDB('db2', 1);
  // retrieve by key:
  db2.get('store3', 'cat001').then(console.log);
  // retrieve all:
  db2.getAll('store3').then(console.log);
  // count the total number of items in a store:
  db2.count('store3').then(console.log);
  // get all keys:
  db2.getAllKeys('store3').then(console.log);
  db2.close();
}

async function demo6() {
  // set db1/store1/delivered to be false:
  const db1 = await openDB('db1', 1);
  db1.put('store1', false, 'delivered');
  db1.close();

  // replace cat001 with a supercat:
  const db2 = await openDB('db2', 1);
  db2.put('store3', { id: 'cat001', strength: 99, speed: 99 });
  db2.close();
}

async function demo7() {
  const db2 = await openDB('db2', 1);

  // open a new transaction, declare which stores are involved:
  let transaction = db2.transaction(['store3', 'store4'], 'readwrite');

  // do multiple things inside the transaction, if one fails all fail:
  let superCat = await transaction.objectStore('store3').get('cat001');
  transaction.objectStore('store3').delete('cat001');
  transaction.objectStore('store4').add(superCat);

  db2.close();
}

async function demo8() {
  // we'll only operate on one store this time:
  const db1 = await openDB('db1', 1);

  // ↓ this is equal to db1.transaction(['store2'], 'readwrite'):
  let transaction = db1.transaction('store2', 'readwrite');

  
  // since transaction covers a *single store*, it will return the store otherwise return undefined
  // ↓ this is equal to transaction.objectStore('store2').add(..)
  transaction.store.add('foo', 'foo');
  transaction.store.add('bar', 'bar');


  // monitor if the transaction was successful:
  transaction.done
    .then(() => {
      console.log('All steps succeeded, changes committed!');
    })
    .catch(() => {
      console.error('Something went wrong, transaction aborted');
    });
  db1.close();
}

async function demo9() {
  const db3 = await openDB('db3', 1, {
    upgrade: (db, oldVersion, newVersion, transaction) => {
      if (oldVersion === 0) upgradeDB3fromV0toV1();

      function upgradeDB3fromV0toV1() {
        db.createObjectStore('moreCats', { keyPath: 'id' });
        generate100cats().forEach(cat => {
          transaction.objectStore('moreCats').add(cat);
        });
      }
    },
  });
  db3.close();
}

function generate100cats() {
  return new Array(100).fill().map((item, index) => {
    let id = 'cat' + index.toString().padStart(3, '0');
    let strength = Math.round(Math.random() * 100);
    let speed = Math.round(Math.random() * 100);
    return { id, strength, speed };
  });
}

async function demo10() {
  const db3 = await openDB('db3', 2, {
    upgrade: (db, oldVersion, newVersion, transaction) => {
      switch (oldVersion) {
        case 0:
          upgradeDB3fromV0toV1();
        // falls through
        case 1:
          upgradeDB3fromV1toV2();
          break;
        default:
          console.error('unknown db version');
      }

      function upgradeDB3fromV0toV1() {
        db.createObjectStore('moreCats', { keyPath: 'id' });
        generate100cats().forEach(cat => {
          transaction.objectStore('moreCats').add(cat);
        });
      }

      function upgradeDB3fromV1toV2() {
        db.createObjectStore('userPreference');
        transaction.objectStore('userPreference').add(false, 'useDarkMode');
        transaction.objectStore('userPreference').add(25, 'resultsPerPage');
      }
    },
  });
  db3.close();
}

async function demo11() {
  const db3 = await openDB('db3', 3, {
    upgrade: async (db, oldVersion, newVersion, transaction) => {
      switch (oldVersion) {
        case 0:
          upgradeDB3fromV0toV1();
        // falls through
        case 1:
          upgradeDB3fromV1toV2();
        // falls through
        case 2:
          await upgradeDB3fromV2toV3();
          break;
        default:
          console.error('unknown db version');
      }

      function upgradeDB3fromV0toV1() {
        db.createObjectStore('moreCats', { keyPath: 'id' });
        generate100cats().forEach(cat => {
          transaction.objectStore('moreCats').add(cat);
        });
      }
      function upgradeDB3fromV1toV2() {
        db.createObjectStore('userPreference');
        transaction.objectStore('userPreference').add(false, 'useDarkMode');
        transaction.objectStore('userPreference').add(25, 'resultsPerPage');
      }
      async function upgradeDB3fromV2toV3() {
        const store = transaction.objectStore('userPreference');
        store.put('English', 'language');
        store.delete('resultsPerPage');

        // 'light' | 'dark' | 'automatic'
        let colorTheme = 'automatic';
        let useDarkMode = await store.get('useDarkMode');
        if (oldVersion === 2 && useDarkMode === false) colorTheme = 'light';
        if (oldVersion === 2 && useDarkMode === true) colorTheme = 'dark';
        store.put(colorTheme, 'colorTheme');
        store.delete('useDarkMode');
      }
    },
  });
  db3.close();
}

// by indexing we can sort store with different key, not with default key--primary key.
async function demo12() {
  const db3 = await openDB('db3', 4, {
    upgrade: (db, oldVersion, newVersion, transaction) => {
      // upgrade to v4 in a less careful manner:
      const store = transaction.objectStore('moreCats');
      store.createIndex('strengthIndex', 'strength');
    },
  });
  db3.close();
}

async function demo13() {
  const db3 = await openDB('db3', 4);
  const transaction = db3.transaction('moreCats');
  const strengthIndex = transaction.store.index('strengthIndex');
  // get all entries where the key is 10:
  let strongestCats = await strengthIndex.getAll(10);
  console.log('strongest cats: ', strongestCats);

  // get the first entry where the key is 10:
  let oneStrongCat = await strengthIndex.get(10);
  console.log('a strong cat: ', oneStrongCat);
  db3.close();
}

async function demo14() {
  const db3 = await openDB('db3', 4);
  // do similar things as demo13, but use single-action transaction shortcuts:
  let weakestCats = await db3.getAllFromIndex('moreCats', 'strengthIndex', 1);
  console.log('weakest cats: ', weakestCats);
  let oneWeakCat = await db3.getFromIndex('moreCats', 'strengthIndex', 1);
  console.log('a weak cat: ', oneWeakCat);
  db3.close();
}

async function demo15() {
  const db3 = await openDB('db3', 4);
  // create some ranges. note that IDBKeyRange is a native browser API,
  // it's not imported from idb, just use it:
  const strongRange = IDBKeyRange.lowerBound(8);
  const midRange = IDBKeyRange.bound(3, 7);
  const weakRange = IDBKeyRange.upperBound(2);
  let [strongCats, ordinaryCats, weakCats] = [
    await db3.getAllFromIndex('moreCats', 'strengthIndex', strongRange),
    await db3.getAllFromIndex('moreCats', 'strengthIndex', midRange),
    await db3.getAllFromIndex('moreCats', 'strengthIndex', weakRange),
  ];
  console.log('strong cats (strength >= 8): ', strongCats);
  console.log('ordinary cats (strength from 3 to 7): ', ordinaryCats);
  console.log('weak cats (strength <=2): ', weakCats);
  db3.close();
}

async function demo16() {
  const db3 = await openDB('db3', 4);
  // open a 'readonly' transaction:
  let store = db3.transaction('moreCats').store;
  // create a cursor, inspect where it's pointing at:
  let cursor = await store.openCursor();
  console.log('cursor.key: ', cursor.key);
  console.log('cursor.value: ', cursor.value);
  // move to next position:
  cursor = await cursor.continue();
  // inspect the new position:
  console.log('cursor.key: ', cursor.key);
  console.log('cursor.value: ', cursor.value);

  // keep moving until the end of the store
  // look for cats with strength and speed both greater than 8
  while (true) {
    const { strength, speed } = cursor.value;
    if (strength >= 90 && speed >= 8) {
      console.log('found a good cat! ', cursor.value);
    }
    cursor = await cursor.continue();
    if (!cursor) break;
  }
  db3.close();
}

async function demo17() {
  const db3 = await openDB('db3', 4);
  let store = db3.transaction('moreCats').store;
  // create a cursor on a very small range:
  const range = IDBKeyRange.bound('cat042', 'cat045');
  let cursor1 = await store.openCursor(range);
  // loop over the range:
  while (true) {
    console.log('cursor1.key: ', cursor1.key);
    cursor1 = await cursor1.continue();
    if (!cursor1) break;
  }
  console.log('------------');
  // create a cursor on an index:
  let index = db3.transaction('moreCats').store.index('strengthIndex');
  let cursor2 = await index.openCursor();
  // cursor.key will be the key of the index:
  console.log('cursor2.key:', cursor2.key);
  // the primary key will be located in cursor.primaryKey:
  console.log('cursor2.primaryKey:', cursor2.primaryKey);
  // it's the first item in the index, so it's a cat with strength 0
  console.log('cursor2.value:', cursor2.value);
  db3.close();
}

const demoMap = {
  demo1,
  demo2,
  demo3,
  demo4,
  demo5,
  demo6,
  demo7,
  demo8,
  demo9,
  demo10,
  demo11,
  demo12,
  demo13,
  demo14,
  demo15,
  demo16,
  demo17,
  // demo18,
}

for (const key in demoMap) {
  const button = document.createElement('button');
  
  button.textContent = key;
  
  button.addEventListener('click', demoMap[key])

  document.body.appendChild(button);
}
import { ActorRef, assign, createMachine, interpret, spawn } from 'xstate';
import { send, sendParent } from 'xstate/lib/actions';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ITabManagerDB extends DBSchema {
  'saved-window': {
    key: number;
    value: Object;
  };
}

class DBHandler {
  private _db!: IDBPDatabase<ITabManagerDB>;

  constructor() {}

  async open() {
    return (this._db = await openDB<ITabManagerDB>('tab-manager-db', 1, {
      upgrade(db) {
        db.createObjectStore('saved-window', { autoIncrement: true });
      },
    }));
  }

  async loadAllWindows() {
    return await this._db.getAll('saved-window');
  }

  async savingWindow(win: any) {
    const transaction = this._db.transaction('saved-window', 'readwrite');

    transaction.store.put(win, win.id);

    return await transaction.done
      .then(() => {
        console.log('[idb]: saving window complete');
      })
      .catch(err => {
        console.error('[idb]: saving had failed');
        throw err;
      });
  }

  async removingWindow(windowId: number) {
    const transaction = this._db.transaction('saved-window', 'readwrite');

    transaction.store.delete(windowId);

    return transaction.done
      .then(() => {
        console.log('[idb]: saving window complete');
      })
      .catch(err => {
        console.error('[idb]: saving had failed');
        throw err;
      });
  }
  close() {
    this._db.close();
  }
}

const db = new DBHandler();

export type DBGuards = 'ok' | 'get all data' | 'asd';

export const dbMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QQEYDoDyA7ANgSyzDVgEMA3MAAgHcCIB7agYgcLQLPoGsjVNcCRUhRp1GCDvQDGJAC556WANoAGALqq1iUAAd6sPPMXaQAD0QBOAOwAWNAA4bAZnsqAjCos37ANhU+AGhAAT0QnACY3NCcYp1twpx8AVnCbNySAXwygvmx8NmEqWiwGZjAAJ3L6crQdHDkAM2qAWzRcgQLyIrFqCSxOGSNldU0TPQMhk3MECy8HZ1cPL19-INCEGysraJi0lySfJzT7TOyQdvzeMBwwWSpCiFESxhZFIkkeNvQ8wTbr2-uXUexVKfQGcgUww06jG+kMkKmlls8xc7k83j8gRCYSsTh2MXstmcbicKhUpxy3w6Vxud0oDyepSYFSqNTqjRaX34lz+tMBFGBPTB0ghik0oyQIHG8OMkumHhUdkcqKWGNW2IQKQs+Js4Ss-nCXi2WUp3METAASgBRACKAFUrQBlAAqEt0cMmcrCbiibhs-k89kJ6SSJzWYRsPjQs1m9gsblcFgi4RN5ypl0ttodLqUbi0kulntA0ycPrQfoDFiDVhDYY1NiSSTQZLJkbj+pOqb4joArlIpHBYEw3VKPQivQg9VGK34q8HG3X1vY8S33DW3EanEkrF30FbKtVhzCC2PZcXEFPy-7Z9Xa0lwwhcdtVz4E24rOEfDYLLvMA0Ghm9A6GAUKwhM47nggfp2Aa36+Acmw+Fi6yGlG4RJC2ByEsuupOFkZxYPQEBwCYFy-IUjKMGBMpYIiCA+PY4TRK4CQbu+n7kg+ER4t+sxIRYn7pEGv4-GwxF8vSQKUdQ1FFmYiBfvYaBJJGFieBhSE1ve9alspLapF+rFuD4InUrJEHyZOhxXpWt4Ltp6wJlGvEWPxgmhlY9i-r2-aDuZZ6WW46FRHEGGNlpn7xlxn74i44TuKWDZbr++6sv5tETkFyLuFhEQ+FYySNg+WqxbM7joTYlUif+lzpXRurRSozb6RhKhWBYBw-mcqB1ROAC0yGIH1SR4jGVbhEG5Kfs4+EZEAA */
  createMachine(
    {
  tsTypes: {} as import("./test.typegen").Typegen0,
  schema: {
    services: {} as {
      "open idb": { data: void };
      "save window": { data: void };
      "delete saved window": { data: void };
    },
    events: {} as
      | { type: "open" }
      | {
          type: "REQUEST";
          command: DBGuards;
        },
  },
  entry: "fm2ghi",
  initial: "Offline",
  states: {
    Online: {
      entry: "k22m37",
      type: "parallel",
      states: {
        "save window": {
          invoke: {
            src: "save window",
            onDone: [
              {
                target: "#db.Success",
              },
            ],
            onError: [
              {
                target: "#db.Error",
              },
            ],
          },
        },
        "delete saved window": {
          invoke: {
            src: "delete saved window",
            onDone: [
              {
                target: "#db.Success",
              },
            ],
            onError: [
              {
                target: "#db.Error",
              },
            ],
          },
        },
      },
      on: {
        REQUEST: [
          {
            target: ".save window",
            cond: "save window",
          },
          {
            target: ".delete saved window",
            cond: "delete saved windows",
          },
        ],
      },
    },
    Success: {
      entry: ["send to parent", "send status"],
      always: {
        target: "Online",
      },
    },
    Error: {
      entry: ["send to parent", "send status"],
      always: {
        target: "Online",
      },
    },
    Offline: {
      on: {
        open: {
          target: "Online",
          actions: "open idb",
        },
      },
    },
  },
  id: "db",
},
    {
      services: {
        'save window': async (_, event) => {
          if (event.type === 'REQUEST') {
            // const win = event.data;

            // db.savingWindow(win);
          }
        },

        'delete saved window': async (_, event) => {
          if (event.type === 'REQUEST') {
            // const { windowId } = event.data;

            // await db.removingWindow(windowId!);
          }
        },

      },

      guards: {
        'delete saved windows': (_, event) =>
          event.command === 'asd',
        'save window': (_, event) =>
          event.command === 'get all data',
      },

      actions: {
        'open idb': () => {
          console.log('idb server open');
          
          db.open();

          sendParent('REMOTE.RECEIVE');
        },

        'send to parent': (_, event) => {
          // let data = undefined;

          // const respond: {
          //   type: string;
          //   data?: CurrentWindowMapping;
          // } = {
          //   type: 'REMOTE.RECEIVE',
          //   data,
          // };

          // sendParent(respond);
        },

        'send status': (_, event) => {
          
        },
      },
    }
  );

export const savedTabListMachine =
  /** @xstate-layout N4IgpgJg5mDOIC5QGUCGA3SACALqgRlgDYCWsOAdCREWAMQAyA8gMICCDFTACgKIByAbQAMAXUSgADgHtYJHCWkA7CSAAeiAKwAWAIwUA7MIDMugEyaANCACeiAGzCzFAJxuX9l9oAcZ7Wd0XAF8g6zRMCFwCYjJKFmUlMABjHGwcaSwIfDoAJV4AWSYAFV4KPJZeAEkANV4RcSQQGTkFZVUNBE0jCk1vTRdjAytbREHvCm13Tx8-AODQkHC06NJyCnilRJS0jKzGVg4y3gBFAFVeZCL61Wb5RRVGjs1zCj7dfuNhXSGDb11rOwIMwGFyuKZeXz+QIhMIYZaEVZxBLJVKRdKZbLMdicPJnC5XXQNKSyO5tR6IbQGbSubzaQbDQG6P49GGLOFolaxdbI7Zo3aYg44k7nS6CMxEpok1oPUAdSmaV50oYAxDeYyspYchFcjZbVG4fl0AC2cFgqCgJCUUGujVu0vaiDMfkMJnMDNGfQm4JmUO8GvZUW1a2QYCUfKwJtgZpgdBtxJa9wdQOdRlMFhVCB8xjBbmmkICftZSmkEDgqk1gZia2otBuUsT5IQxn8LrT7oQ9l0wkMkw8ENm0IWFbwQaRmxROwxdYTZNlWiGEzMHm8ypGmeZ7j7Prm-oilcRFBDYYNEdN5rA09JMvUFLMGcp9gounsL+Mncmwm8tM0u-hVZwl72o2AC09gZqBIQhEAA */
  createMachine(
    {
  context: {
    data: {},
    dbRef: spawn(dbMachine, 'db-machine'),
    msgRef: null,
  },
  tsTypes: {} as import("./test.typegen").Typegen1,
  schema: {
    context: {} as {
      data: Object;
      dbRef: any;
      msgRef: any;
    },

    events: {} as
      | { type: 'LOCAL.OPEN' }
      | {
          type: 'REMOTE.RECEIVE';
          data?: Object;
        }
      | {
          type: 'LOCAL.REQUEST';
          command: DBGuards;
        }
      | { type: 'messaging'; },
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        'LOCAL.OPEN': {
          target: 'Connected to db',
          actions: 'request open db',
        },
      },
    },
    'Connected to db': {
      on: {
        'REMOTE.RECEIVE': {
          actions: 'receive data',
        },
        'LOCAL.REQUEST': [
          {
            cond: 'save window',
            actions: 'request db with data',
          },
          {
            cond: 'delete saved window',
            actions: 'request db with data',
          },
          {
            cond: 'get all saved window',
            actions: 'request db with data',
          },
        ],
        messaging: {
          target: 'Send to message',
          actions: 'send to message machine',
        },
      },
    },
    'Send to message': {
      always: {
        target: 'Connected to db',
      },
    },
  },
  id: 'Saved tab list',
},
    {
      actions: {

        'request open db': send(
          { type: 'open' },
          { to: (context) => context.dbRef!}
        ),

        'receive data': (context, event) => {
          if (event.data !== undefined) {
            context.data = event.data;
          }
        },

        'request db with data': send(
          (_, event) => ({
            type: 'REQUEST',
            command: event.command,
            // data: event.data,
          }),
          { to: (context) => context.dbRef! }
        ),

        'send to message machine': send(
          (_, event) => ({
            type: 'Showing message',
            // status: event.status,
          }),
          { to: (context) => context.msgRef }
        ),
      },
      guards: {
        'delete saved window': (_, event) =>event.command === 'ok',
        'get all saved window': (_, event) => event.command === 'get all data',
        'save window': (_, event) =>
          event.command === 'asd',
      },
    }
  );


const ser = interpret(savedTabListMachine).onTransition(s => console.log(s)).start();

ser.send('LOCAL.OPEN')
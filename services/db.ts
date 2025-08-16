const DB_NAME = 'TriveniClassesDB';
const DB_VERSION = 1;
const STORE_NAME = 'files';

let dbPromise: Promise<IDBDatabase> | null = null;

const openDB = (): Promise<IDBDatabase> => {
    if (dbPromise) {
        return dbPromise;
    }
    
    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
            console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
            dbPromise = null; // Reset promise on error
            reject('IndexedDB error');
        };
    });

    return dbPromise;
};

export const addFile = async (file: Blob): Promise<string> => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const id = crypto.randomUUID();
    
    return new Promise((resolve, reject) => {
        const request = store.add({ id, file });
        transaction.oncomplete = () => resolve(id);
        transaction.onerror = () => {
            console.error('Error adding file to IndexedDB:', transaction.error);
            reject(transaction.error);
        }
    });
};

export const getFile = async (id: string): Promise<Blob | null> => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => {
            resolve(request.result ? request.result.file : null);
        };
        request.onerror = () => {
            console.error('Error getting file from IndexedDB:', request.error);
            reject(request.error);
        };
    });
};

export const deleteFile = async (id: string): Promise<void> => {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise<void>((resolve, reject) => {
        store.delete(id);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => {
            console.error('Error deleting file from IndexedDB:', transaction.error);
            reject(transaction.error);
        }
    });
};
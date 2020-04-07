

const itemDb = (function() {
  const iDb = {};
  let datastore = null;

  /**
   * Open a connection to the datastore.
   */
  iDb.open = function(callback) {
    console.log('open')
    // Database version.
    const version = 1;

    // Open a connection to the datastore.
    const request = indexedDB.open('items', version);

    // Handle datastore upgrades.
    request.onupgradeneeded = function(e) {
      const db = e.target.result;

      e.target.transaction.onerror = iDb.onerror;

      // Delete the old datastore.
      if (db.objectStoreNames.contains('item')) {
        db.deleteObjectStore('item');
      }

      // Create a new datastore.
      var store = db.createObjectStore('item', {
        keyPath: 'timestamp'
      });
    };

    // Handle successful datastore access.
    request.onsuccess = function(e) {
      // Get a reference to the DB.
      datastore = e.target.result;
      
      // Execute the callback.
      callback();
    };

    // Handle errors when opening the datastore.
    request.onerror = iDb.onerror;
  };


  /**
   * Fetch all of the item items in the datastore.
   * @param {function} callback A function that will be executed once the items
   *                            have been retrieved. Will be passed a param with
   *                            an array of the item items.
   */
  iDb.fetchItems = function(callback) {
    console.log('fetch')
    const db = datastore;
    const transaction = db.transaction(['item'], 'readwrite');
    const objStore = transaction.objectStore('item');

    const keyRange = IDBKeyRange.lowerBound(0);
    const cursorRequest = objStore.openCursor(keyRange);

    const items = [];

    transaction.oncomplete = function(e) {
      // Execute the callback function.
      callback(items);
    };

    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;
      
      if (!!result == false) {
        return;
      }
      
      items.push(result.value);

      result.continue();
    };

    cursorRequest.onerror = iDb.onerror;
  };


  /**
   * Create a new item item.
   * @param {string} text The item item.
   */
  iDb.createItem = function(text, callback) {
    console.log('create')
    // Get a reference to the db.
    const db = datastore;

    //TODO: finish the rest of the function here. There's a comment for all the small steps you have to take: 
      
    // Initiate a new transaction.
      const transaction = db.transaction(['item'], 'readwrite');
    // Get the datastore.
      const objStore = transaction.objectStore('item');
    // Create a timestamp for the item item.
      const timestamp = new Date().getTime();
    // Create an object for the item item.
      const item = {
          'text': text,
          'timestamp': timestamp
      };

      console.log(item);
    // Create the datastore request.
      const request = objStore.put(item);
    // Handle a successful datastore put.
      request.onsuccess = function(e) {
          callback(item);
      };
      // Execute the callback function.
      request.onerror = iDb.onerror;
    // Handle errors.

  };


  /**
   * Delete a item item.
   * @param {int} id The timestamp (id) of the item item to be deleted.
   * @param {function} callback A callback function that will be executed if the 
   *                            delete is successful.
   */
  iDb.deleteItem = function(id, callback) {
    const db = datastore;
    const transaction = db.transaction(['item'], 'readwrite');
    const objStore = transaction.objectStore('item');
    
    const request = objStore.delete(id);
    
    request.onsuccess = function(e) {
      callback();
    }
    
    request.onerror = function(e) {
      console.log(e);
    }
  };


  // Export the iDb object.
  return iDb;
}());

export class RTW {
  #serviceUrl;
  #token;
  #ghostId;

  /**
   * 
   * @typedef {Object} GhostParams
   * @property {String} serviceUrl - service URL
   * @property {String} token - user's token
   * @property {String|Number} ghostId
   * 
   * @param {GhostParams} - options to init RTW class
   */
  constructor({
    serviceUrl,
    token,
    ghostId,
  }) {
    this.#serviceUrl = serviceUrl;
    this.#token = token;
    this.#ghostId = ghostId;
  }

  get token() {
    return this.#token;
  }

  get domain() {
    const regExp = /\w[\w-]+\w(?=\.)/i;
    const result = regExp.exec(this.serviceUrl);
    
    if (!result) return;
    
    return result[0];
  }

  get service() {
    const regExp = /(?<=(\w[\w-]+\w\.\w+)\/)(\w[\w-]+\w)/i;
    const result = regExp.exec(this.serviceUrl);
    
    if (!result) return;
    
    return result[0];
  }

  /**
   * ***********
   * STREAMS
   * ***********
   */

  #decodeUint8Array(value) {
    return new TextDecoder('utf-8').decode(value).trim();
  }

  /**
   * Get object and parse it to query string.
   * @param {*} obj 
   * @returns {String} - return query string from the object.
   */
  #objectToKeyValueString(obj) {
    return Object.entries(obj)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  /**
   * Send request and receive readable stream object.
   * @param {String} format - stream data format XML or JSON. XML by default.
   * @returns {ReadableStreamDefaultReader<Uint8Array>}
   */

  async #streamInit() {
    console.log('Stream init');
    try {
      const { body } = await fetch(`${this.#serviceUrl}`, {
        body: `token=${this.token}&objectID=${this.#ghostId}&format=json`,
        headers: {
          'Synx-Cat': '4',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST'
      })
      return body.getReader();
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Receive readable stream object and extract the data from it. If service
   * have Remote JS it will come before data. Remote JS is a URL to JS code
   * that should build the page or element(widget) and visualize incomming data.
   * @param {ReadableStreamDefaultReader<Uint8Array>} reader
   * @param {Function} callback - function that will handle incomming data if Remote JS is missing.
   */
  async #readStream(reader, callback) {
    while(true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log('Stream complete');
        break;
      }

      // Decode received data from the stream
      const decodedValue = this.#decodeUint8Array(value);

      // If service has remoteJS, catch block will be executed.
      // Without remoteJS try block will handle incomming data.
      try {
        const json = JSON.parse(decodedValue);

        if (!callback) {
          // This function is from remoteJS code will handle data.
          displayData(json);
        } else {
          callback(json);
        }

      } catch (_e) {
        if (!callback) {
          // The URL is Base64 encoded, and inside <startJS> tag.
          // We need to decode and remove tags to get URL.
          const decodedRemoteJS = window.atob(decodedValue.slice(9, -10));

          // Create script tag and add source URL to it and append to the DOM.
          const myScript = document.createElement('script');
          myScript.src = decodedRemoteJS;
          document.body.appendChild(myScript);
        } 
      }
    }
  }

  /**
   * Initialize and pass readable stream object to readable stream handler.
   * @typedef {Object} Options
   * @property {String} format - stream data format XML or JSON. XML by default.
   * @property {String} callback - function that will handle incomming data if Remote JS is missing.
   * 
   * @param {Options}
   */
  async receive(callback) {
    const reader = await this.#streamInit();
    await this.#readStream(reader, callback);
  }

  /**
   * 
   * @param {Object} data - data schema should be specified by the service owner.
   */
  async send(data) {
    const dataToSend = this.#objectToKeyValueString(data);
    try {
        await fetch(`${this.#serviceUrl}`, {
        body: `token=${this.#token}&objectID=${this.#ghostId}&${dataToSend}`,
        headers: {
          'Synx-Cat': '1',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST'
      });
    } catch (e) {
      console.error(e);
    }
  }
};
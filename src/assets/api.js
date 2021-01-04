/**
 * @fileoverview API Wrapper
 */

//Imports
import {io} from 'socket.io-client';
import router from '@/router/index';
import store from '@/store/index';

//Instance variables
let socket;

/**
 * Connect to the Core over Web sockets
 */
const connect = () =>
{
  //Connect to the Core
  socket = io(process.env.config.core.url, {
    withCredentials: true,
    rejectUnauthorized: !process.env.config.core.selfSigned
  });

  socket.on('connect_error', ({error}) =>
  {
    //Display popup
    store.commit('showError', error);

    //Log
    console.error(`Socket API Connection Error: ${error.name} (${error.description})`);
  });

  //Register error message handler
  socket.on('error', ({error}) =>
  {
    //Display popup
    store.commit('showError', error);

    //Log
    console.error(`Socket API Error: ${error.name} (${error.description})`);
  });
};

/**
 * API Wrapper
 */
export default {
  sessions: {
    /**
     * Log user in
     * @param {String} username 
     * @param {String} password 
     */
    login(username, password)
    {
      return rest('POST', '/sessions/login', {
        username,
        password
      });
    },
    /**
     * Log user in with OTP
     * @param {String} otp 
     */
    async mfa(otp)
    {
      return (await rest('POST', '/sessions/mfa', {
        otp
      })).valid;
    },
    /**
     * Log user out
     */
    async logout()
    {
      await rest('POST', '/sessions/logout');
    }
  },
  accounts: {
    /**
     * Get all accounts
     */
    all()
    {
      return rest('GET', '/accounts/all');
    },
    /**
     * Get all roles
     */
    async roles()
    {
      return (await rest('GET', '/accounts/roles')).roles;
    },
    /**
     * Create an account
     * @param {String} role
     * @param {String} username 
     * @param {String} password 
     * @param {Boolean} mfa
     */
    async create(role, username, password, mfa)
    {
      return rest('POST', '/accounts', {
        role, username, password, mfa
      });
    },
    impersonate: {
      /**
       * Start impersonating target account
       * @param {String} id 
       * @param {String} name
       */
      async start(id, name)
      {
        //Vuex
        store.commit('showImpersonate', name);

        //API
        await rest('POST', `/accounts/${id}/impersonate/start`);
      },
      /**
       * Stop impersonating target account
       */
      async stop()
      {
        //Vuex
        store.commit('hideImpersonate');

        //API
        await rest('POST', '/accounts/impersonate/stop');
      }
    },
    /**
     * Get an account
     * @param {String} id 
     */
    get(id = 'own')
    {
      return rest('GET', `/accounts/${id}`);
    },
    /**
     * Update an account
     * @param {Object} data 
     * @param {String} data.role
     * @param {String} data.username
     * @param {String} data.password
     * @param {String} data.mfa
     * @param {String} id 
     */
    async update(data, id = 'own')
    {
      const res = await rest('PATCH', `/accounts/${id}`, data);

      return res.otpauth;
    },
    /**
     * Remove an account
     * @param {String} id 
     */
    async remove(id = 'own')
    {
      await rest('DELETE', `/accounts/${id}`);
    }
  },
  files: {
    /**
     * Get all files
     */
    all()
    {
      return rest('GET', '/files/all');
    },
    /**
     * Create a file
     * @param {String} name 
     * @param {String} description
     * @param {String} extension
     * @param {Blob} raw 
     */
    async create(name, description, extension, raw)
    {
      return (await rest('POST', '/files', {
        name,
        description: description == null ? '' : description,
        extension,
        raw
      }, {
        multipart: true
      }))._id;
    },
    /**
     * Get a file's metadata
     * @param {String} id 
     */
    get(id)
    {
      return rest('GET', `/files/${id}`);
    },
    /**
     * Get a raw file
     * @param {String} id 
     */
    raw(id)
    {
      return rest('GET', `/files/${id}/raw`, null, {
        parse: false
      });
    },
    /**
     * Update a file
     * @param {Object} data 
     * @param {String} data.name
     * @param {String} data.description
     * @param {String} data.extension
     * @param {String} id 
     */
    async update(data, id)
    {
      await rest('PATCH', `/files/${id}`, data);
    },
    /**
     * Remove a file
     * @param {String} id
     */
    async remove(id)
    {
      await rest('DELETE', `/files/${id}`);
    }
  },
  trash: {
    /**
     * Get all trash
     */
    all()
    {
      return rest('GET', '/trash/all');
    },
    /**
     * Recover a file
     * @param {String} id
     */
    async recover(id)
    {
      await rest('PUT', `/trash/${id}`);
    },
    /**
     * Remove a file permanently
     * @param {String} id
     */
    async remove(id)
    {
      await rest('DELETE', `/trash/${id}`);
    }
  },
  controllers: {
    /**
     * Get all controllers
     */
    all()
    {
      return rest('GET', '/controllers/all');
    },
    /**
     * Create a controller
     * @param {String} name 
     */
    async create(name)
    {
      const res = await rest('POST', '/controllers', {
        name
      });

      return res._id;
    },
    /**
     * Get a controller's key
     * @param {String} id 
     */
    key(id)
    {
      return rest('GET', `/controllers/${id}/key`);
    },
    /**
     * Get a controller
     * @param {String} id 
     */
    get(id)
    {
      return rest('GET', `/controllers/${id}`);
    },
    /**
     * Update a controller
     * @param {Object} data 
     * @param {String} data.name
     * @param {String} id 
     */
    async update(data, id)
    {
      await rest('PATCH', `/controllers/${id}`, data);
    },
    /**
     * Remove a controller
     * @param {String} id
     */
    async remove(id)
    {
      await rest('DELETE', `/controllers/${id}`);
    }
  },
  machines: {
    /**
     * Get all machines
     */
    all()
    {
      return rest('GET', '/machines/all');
    },
    /**
     * Create a machine
     * @param {String} controller
     * @param {String} name 
     * @param {Array<String>} tags 
     * @param {Number} length 
     * @param {Number} width 
     * @param {Number} height
     */
    async create(controller, name, tags, length, width, height)
    {
      const res = await rest('POST', '/machines', {
        controller, name, tags, length, width, height
      });

      return res._id;
    },
    /**
     * Get a machine
     * @param {String} id 
     */
    get(id)
    {
      return rest('GET', `/machines/${id}`);
    },
    /**
     * Send a command to a machine
     * @param {String} id 
     * @param {String} command 
     */
    async command(id, command)
    {
      //If not connected, connect
      if (socket == null)
      {
        await connect();
      }

      //Send the message
      socket.emit('command', {
        payload: command,
        machine: id
      });
    },
    /**
     * Start executing the specified file on the specified machine
     * @param {String} id 
     * @param {String} file 
     */
    async execute(id, file)
    {
      //If not connected, connect
      if (socket == null)
      {
        await connect();
      }

      //Send the message
      socket.emit('execute', {
        file,
        machine: id
      });
    },
    /**
     * Start streaming output from a machine
     * @param {String} id The machine ID
     */
    async startOutput(id)
    {
      //If not connected, connect
      if (socket == null)
      {
        await connect();
      }

      //Send the message
      socket.emit('startOutput', {
        machine: id
      });
    },
    /**
     * Stop streaming output from a machine
     * @param {String} id The machine ID
     */
    async stopOutput(id)
    {
      //If not connected, connect
      if (socket == null)
      {
        await connect();
      }

      //Send the message
      socket.emit('stopOutput', {
        machine: id
      });
    },
    /**
     * Listen to a machine's output
     * @param {String} id
     * @param {Function} cb The callback to be executed when new output is generated (Executed multiple times)
     */
    async listen(id, cb)
    {
      //If not connected, connect
      if (socket == null)
      {
        await connect();
      }

      //Listen to the socket for the specified machine's output
      socket.on('output', data =>
      {
        if (data.machine == id)
        {
          cb(data.payload);
        }
      });
    },
    /**
     * Update a machine
     * @param {Object} data
     * @param {String} data.role
     * @param {String} data.username
     * @param {String} data.password
     * @param {String} id 
     */
    async update(data, id)
    {
      await rest('PATCH', `/machines/${id}`, data);
    },
    /**
     * Remove a machine
     * @param {String} id
     */
    async remove(id)
    {
      await rest('DELETE', `/machines/${id}`);
    }
  }
};

/**
 * Simplified REST API client
 * @param {String} method HTTP Method
 * @param {String} url Relative URL
 * @param {Object} body Request body
 * @param {Object} options Miscellaneous options
 * @param {Boolean} options.multipart Wether or not to send as `multipart/form-data` (Default is false)
 * @param {Boolean} options.parse Wether or not to parse the response (Default is true)
 * @returns {Promise<Object>}
 */
async function rest(method, url, body, options)
{
  //Default options
  options = {
    multipart: false,
    parse: true,
    ...options
  };

  //Generate request configuration
  const config = {credentials: 'include', method};

  if (body != null && !options.multipart)
  {
    config.body = JSON.stringify(body);
    config.headers = {'Content-Type': 'application/json'};
  }
  else if (body != null && options.multipart)
  {
    //Multipart form data
    const formData = new FormData();

    for (const [key, value] of Object.entries(body))
    {
      formData.append(key, value);
    }

    config.body = formData;
  }

  //Request
  const res = await fetch(`${process.env.config.core.url}/api${url}`, config);
  const arrayBuffer = await res.arrayBuffer();

  //Format output
  let out = arrayBuffer;
  if (arrayBuffer.byteLength > 0 && options.parse)
  {
    try
    {
      //Convert to text
      const text = new TextDecoder().decode(arrayBuffer);

      //Parse JSON
      out = JSON.parse(text);
    }
    catch (error)
    {
      console.error(error);
      return Promise.reject(error);
    }
  }

  //Error
  if (out.error && out.error.name == 'Unrecognized Session')
  {
    router.push('/login');
  }
  else if (out.error)
  {
    //Display popup
    store.commit('showError', out.error);

    //Log
    console.error(`HTTP API Error: ${out.error.name} (${out.error.description})`);

    return Promise.reject(out.error);
  }
  else
  {
    return Promise.resolve(out);
  }
}
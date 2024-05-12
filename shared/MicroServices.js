import fetch from 'isomorphic-fetch';
import { createNotification } from '../src/App.js';
let data;
let ok = false;
let err = null;
function handleResponse(response, isFnDone) {
    if (isFnDone) {
        if (!ok && response.msg) {
            err = response.err;
            createNotification('error', response.msg || response.err);
        } else {
            err = null;
        }
        
        data = { err: err, res: response }
    } else {
        if (!response.ok) {
            err = response.err;
            data = { err: err, msg: response.msg }
                .json()
                .catch(() => {
                    // Couldn't parse the JSON
                    throw new Error(response.status);
                })
                .then(({ message }) => {
                    // Got valid JSON with error response, use it
                    throw new Error(message || response.status);
                });
        } else {
            err = null;
        }
      
        // Successful response, parse the JSON and return the data
        data = { err: err, res: response.json() }
    }

    return data;
}

class Microservices {
    static fetchApi = async (url, requestOptions, fnDone) => {
        /* requestOptions.headers['withCredentials'] = true; */
        if (fnDone) {
            return await fetch(url, requestOptions)
                .then((u) => {
                    ok = u.ok;
                    return u.json();
                })
                .then((resp) => {
                    handleResponse(resp, true);
                    if (fnDone) {
                        // fnDone(ok ? null : data, ok ? data : null);
                        fnDone(err ? err : null, ok ? resp : null);
                    } else { 
                        handleResponse(resp, false);
                    }
                });
        } else {
            return await fetch(url, requestOptions).then(handleResponse);
        }
    };
}

export { Microservices };

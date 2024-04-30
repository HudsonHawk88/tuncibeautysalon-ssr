import { Microservices } from "../../../../shared/MicroServices.js";
const location = typeof window !== "undefined" ? window.location : {};
const szabadnapokUrl = location.origin + "/api/admin/szabadnapok";

export default class Services {
  static listSzabadnapok = (fnDone) => {
    let result = Microservices.fetchApi(
      szabadnapokUrl,
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
      },
      fnDone
    );

    return result;
  };

  static getSzabadnap = (id, fnDone) => {
    let result = Microservices.fetchApi(
      szabadnapokUrl,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          id: id,
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
      },
      fnDone
    );

    return result;
  };

  static addSzabadnap = (szabadnapObj, fnDone) => {
    let result = Microservices.fetchApi(
      szabadnapokUrl,
      {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
        body: JSON.stringify(szabadnapObj),
      },
      fnDone
    );

    return result;
  };

  static editSzabadnap = (szabadnapObj, id, fnDone) => {
    let result = Microservices.fetchApi(
      szabadnapokUrl,
      {
        method: "PUT",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id: id,
        },
        body: JSON.stringify(szabadnapObj),
      },
      fnDone
    );

    return result;
  };

  static deleteSzabadnap = (id, fnDone) => {
    let result = Microservices.fetchApi(
      szabadnapokUrl,
      {
        method: "DELETE",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id: id,
        },
      },
      fnDone
    );

    return result;
  };
}

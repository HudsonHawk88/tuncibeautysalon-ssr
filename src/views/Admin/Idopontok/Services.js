import { Microservices } from "../../../../shared/MicroServices.js";
const location = typeof window !== "undefined" ? window.location : {};
const idopontokUrl = location.origin + "/api/admin/idopontok";
const szolgaltatasokUrl = location.origin + "/api/admin/szolgaltatasok";
const szabadnapokUrl = location.origin + "/api/szabadnapok";

export default class Services {
  static listIdopontok = (fnDone) => {
    let result = Microservices.fetchApi(
      idopontokUrl,
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

  static getIdopont = (id, fnDone) => {
    let result = Microservices.fetchApi(
      idopontokUrl,
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

  static getSzabadIdopontok = (nap, szolgaltatasok, lang, fnDone) => {
    let result = Microservices.fetchApi(
      idopontokUrl +
        `/szabadidopontok?nap=${nap}&szolgaltatasok=${szolgaltatasok}`,
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          lang: lang,
        },
      },
      fnDone
    );

    return result;
  };

  static addIdopont = (idopontObj, fnDone) => {
    let result = Microservices.fetchApi(
      idopontokUrl,
      {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
        body: JSON.stringify(idopontObj),
      },
      fnDone
    );

    return result;
  };

  static editIdopont = (idopontObj, id, fnDone) => {
    let result = Microservices.fetchApi(
      idopontokUrl,
      {
        method: "PUT",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id: id,
        },
        body: JSON.stringify(idopontObj),
      },
      fnDone
    );

    return result;
  };

  static deleteIdopont = (id, lemondasOka, fnDone) => {
    let result = Microservices.fetchApi(
      idopontokUrl,
      {
        method: "DELETE",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id: id,
          ok: lemondasOka,
        },
      },
      fnDone
    );

    return result;
  };

  static getSzolgaltatasok = (fnDone) => {
    let result = Microservices.fetchApi(
      szolgaltatasokUrl,
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

  static getSzabadnapok = (fnDone) => {
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
}

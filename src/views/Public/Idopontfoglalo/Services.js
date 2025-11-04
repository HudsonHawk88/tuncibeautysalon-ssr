import { Microservices } from "../../../../shared/MicroServices.js";
const location = typeof window !== "undefined" ? window.location : {};
const szolgaltatasokUrl = location.origin + "/api/szolgaltatasok";
const idopontokUrl = location.origin + "/api/idopontok";
const szabadnapokUrl = location.origin + "/api/szabadnapok";
const kapcsolatUrl = location.origin + "/api/kapcsolat";

export default class Services {
  // IDOPONTOK START

  static listSzolgaltatasok = (fnDone) => {
    let result = Microservices.fetchApi(
      szolgaltatasokUrl,
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
      },
      fnDone
    );

    return result;
  };

  static getIdopontok = (nap, lang, fnDone) => {
    let result = Microservices.fetchApi(
      idopontokUrl + `?nap=${nap}`,
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

  static foglalas = (foglalasObj, lang, fnDone) => {
    let result = Microservices.fetchApi(
      idopontokUrl,
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          lang: lang,
        },
        body: JSON.stringify(foglalasObj),
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
          "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
      },
      fnDone
    );

    return result;
  };

  static getNyitvatartas = (fnDone) => {
    let result = Microservices.fetchApi(
      kapcsolatUrl + "/nyitvatartasok",
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
      },
      fnDone
    );

    return result;
  };

  static deleteFoglalas = (id, lang, fnDone) => {
    let result = Microservices.fetchApi(
      idopontokUrl,
      {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id: id,
          lang: lang,
        },
      },
      fnDone
    );

    return result;
  };

  // IDOPONTOK END
}

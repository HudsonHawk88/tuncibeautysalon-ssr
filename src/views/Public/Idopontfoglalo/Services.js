import { Microservices } from "../../../../shared/MicroServices.js";
const location = typeof window !== "undefined" ? window.location : {};
const szolgaltatasokUrl = location.origin + "/api/szolgaltatasok";
const idopontokUrl = location.origin + "/api/idopontok";
const unnepnapokUrl = location.origin + "/api/unnepnapok";

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

  static getIdopontok = (nap, szolgaltatas, lang, fnDone) => {
    let result = Microservices.fetchApi(
      idopontokUrl + `?nap=${nap}&szolgaltatas=${szolgaltatas}`,
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

  static getUnnepnapok = (fnDone) => {
    let result = Microservices.fetchApi(
      unnepnapokUrl,
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

  static deleteFoglalas = (id, fnDone) => {
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
        },
      },
      fnDone
    );

    return result;
  };

  // IDOPONTOK END
}

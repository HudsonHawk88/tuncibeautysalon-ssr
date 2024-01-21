import { Microservices } from "../../../../shared/MicroServices";
const location = typeof window !== "undefined" ? window.location : {};
const kapcsolatUrl = location.origin + "/api/admin/kapcsolat";
const orszagokUrl = location.origin + "/api/orszagok";

export default class Services {
  static listKapcsolat = (fnDone) => {
    let result = Microservices.fetchApi(
      kapcsolatUrl,
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

  static getKapcsolat = (id, fnDone) => {
    let result = Microservices.fetchApi(
      kapcsolatUrl,
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

  static addKapcsolat = (roleObj, fnDone) => {
    let result = Microservices.fetchApi(
      kapcsolatUrl,
      {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
        body: JSON.stringify(roleObj),
      },
      fnDone
    );

    return result;
  };

  static editKapcsolat = (roleObj, id, fnDone) => {
    let result = Microservices.fetchApi(
      kapcsolatUrl,
      {
        method: "PUT",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id: id,
        },
        body: JSON.stringify(roleObj),
      },
      fnDone
    );

    return result;
  };

  static deleteKapcsolat = (id, fnDone) => {
    let result = Microservices.fetchApi(
      kapcsolatUrl,
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

  static listOrszagok = (fnDone) => {
    let result = Microservices.fetchApi(
      orszagokUrl,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
      },
      fnDone
    );

    return result;
  };
}

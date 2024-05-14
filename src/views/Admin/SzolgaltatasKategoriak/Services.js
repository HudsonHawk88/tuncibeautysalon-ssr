import { Microservices } from "../../../../shared/MicroServices.js";
const location = typeof window !== "undefined" ? window.location : {};
const szolgUrl = location.origin + "/api/admin/szolgaltataskategoria";

export default class Services {
  static listSzolgaltatasKategoriak = (fnDone) => {
    let result = Microservices.fetchApi(
      szolgUrl,
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://inftechsol.hu:8080",
        },
      },
      fnDone
    );

    return result;
  };

  static getSzolgaltatasKategoria = (id, fnDone) => {
    let result = Microservices.fetchApi(
      szolgUrl,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          id: id,
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
      },
      fnDone
    );

    return result;
  };

  static addSzolgaltatasKategoria = (szolgaltatasObj, fnDone) => {
    let result = Microservices.fetchApi(
      szolgUrl,
      {
        method: "POST",
        cache: "no-cache",
        headers: {
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
        body: szolgaltatasObj,
      },
      fnDone
    );

    return result;
  };

  static editSzolgaltatasKategoria = (szolgaltatasObj, id, fnDone) => {
    let result = Microservices.fetchApi(
      szolgUrl,
      {
        method: "PUT",
        cache: "no-cache",
        headers: {
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id: id,
        },
        body: szolgaltatasObj,
      },
      fnDone
    );

    return result;
  };

  static deleteSzolgaltatasKategoria = (id, fnDone) => {
    let result = Microservices.fetchApi(
      szolgUrl,
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

  static deleteKategoriaKep = (kepObj, fnDone) => {
    let result = Microservices.fetchApi(
      szolgUrl + "/deleteimage",
      {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
        body: JSON.stringify(kepObj),
      },
      fnDone
    );

    return result;
  };
}

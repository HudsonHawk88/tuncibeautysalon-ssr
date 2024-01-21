import { Microservices } from "../../../../shared/MicroServices";
const location = typeof window !== "undefined" ? window.location : {};
const szolgUrl = location.origin + "/api/admin/szolgaltatasok";
const kategoriakUrl = location.origin + "/api/admin/szolgaltataskategoria";

export default class Services {
  static listSzolgaltatasok = (fnDone) => {
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

  static listKategoriak = (fnDone) => {
    let result = Microservices.fetchApi(
      kategoriakUrl,
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

  static getSzolgaltatas = (id, fnDone) => {
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

  static addSzolgaltatas = (szolgaltatasObj, fnDone) => {
    let result = Microservices.fetchApi(
      szolgUrl,
      {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
        body: JSON.stringify(szolgaltatasObj),
      },
      fnDone
    );

    return result;
  };

  static editSzolgaltatas = (szolgaltatasObj, id, fnDone) => {
    let result = Microservices.fetchApi(
      szolgUrl,
      {
        method: "PUT",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id: id,
        },
        body: JSON.stringify(szolgaltatasObj),
      },
      fnDone
    );

    return result;
  };

  static deleteSzolgaltatas = (id, fnDone) => {
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
}

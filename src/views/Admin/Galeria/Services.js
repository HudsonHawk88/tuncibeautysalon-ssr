import { Microservices } from "../../../../shared/MicroServices.js";
const location = typeof window !== "undefined" ? window.location : {};
const galeriaUrl = location.origin + "/api/admin/galeria";
const kategoriakUrl = location.origin + "/api/admin/szolgaltataskategoria";

export default class Services {
  static listGaleriak = (fnDone) => {
    let result = Microservices.fetchApi(
      galeriaUrl,
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

  static getGaleria = (id, fnDone) => {
    let result = Microservices.fetchApi(
      galeriaUrl,
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

  static addGaleria = (galeriaObj, fnDone) => {
    let result = Microservices.fetchApi(
      galeriaUrl,
      {
        method: "POST",
        cache: "no-cache",
        headers: {
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
        body: galeriaObj,
      },
      fnDone
    );

    return result;
  };

  static editGaleria = (galeriaObj, id, fnDone) => {
    let result = Microservices.fetchApi(
      galeriaUrl,
      {
        method: "PUT",
        cache: "no-cache",
        headers: {
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id: id,
        },
        body: galeriaObj,
      },
      fnDone
    );

    return result;
  };

  static deleteGaleria = (selected, fnDone) => {
    let result = Microservices.fetchApi(
      galeriaUrl,
      {
        method: "DELETE",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id: selected.id,
          kategoriaid: selected.kategoriaid,
        },
      },
      fnDone
    );

    return result;
  };

  static deleteGaleriaKep = (kepObj, fnDone) => {
    let result = Microservices.fetchApi(
      galeriaUrl + "/deleteimage",
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

  static getKategoriak = (fnDone) => {
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
}

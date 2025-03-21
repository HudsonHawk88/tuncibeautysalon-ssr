import { Microservices } from "../../../../shared/MicroServices.js";
const location = typeof window !== "undefined" ? window.location : {};
const hirlevelekAdminUrl = location.origin + "/api/admin/hirlevel";

export default class Services {
  // HIRLEVELEK START

  static listHirlevel = (fnDone) => {
    let result = Microservices.fetchApi(
      hirlevelekAdminUrl,
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

  static getHirlevel = (id, fnDone) => {
    let result = Microservices.fetchApi(
      hirlevelekAdminUrl,
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          "Content-Type": "application/json",
          id: id,
        },
      },
      fnDone
    );

    return result;
  };

  static addHirlevel = (data, fnDone) => {
    let result = Microservices.fetchApi(
      hirlevelekAdminUrl,
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
        body: JSON.stringify(data),
      },
      fnDone
    );
    return result;
  };

  static editHirlevel = (data, id, fnDone) => {
    let result = Microservices.fetchApi(
      hirlevelekAdminUrl,
      {
        method: "PUT",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id: id,
        },
        body: JSON.stringify(data),
      },
      fnDone
    );

    return result;
  };

  static deleteHirlevel = (id, fnDone) => {
    let result = Microservices.fetchApi(
      hirlevelekAdminUrl,
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

  static startCron = (id, secret, fnDone) => {
    let result = Microservices.fetchApi(
      hirlevelekAdminUrl + "/addcron",
      {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        headers: {
          // "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id,
          secret,
        }
      },
      fnDone
    );
    return result;
  };

  static pauseCron = (id, secret, fnDone) => {
    let result = Microservices.fetchApi(
      hirlevelekAdminUrl + "/pausecron",
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id,
          secret,
        },
      },
      fnDone
    );
    return result;
  };

  static stopCron = (id, secret, fnDone) => {
    let result = Microservices.fetchApi(
      hirlevelekAdminUrl + "/stopcron",
      {
        method: "DELETE",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id,
          secret,
        },
      },
      fnDone
    );
    return result;
  };

  // HIRLEVELEK END
}

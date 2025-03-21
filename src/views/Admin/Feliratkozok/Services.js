import { Microservices } from "../../../../shared/MicroServices.js";
const location = typeof window !== "undefined" ? window.location : {};
const feliratkozasAdminUrl = location.origin + "/api/admin/feliratkozas";

export default class Services {
  // FELIRATKOZOK START

  static listFeliratkozok = (fnDone) => {
    let result = Microservices.fetchApi(
      feliratkozasAdminUrl,
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

  static getFeliratkozo = (id, fnDone) => {
    let result = Microservices.fetchApi(
      feliratkozasAdminUrl,
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

  static addFeliratkozo = (data, fnDone) => {
    let result = Microservices.fetchApi(
      feliratkozasAdminUrl,
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

  static editFeliratkozo = (data, id, fnDone) => {
    let result = Microservices.fetchApi(
      feliratkozasAdminUrl,
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

  static deleteFeliratkozo = (id, fnDone) => {
    let result = Microservices.fetchApi(
      feliratkozasAdminUrl,
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

  // FELIRATKOZOK END
}

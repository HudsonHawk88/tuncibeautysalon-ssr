import { Microservices } from "../../../../shared/MicroServices.js";
const location = typeof window !== "undefined" ? window.location : {};
const szolgaltatasokUrl = location.origin + "/api/szolgaltatasok";
const szolgKategoriakUrl = location.origin + "/api/szolgaltataskategoria";

export default class Services {
  // SZOLGALTATASOK START

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

  static getSzolgaltatas = (id, fnDone) => {
    let result = Microservices.fetchApi(
      szolgaltatasokUrl,
      {
        method: "GET",
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
  // SZOLGALTATASOK END

  // SZOLGKATEGORIAK START

  static getSzolgaltatasKategoria = (id, fnDone) => {
    let result = Microservices.fetchApi(
      szolgKategoriakUrl,
      {
        method: "GET",
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

  // SZOLGKATEGORIAK END
}

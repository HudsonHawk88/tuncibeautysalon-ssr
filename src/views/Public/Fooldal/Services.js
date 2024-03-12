import { Microservices } from "../../../../shared/MicroServices.js";
const location = typeof window !== "undefined" ? window.location : {};

const bioUrl = location.origin + "/api/bio";
const szolgaltatasokUrl = location.origin + "/api/szolgaltatasok";
const szolgKategoriakUrl = location.origin + "/api/szolgaltataskategoria";

export default class Services {
  // BIO START

  static getBios = (fnDone) => {
    let result = Microservices.fetchApi(
      bioUrl,
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

  // BIO END

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

  // SZOLGALTATASOK END

  // SZOLGAKTAEGORIAK START

  static listSzolgKategoriak = (fnDone) => {
    let result = Microservices.fetchApi(
      szolgKategoriakUrl,
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

  // SZOLGKATEGORIAK END
}

import { Microservices } from "../../../../shared/MicroServices.js";
const location = typeof window !== "undefined" ? window.location : {};
const galeriaUrl = location.origin + "/api/galeria";
const szolgKategoriakUrl = location.origin + "/api/szolgaltataskategoria";

export default class Services {
  // GALERIA START

  static listGaleria = (fnDone) => {
    let result = Microservices.fetchApi(
      galeriaUrl,
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

  // GALERIA END

  // SZOLGKATEGORIAK START

  static listKategoriak = (fnDone) => {
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

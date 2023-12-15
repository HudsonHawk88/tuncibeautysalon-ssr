import { Microservices } from "../../../../shared/MicroServices";
const location = typeof window !== "undefined" ? window.location : {};
const kapcsolatUrl = location.origin + "/api/kapcsolat";

export default class Services {
  // ROLUNK START

  static listKapcsolat = (fnDone) => {
    let result = Microservices.fetchApi(
      kapcsolatUrl,
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

  // ROLUNK END
}

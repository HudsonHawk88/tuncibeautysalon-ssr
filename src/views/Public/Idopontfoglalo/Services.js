import { Microservices } from "../../../../shared/MicroServices";
const location = typeof window !== "undefined" ? window.location : {};
const idopontUrl = location.origin + "/api/idopont";
const szolgaltatasokUrl = location.origin + "/api/szolgaltatasok";

export default class Services {
  // IDOPONTOK START

  static listIdopontok = (fnDone) => {
    let result = Microservices.fetchApi(
      idopontUrl,
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

  // IDOPONTOK END
}

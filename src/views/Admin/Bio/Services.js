import { Microservices } from "../../../../shared/MicroServices.js";
const location = typeof window !== "undefined" ? window.location : {};
const bioUrl = location.origin + "/api/admin/bio";

export default class Services {
  static listBio = (fnDone) => {
    let result = Microservices.fetchApi(
      bioUrl,
      {
        method: "GET",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
      },
      fnDone
    );

    return result;
  };

  static getBio = (id, fnDone) => {
    let result = Microservices.fetchApi(
      bioUrl,
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

  static addBio = (bioObj, fnDone) => {
    let result = Microservices.fetchApi(
      bioUrl,
      {
        method: "POST",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          // "Accept": "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
        },
        body: JSON.stringify(bioObj),
      },
      fnDone
    );

    return result;
  };

  static editBio = (bioObj, id, fnDone) => {
    let result = Microservices.fetchApi(
      bioUrl,
      {
        method: "PUT",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          // "Accept": "application/json",
          // "Access-Control-Allow-Origin": "http://192.168.11.64:3000",
          id: id,
        },
        body: JSON.stringify(bioObj),
      },
      fnDone
    );

    return result;
  };

  static deleteBio = (id, fnDone) => {
    let result = Microservices.fetchApi(
      bioUrl,
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

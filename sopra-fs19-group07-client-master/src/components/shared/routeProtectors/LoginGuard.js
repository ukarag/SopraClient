import React from "react";
import { Redirect } from "react-router-dom";
import {getDomain} from "../../../helpers/getDomain";

/**
 * @Guard
 * @param props
 */export const LoginGuard = props => {
  if (localStorage.getItem("token")) {
    fetch(`${getDomain()}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        userToken: localStorage.getItem("token")
      }
    })
        .then(response => {
          switch (response.status) {
            case 404:
              localStorage.removeItem("token");
              return props.children;
            case 200:
              return <Redirect to={"/game"} />;
            default:
              alert(`Unexpected HTTP status: ${response.status}`);
              localStorage.removeItem("token");
              return props.children;
          }
        })
        .catch(err => {
          console.log(err);
          alert("Something went wrong fetching the users: " + err);
        });
  }
  if (localStorage.getItem("token")) {
    return <Redirect to={"/game"} />;
  }
  return props.children;
};

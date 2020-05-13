import React from "react";
import { Redirect } from "react-router-dom";
import {getDomain} from "../../../helpers/getDomain";

/**
 * @Guard
 * @param props
 */export const GameGuard = props => {
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
              return <Redirect to={"/login"} />;
            case 200:
              return props.children;
            default:
              alert(`Unexpected HTTP status: ${response.status}`);
              localStorage.removeItem("token");
              return <Redirect to={"/login"} />;
          }
        })
        .catch(err => {
          console.log(err);
          alert("Something went wrong fetching the users: " + err);
        });
  }
  if (localStorage.getItem("token")) {
    return props.children;
  }
  return <Redirect to={"/login"} />;
};
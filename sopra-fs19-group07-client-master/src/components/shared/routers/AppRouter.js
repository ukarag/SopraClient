import React from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { GameGuard } from "../routeProtectors/GameGuard";
import GameRouter from "./GameRouter";
import ProfileRouter from "./ProfileRouter";
import RoomRouter from "./RoomRouter";
import { LoginGuard } from "../routeProtectors/LoginGuard";
import Login from "../../login/Login";
import Register from "../../register/Register";
import Lobby from "../../lobby/Lobby";
import Rules from "../../rules/Rules";
import Godcards from "../../rules/Godcards";
import CreateRouter from "./CreateRouter";
/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/dashboard".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /dashboard renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
class AppRouter extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <div>
            <Route
                path="/game"
                render={() => (
                    <GameGuard>
                        <GameRouter base={"/game"} />
                    </GameGuard>
                )}
            />
            <Route
                path="/profile"
                render={() => (
                    <GameGuard>
                        <ProfileRouter base={"/profile"} />
                    </GameGuard>
                )}
            />
            <Route
              path="/login"
              exact
              render={() => (
                <LoginGuard>
                  <Login />
                </LoginGuard>
              )}
            />
            <Route
                path="/register"
                exact
                render={() => (
                    <LoginGuard>
                        <Register />
                    </LoginGuard>
                )}
            />
            <Route
              path="/lobby"
              exact
              render={() => (
                  <GameGuard>
                      <Lobby />
                  </GameGuard>
              )}
            />
            <Route
                path="/createRoom"
                render={() => (
                    <GameGuard>
                        <CreateRouter base={"/createRoom"} />
                    </GameGuard>
                )}
            />
            <Route
                path="/rules"
                exact
                render={() => (
                    <GameGuard>
                        <Rules />
                    </GameGuard>
                )}
            />
              <Route
                  path="/godcards"
                  exact
                  render={() => (
                      <GameGuard>
                          <Godcards />
                      </GameGuard>
                  )}
              />
              <Route
                  path="/room"
                  render={() => (
                      <GameGuard>
                          <RoomRouter base={"/room"} />
                      </GameGuard>
                  )}
              />
            <Route path="/" exact render={() => <Redirect to={"/game"} />} />
          </div>
        </Switch>
      </BrowserRouter>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default AppRouter;

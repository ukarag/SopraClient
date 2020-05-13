import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import Dashboard from "../../dashboard/Dashboard";
import StartGame from "../../game/StartGame";
import WinningPage from "../../game/EndPage";
import Game from "../../game/Game";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class GameRouter extends React.Component {
  render() {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
      <Container>
        <Route
          exact
          path={`${this.props.base}/dashboard`}
          render={() => <Dashboard />}
        />
        <Route
            exact
            path={`${this.props.base}/start`}
            render={() =>  <StartGame />}
        />
        <Route
            exact
            path={`${this.props.base}/play`}
            render={() =>  <Game />}
          />
          <Route
              exact
              path={`${this.props.base}/end`}
              render={() =>  <WinningPage />}
          />
        <Route
          exact
          path={`${this.props.base}`}
          render={() => <Redirect to={`${this.props.base}/dashboard`} />}
        />
      </Container>
    );
  }
}
/*
* Don't forget to export your component!
 */
export default GameRouter;

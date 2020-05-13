import React from "react";
import styled from "styled-components";
import { Redirect, Route } from "react-router-dom";
import Room from "../../lobby/Room";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class RoomRouter extends React.Component {
    render() {
        return (
            <Container>
                <Route
                    exact
                    path={`${this.props.base}/:id` }
                    render={() => <Room />}
                />

                <Route
                    exact
                    path={`${this.props.base}`}
                    render={() => <Redirect to={"/lobby"} />}
                />
            </Container>
        );
    }
}
/*
* Don't forget to export your component!
 */
export default RoomRouter;

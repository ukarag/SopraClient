import React from "react";
import styled from "styled-components";
import { Route } from "react-router-dom";
import ChooseGodcards from "../../lobby/ChooseGodcards";
import NewRoom from "../../lobby/NewRoom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

class CreateRouter extends React.Component {
    render() {
        return (
            <Container>
                <Route
                    exact
                    path={`${this.props.base}/:id` }
                    render={() => <ChooseGodcards />}
                />

                <Route
                    exact
                    path={`${this.props.base}`}
                    render={() => <NewRoom />}
                />
            </Container>
        );
    }
}
/*
* Don't forget to export your component!
 */
export default CreateRouter;

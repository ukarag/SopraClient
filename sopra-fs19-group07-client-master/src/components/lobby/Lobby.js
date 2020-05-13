import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { getDomain } from "../../helpers/getDomain";
import Room from "../../views/models/Room";
import { Button, CreateButton, ExitButton } from "../../views/design/Button";
import { Spinner } from "../../views/design/Spinner";
import {FormContainer,BaseContainer, ButtonContainer, Title} from "../../views/design/General";
import { Form, ListContainer, LogoutContainer } from "../../views/design/PreGameDesign";

const Rooms = styled.ul`
  height: 170px;
  list-style: none;
  overflow: auto;
  padding-left: 0;
`;

class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: null,
            gameName: null,
            player1: null,
            player2: null,
            withGodcards: false
        };
    }

    logout() {
        fetch(`${getDomain()}/users/logout`, {
            method: "POST",
            headers: {
                userToken: localStorage.getItem("token")
            }
        })
          .then(response => {
              switch (response.status) {
                  case 404:
                      localStorage.removeItem("token");
                      this.props.history.push(`/login`);
                      break;
                  case 204:
                      localStorage.removeItem("token");
                      this.props.history.push("/login");
                      break;
                  default:
                      alert(`Unexpected HTTP status: ${response.status}`);
                      this.props.history.push(`/login`);
                      break;
              }
          })
          .catch(err => {
              console.log(err);
              alert("Something went wrong fetching the users: " + err);
          });
    }

    componentDidMount() {
        this.interval = setInterval(() => this.getGames(), 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async getGames() {
        let resStatus = 0;
        fetch(`${getDomain()}/games`, {
            method: "GET"
        })
            .then(response => {
                resStatus = response.status;
                return response.json()})
            .then(rooms => {
                switch (resStatus) {
                    case 200:
                        this.setState({rooms});
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${resStatus}`);
                        this.props.history.push(`/game`);
                        break;
                }
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong fetching the rooms: " + err);
            });
    }

    createRoom(){
        this.props.history.push(`/createRoom`);
    }

    goBack(){
        this.props.history.push(`/game`);
    }

    join(id){
        fetch(`${getDomain()}/games/join/${id}`, {
            method: "PUT",
            headers: {
                userToken: localStorage.getItem("token")
            }
        })
            .then(response => {
                switch (response.status) {
                    case 409:
                        this.props.history.push(`/lobby`);
                        break;
                    case 404:
                        this.props.history.push(`/lobby`);
                        break;
                    case 200:
                        this.props.history.push(`/room/${id}`);
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${response.status}`);
                        this.props.history.push(`/lobby`);
                        break;
                }
            })
            .catch(err => {
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                } else {
                    alert(`Something went wrong during the change: ${err.message}`);
                }
            });
    }

    render() {
        return (
            <BaseContainer>
                <LogoutContainer>
                    <ExitButton
                        width="100px"
                        onClick={() => {
                            this.logout();
                        }}
                    >
                        Logout
                    </ExitButton>
                </LogoutContainer>
                <FormContainer>
                    <Title><h2>Lobby </h2></Title>
                    <Form>
                        {!this.state.rooms ? (
                            <Spinner />
                        ) : (
                            <div>
                                {
                                    this.state.rooms.length===0 ?
                                        <h3>No room available. Create a new one! </h3>:
                                        [
                                            <h3>Join a free room and start playing </h3>,
                                            <Rooms>
                                            {this.state.rooms.map(game => {

                                                    if (game.players.length<2 && game.stage===0) {
                                                        return (
                                                            <ListContainer
                                                                key={game.id}
                                                                onClick={() =>{ this.join(game.id);}}
                                                            >
                                                                <Room game={game} />
                                                            </ListContainer>
                                                        )
                                                    }
                                                })}
                                    </Rooms>
                                        ]
                                }
                                <ButtonContainer>
                                    <CreateButton
                                        width="200px"
                                        onClick={() => {
                                            this.createRoom();
                                        }}
                                    >
                                        Create a new room
                                    </CreateButton>
                                </ButtonContainer>
                                <ButtonContainer>
                                    <Button
                                        width="200px"
                                        onClick={() => {
                                            this.goBack();
                                        }}
                                    >
                                        Dashboard
                                    </Button>
                                </ButtonContainer>
                            </div>
                        )}
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(Lobby);

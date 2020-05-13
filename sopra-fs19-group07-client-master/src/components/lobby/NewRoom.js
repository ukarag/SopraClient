import React from "react";
import styled from "styled-components";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import {Button, CreateButton, ExitButton} from "../../views/design/Button";
import { FormContainer,BaseContainer, ButtonContainer, Title} from "../../views/design/General";
import {InputField, Label, BasicForm, LogoutContainer} from "../../views/design/PreGameDesign";

const Form = styled(BasicForm)`
  justify-content: center;
  margin-top: 50px;
`;

/**
 * @Class
 */
class NewRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameName: null,
            withGodcards: false,
            userId: null
        };
    }

    createRoom() {
        let resStatus = 0;
        fetch(`${getDomain()}/games`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gameName: this.state.gameName,
                player1: localStorage.getItem("token"),
                withGodcards: this.state.withGodcards
            })
        })
            .then(response => {
                resStatus = response.status;
                return response.text()})
            .then( res => {
                switch (resStatus) {
                    case 201:
                        if (this.state.withGodcards) {
                            this.props.history.push(`/createRoom/godcards`);
                        } else {
                            this.props.history.push(`/room/${res}`);
                        }
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${resStatus}`);
                        this.props.history.push(`/lobby`);
                        break;
                }
            })
            .catch(err => {
                if (err.message.match(/Failed to fetch/)) {
                    alert("The server cannot be reached. Did you start it?");
                } else {
                    alert(`Something went wrong during the register: ${err.message}`);
                }
            });
    }

    go_back() {
        this.props.history.push(`/lobby`);
    }

    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */
    handleInputChange(key, value) {
        this.setState({ [key]: value });
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
        let resStatus = 0;
        fetch(`${getDomain()}/users/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                userToken: localStorage.getItem("token")
            }
        })
            .then(response => {
                resStatus = response.status;
                return response.text()})
            .then( res => {
                switch (resStatus) {
                    case 404:
                        this.props.history.push(`/game`);
                        break;
                    case 200:
                        this.setState({userId: res});
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${resStatus}`);
                        this.props.history.push(`/game`);
                        break;
                }
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong fetching the users: " + err);
            });
    }

    checkGodcard(){
        if (this.state.withGodcards === false){this.setState({withGodcards : true})}
        else {this.setState({withGodcards : false})}
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
                    <Title><h2>Create New Room</h2></Title>
                    <Form>
                        <Label>Room Name</Label>
                        <InputField
                            placeholder="Enter here.."
                            onChange={e => {
                                this.handleInputChange("gameName", e.target.value);
                            }}
                        />
                        <Label> With Godcards? <input type={"checkbox"} onChange= {() => {this.checkGodcard();}}/> </Label>
                        <ButtonContainer>
                            <CreateButton
                                disabled={!this.state.gameName }
                                width="150px"
                                onClick={() => {
                                    this.createRoom();
                                }}
                            >
                                Create & Join
                            </CreateButton>
                        </ButtonContainer>
                        <ButtonContainer>
                            <Button
                                width="150px"
                                onClick={() => {
                                    this.go_back();
                                }}
                            >
                                Cancel
                            </Button>
                        </ButtonContainer>
                    </Form>
                </FormContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(NewRoom);

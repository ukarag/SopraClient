import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { getDomain } from "../../helpers/getDomain";
import { Button, ExitButton, ExitCrossButton } from "../../views/design/Button";
import { BaseContainer } from "../../views/design/General";
import { LogoutContainer,ProfileContainer,ProfileOuterContainer,ExitContainer } from "../../views/design/PreGameDesign";

const TableContainer = styled.div`
  padding-left: 37px;
  padding-right: 37px;
  margin-top: 2em;
`;

export const BottomButtonContainer = styled.div`
  display: inline-flex;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: -85px;
`;

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            status: null,
            creationDate: null,
            birthday: null,
            isMe: false
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

    edit() {
        this.props.history.push(`/profile/${this.props.match.params.id}/edit`);
    }

    getBack() {
        this.props.history.push("/game/dashboard");
    }

    componentDidMount() {
        let resStatus = 0;
        fetch(`${getDomain()}/users/${this.props.match.params.id}`, {
            method: "GET",
            headers: {
                userToken: localStorage.getItem("token")
            }
        })
            .then(response => {
                resStatus = response.status;
                return response.json()})
            .then( user => {
                switch (resStatus) {
                    case 404:
                        this.setState( {wrong_input: true});
                        this.props.history.push(`/game`);
                        break;
                    case 200:
                        this.setState({username: user.username});
                        this.setState({status: user.status});
                        this.setState({creationDate: user.creationDate});
                        this.setState({birthday: user.birthday});
                        this.setState({isMe: user.isMe});
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

    render() {
        const style = {
            display: this.state.isMe ? '' : 'none'
        };
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
                <ProfileOuterContainer>
                    <ExitContainer>
                        <ExitCrossButton
                          onClick={() => {
                              this.getBack();
                          }}
                        >
                            x
                        </ExitCrossButton>
                    </ExitContainer>
                    <ProfileContainer>
                        <div/>
                        {this.state.isMe ?
                            <h2>My Profile </h2>:
                            <h2>Profile of {this.state.username} </h2>
                        }
                        <div/>
                        <TableContainer>
                            <table
                                width="300px"
                            >
                                <tbody>
                                <tr>
                                    <td>Username:</td>
                                    <td><b>{this.state.username}</b></td>
                                </tr>
                                <tr>
                                    <td>Status:</td>
                                    <td><b>{this.state.status==="ONLINE" ? "online":"offline"}</b></td>
                                </tr>
                                <tr>
                                    <td>Creation date:</td>
                                    <td><b>{this.state.creationDate}</b></td>
                                </tr>
                                <tr>
                                    <td>Birthday:</td>
                                    <td><b>{this.state.birthday}</b></td>
                                </tr>
                                </tbody>
                                <tfoot>
                                <tr>
                                </tr>
                                </tfoot>
                            </table>
                        </TableContainer>
                        <BottomButtonContainer
                            style={style}
                        >
                            <Button
                                width="150px"
                                onClick={() => {
                                    this.edit();
                                }}
                            >
                                Settings
                            </Button>
                        </BottomButtonContainer>
                    </ProfileContainer>
                </ProfileOuterContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(Profile);

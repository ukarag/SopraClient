import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { getDomain } from "../../helpers/getDomain";
import Player from "../../views/models/Player";
import {FormContainer,BaseContainer, ButtonContainer, Title} from "../../views/design/General";
import { Form,ListContainer,LogoutContainer } from "../../views/design/PreGameDesign";
import { Button,ExitButton} from "../../views/design/Button";
import { Spinner } from "../../views/design/Spinner";

const Users = styled.ul`
  height: 200px;
  list-style: none;
  overflow: auto;
  padding-left: 0;
  color: white;
`;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null
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

  lobby(){
    this.props.history.push("/lobby");
  }

  componentDidMount() {
    this.interval = setInterval(() => this.getUsers(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getUsers() {
    let resStatus = 0;
    fetch(`${getDomain()}/users`, {
      method: "GET"
    })
      .then(response => {
        resStatus = response.status;
        return response.json()})
      .then(async users => {
        switch (resStatus) {
          case 404:
            this.props.history.push(`/login`);
            break;
          case 200:
            this.setState({ users });
            if (users.filter(user => user.token === localStorage.getItem("token"))==null) {
              localStorage.removeItem("token");
              this.props.history.push(`/login`);
            }
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
              <Title><h2>All users from Santorini</h2></Title>
              <Form>
                  {!this.state.users ? (
                      <Spinner />
                  ) : (
                      <div>
                          <Users>
                              {this.state.users.map(user => {
                                  if (user.status==="ONLINE") {
                                      return (
                                          <ListContainer
                                              key={user.id}
                                              onClick={() => {
                                                  this.props.history.push(`/profile/${user.id}`);
                                              }}
                                          >
                                              <Player user={user} />
                                          </ListContainer>
                                      );
                                  }
                              })}
                              {this.state.users.map(user => {
                                  if (user.status==="OFFLINE") {
                                      return (
                                          <ListContainer
                                              key={user.id}
                                              onClick={() => {
                                                  this.props.history.push(`/profile/${user.id}`);
                                              }}
                                          >
                                              <Player user={user} />
                                          </ListContainer>
                                      );
                                  }
                              })}
                          </Users>
                          <ButtonContainer>
                              <Button
                                  width="200px"
                                  onClick={() => {
                                      this.lobby();
                                  }}
                              >
                                  Lobby
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

export default withRouter(Dashboard);

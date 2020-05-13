import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { getDomain } from "../../helpers/getDomain";
import { Button,CreateButton,ExitButton,ExitCrossButton,SettingsButton,SettingsCreateButton } from "../../views/design/Button";
import { ButtonContainer,BaseContainer} from "../../views/design/General";
import { InputField,LogoutContainer,ProfileOuterContainer,ProfileContainer,ExitContainer } from "../../views/design/PreGameDesign";

const Form = styled.div`
  height: 165px;
  padding-left: 37px;
  padding-right: 37px;
  margin-top: -10px;
`;

const Setting = styled.div`
  height: 30px;
  padding-left: 37px;
  padding-right: 37px;
  margin-top: -10px;
`;

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            newUsername: null,
            birthday: null,
            usernameEdit: false,
            haveBirthday: false,
            birthDay: "",
            birthMonth: "",
            birthYear: "",
            alreadyUsed: false
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

    handleInputChange(value) {
        this.setState({ newUsername: value });
    }

    handleChange(key) {
        return e => {
            this.setState({[key]: e.target.value});
        };
    }

    editBirthday() {
        this.setState({haveBirthday: true});
        let today = new Date();
        this.setState({birthDay: today.getDate()});
        this.setState({birthMonth: today.getMonth()+1});
        this.setState({birthYear: today.getFullYear()});
    }

    deleteBirthday() {
        this.setState({haveBirthday: false});
    }

    change() {
        let newBirthday = null;
        if (this.state.haveBirthday) {
            let dayStr = this.state.birthDay.toString();
            let monthStr = this.state.birthMonth.toString();
            newBirthday = dayStr + "." + monthStr + "." + this.state.birthYear.toString();
        }
        if (this.state.newUsername==="") {
            this.setState({newUsername: null})
        }
        fetch(`${getDomain()}/users`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                userToken: localStorage.getItem("token")
            },
            body: JSON.stringify({
                username: this.state.newUsername,
                birthday: newBirthday
            })
        })
            .then(response => {
                switch (response.status) {
                    case 404:
                        this.props.history.push(`/game`);
                        break;
                    case 409:
                        this.setState( {alreadyUsed: true});
                        this.props.history.push(`/profile/${this.props.match.params.id}/edit`);
                        break;
                    case 204:
                        this.props.history.push(`/profile/${this.props.match.params.id}`);
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${response.status}`);
                        this.props.history.push(`/profile/${this.props.match.params.id}`);
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
                        this.props.history.push(`/profile/${this.props.match.params.id}`);
                        break;
                    case 200:
                        if (user.isMe) {
                            this.setState({username: user.username});
                            this.setState({birthday: user.birthday});
                            if (this.state.birthday===null) {
                                this.setState({haveBirthday: false})
                            } else {
                                this.setState({haveBirthday: true});
                                let dateParts =this.state.birthday.split(`.`);
                                this.setState({birthDay: dateParts[0]});
                                this.setState({birthMonth: dateParts[1]});
                                this.setState({birthYear: dateParts[2]})
                            }
                        } else {
                            this.props.history.push(`/profile/${this.props.match.params.id}`)
                        }
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${resStatus}`);
                        this.props.history.push(`/register`);
                        break;
                }
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong fetching the users: " + err);
            });
    }

    render() {
        let today = new Date();
        const dayArray = Array.from(new Array(31),(val,index)=>index+1);
        const monthArray = Array.from(new Array(12),(val,index)=>index+1);
        const yearArray = Array.from(new Array(125),(val,index)=>index+today.getFullYear()-124);

        let inputAnswer = this.state.alreadyUsed ?
            <p style={{color:'#990000'}}>Username already taken</p>: <p/>;

        let usernameRender = this.state.usernameEdit ?
            <Setting>
                <InputField
                    placeholder="Enter here.."
                    onChange={e => {
                        this.handleInputChange(e.target.value);
                    }}
                />
                <SettingsButton
                    width="70px"
                    onClick={() => {
                        this.setState({usernameEdit: false});
                    }}
                >
                    Return
                </SettingsButton>
            </Setting> :
            <Setting>
                <p style={{color:'white'}}> <b>
                    <SettingsCreateButton
                        width="50px"
                        onClick={() => {
                            this.setState({usernameEdit: true});
                        }}
                    >
                        New
                    </SettingsCreateButton>
                    {this.state.username}
                </b></p>
            </Setting>;

        let birthdaySet = this.state.haveBirthday ?
            <Setting>
                <select
                    name="dayValue"
                    value={this.state.birthDay}
                    style={{background:'#226B53', color: 'white'}}
                    onChange={this.handleChange("birthDay") }
                >
                    {dayArray.map((d) => <option key={d}>{d}</option>)}
                </select>
                .
                <select
                    name="monthValue"
                    value={this.state.birthMonth}
                    style={{background:'#226B53', color: 'white'}}
                    onChange={this.handleChange("birthMonth") }>
                    {monthArray.map(m => <option key={m}>{m}</option>)}
                </select>
                .
                <select
                    name="yearValue"
                    value={this.state.birthYear}
                    style={{background:'#226B53', color: 'white'}}
                    onChange={this.handleChange("birthYear") }>
                    {yearArray.map(y => <option key={y}>{y}</option>)}
                </select>
                <SettingsButton
                    width="75px"
                    onClick={() => {
                        this.deleteBirthday();
                    }}
                >
                    Delete
                </SettingsButton>
            </Setting> :
            <Setting>
                <SettingsCreateButton
                    width="50px"
                    onClick={() => {
                        this.editBirthday();
                    }}
                >
                    Add
                </SettingsCreateButton>
            </Setting>
        ;

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
                        <h2>Profile Settings</h2>
                        <Form>
                            <div>{inputAnswer}</div>
                            <p>Username</p>
                            {usernameRender}
                            <p>Birthday</p>
                            {birthdaySet}
                        </Form>
                        <ButtonContainer>
                            <CreateButton
                                width="150px"
                                onClick={() => {
                                    this.change();
                                }}
                            >
                                Change
                            </CreateButton>
                        </ButtonContainer>
                        <ButtonContainer>
                            <Button
                                width="150px"
                                onClick={() => {
                                    this.props.history.push(`/profile/${this.props.match.params.id}`);
                                }}
                            >
                                Cancel
                            </Button>
                        </ButtonContainer>
                    </ProfileContainer>
                </ProfileOuterContainer>
            </BaseContainer>
        )
    }
}

export default withRouter(Profile);

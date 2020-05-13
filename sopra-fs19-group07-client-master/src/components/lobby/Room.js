import React from "react";
import {getDomain} from "../../helpers/getDomain";
import {withRouter} from "react-router-dom";
import {Button, ExitButton, RulesButton} from "../../views/design/Button";
import {Spinner} from "../../views/design/Spinner";
import {BaseContainer, ButtonContainer, Title} from "../../views/design/General";
import {
    Form,
    PlayerContainer,
    RoomContainer,
    SpinnerContainer,
    TopButtonContainer,
    WorkerContainer
} from "../../views/design/GameDesign";
import {OuterContainer} from "../../views/design/GameDesign";
import worker11 from "../../pictures/buildings/worker11.png";
import worker21 from "../../pictures/buildings/worker21.png";

class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameName: null,
            player1: null,
            player2: null,
            withGodcards: false,
            x: null,
            y: null,
            level: null,
            field: null,
        };
    }

    exit() {
        fetch(`${getDomain()}/games/exit/${this.props.match.params.id}`, {
            method: "PUT",
            headers: {
                userToken: localStorage.getItem("token")
            }
        })
            .then(response => {
                switch (response.status) {
                    case 404:
                        this.props.history.push(`/lobby`);
                        break;
                    case 204:
                        this.props.history.push(`/lobby`);
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

    start() {
        fetch(`${getDomain()}/games/start/${this.props.match.params.id}`, {
            method: "PUT"
        })
            .then( response => {
                switch (response.status) {
                    case 404:
                        this.props.history.push(`/lobby`);
                        break;
                    case 204:
                        this.props.history.push("/game/start");
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

    fastForward() {
        fetch(`${getDomain()}/games/fast_forward/${this.props.match.params.id}`, {
            method: "PUT"
        })
            .then( response => {
                switch (response.status) {
                    case 404:
                        this.props.history.push(`/lobby`);
                        break;
                    case 204:
                        this.props.history.push("/game/play");
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

    componentDidMount() {
        this.interval = setInterval(() => this.getGame(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async getGame() {
        let resStatus = 0;
        fetch(`${getDomain()}/games/${this.props.match.params.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                resStatus = response.status;
                return response.json()})
            .then( game => {
                switch (resStatus) {
                    case 404:
                        this.props.history.push(`/lobby`);
                        break;
                    case 200:
                        switch (game.stage) {
                            case 1: this.start();
                                break;
                            case 2: this.props.history.push(`/game/play`);
                                break;
                            default: break;
                        }
                        this.setState({gameName: game.gameName});
                        this.setState({player1: null});
                        this.setState({player2: null});
                        game.players.map(player => {
                            if (player.number === 1) {
                                this.setState({player1: player.user.username});
                            } else {
                                this.setState({player2: player.user.username});
                            }
                        });
                        this.setState({withGodcards: game.withGodcards});
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${resStatus}`);
                        this.props.history.push(`/lobby`);
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
                <TopButtonContainer>
                    <div/>
                    <ExitButton
                        width="100px"
                        onClick={() => {
                            this.exit();
                        }}
                    >
                        Exit
                    </ExitButton>
                </TopButtonContainer>
                <OuterContainer>
                    <PlayerContainer>
                        <WorkerContainer>
                            <img
                                src={worker11}
                                alt=""
                                height={80}
                            />
                        </WorkerContainer>
                        {!this.state.player1 ? (
                            <SpinnerContainer>
                                <Spinner/>
                            </SpinnerContainer>
                        ) : (
                            <div>
                                <h2>{this.state.player1}</h2>
                            </div>
                        )}
                    </PlayerContainer>
                    <RoomContainer>
                        <Form>
                            <Title><h1>Room: {this.state.gameName}</h1></Title>
                            <Title>
                                {!this.state.player1 || !this.state.player2 ?
                                    <h2>Waiting for second player </h2> :
                                    <h2>Room full! Let's start! </h2>
                                }
                            </Title>
                            <div>
                                GAME RULES
                            </div>
                            <div>
                                Welcome to Santorini! If You want to read the rules, click on the "RULES" - button. Enjoy :)
                            </div>
                        </Form>
                        <ButtonContainer>
                            <RulesButton
                                width="150px"
                                onClick={() => {
                                    this.props.history.push("/rules");
                                }}
                            >
                                Rules
                            </RulesButton>
                        </ButtonContainer>
                        <ButtonContainer>
                            <Button
                                style={{display: this.state.withGodcards ? '' : 'none'}}
                                disabled={!(this.state.player1 && this.state.player2)}
                                width="150px"
                                onClick={() => {
                                    this.fastForward();
                                }}
                            >
                                Fast Forward
                            </Button>
                            <Button
                                disabled={!(this.state.player1 && this.state.player2)}
                                width="150px"
                                onClick={() => {
                                    this.start();
                                }}
                            >
                                Start
                            </Button>
                        </ButtonContainer>
                    </RoomContainer>
                    <PlayerContainer>
                        <WorkerContainer>
                            <img
                                src={worker21}
                                alt=""
                                height={80}
                            />
                        </WorkerContainer>
                        {!this.state.player2 ? (
                            <SpinnerContainer>
                                <Spinner/>
                            </SpinnerContainer>
                        ) : (
                            <div>
                                <h2>{this.state.player2}</h2>
                            </div>
                        )}
                    </PlayerContainer>
                </OuterContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(Room);

import React from "react";
import styled from "styled-components";
import {getDomain} from "../../helpers/getDomain";
import {withRouter} from "react-router-dom";
import {Button, ExitButton, RulesButton} from "../../views/design/Button";
import {Spinner} from "../../views/design/Spinner";
import {BaseContainer, ButtonContainer} from "../../views/design/General";
import {
    OuterContainer,
    PlayerContainer,
    CardOuterContainer,
    GameContainer,
    GameOuterContainer,
    TextContainer,
    SpinnerContainer, WorkerContainer, TopButtonContainer
} from "../../views/design/GameDesign";
import {Field, Level, SelectedField, Worker} from "../../views/design/Fields";
import "../../views/design/grid.css";
import gods from "../../repos/Gods";
import level1 from "../../pictures/buildings/level1.png";
import level2 from "../../pictures/buildings/level2.png";
import level3 from "../../pictures/buildings/level3.png";
import level4 from "../../pictures/buildings/level4.png";
import level40 from "../../pictures/buildings/level40.png";
import level41 from "../../pictures/buildings/level41.png";
import level42 from "../../pictures/buildings/level42.png";
import worker11 from "../../pictures/buildings/worker11.png";
import worker12 from "../../pictures/buildings/worker12.png";
import worker21 from "../../pictures/buildings/worker21.png";
import worker22 from "../../pictures/buildings/worker22.png";

const CardTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
  background: rgba(199,208,199,0.7);  
  color: black;
  padding: 5px;
`;

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameName: null,
            player1: null,
            player2: null,
            player1Godcard: null,
            player2Godcard: null,
            withGodcards: false,
            currentPlayer: null,
            currentWorker: null,
            board: [],
            myNumber: null,
            myTurn: null,
            myGodcard: null,
            chosenWorker: null,
            exit: false
        };
    }

    exit(){
        if (window.confirm("Are you sure you want to exit the game?")) {
            fetch(`${getDomain()}/games`, {
                method: "DELETE",
                headers: {
                    userToken: localStorage.getItem("token")
                }
            })
                .then(response => {
                    switch (response.status) {
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
                    console.log(err);
                    alert("Something went wrong fetching the game: " + err);
                });
        }
    }

    handleClick(x, y){
        let resStatus = 0;
        fetch(`${getDomain()}/games/turn/${x}/${y}`, {
            method: "PUT",
            headers: {
                userToken: localStorage.getItem("token")
            }
        })
            .then(response => {
                resStatus = response.status;
                return response.json()})

            .then(game => {
                switch (resStatus) {
                    case 200:
                        this.setState({board: game.board});
                        game.players.map(player => {
                            if (player.number === game.myNumber) {
                                this.setState({chosenWorker: player.chosenWorker});
                                this.setState({myTurn: player.turnValue});
                                if (this.state.myTurn === "WON" || this.state.myTurn === "LOST"){
                                    this.props.history.push(`/game/end`)
                                }
                            }
                        });
                        break;
                    case 404:
                        this.props.history.push(`/lobby`);
                        break;
                    case 409:
                        alert(`Field occupied`);
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${resStatus}`);
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

    setNextTurnValue(turnValue) {
        let resStatus = 0;
        fetch(`${getDomain()}/games/next`, {
            method: "PUT",
            headers: {
                userToken: localStorage.getItem("token"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                turnValue: turnValue
            })
        })
            .then(response => {
                resStatus = response.status;
                return response.json()})
            .then(game => {
                switch (resStatus) {
                    case 200:
                        this.setState({board: game.board});
                        game.players.map(player => {
                            if (player.number === game.myNumber) {
                                this.setState({chosenWorker: player.chosenWorker});
                                this.setState({myTurn: player.turnValue});
                                if (this.state.myTurn === "WON" || this.state.myTurn === "LOST"){
                                    this.props.history.push(`/game/end`)
                                }
                            }
                        });
                        break;
                    case 404:
                        this.props.history.push(`/lobby`);
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${resStatus}`);
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

    hephaestusBuild(level) {
        let resStatus=0;
        fetch(`${getDomain()}/games/hephaestus/${level}`, {
            method: "PUT",
            headers: {
                userToken: localStorage.getItem("token"),
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                resStatus = response.status;
                return response.json()})
            .then(game => {
                switch (resStatus) {
                    case 200:
                        this.setState({board: game.board});
                        game.players.map(player => {
                            if (player.number === game.myNumber) {
                                this.setState({chosenWorker: player.chosenWorker});
                                this.setState({myTurn: player.turnValue});
                                if (this.state.myTurn === "WON" || this.state.myTurn === "LOST"){
                                    this.props.history.push(`/game/end`)
                                }
                            }
                        });
                        break;
                    case 404:
                        this.props.history.push(`/lobby`);
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${resStatus}`);
                        break;
                }
            })
            .catch(err => {
                console.log(err);
                alert("Something went wrong fetching the game: " + err);
            });
    }

    componentDidMount() {
        this.interval = setInterval(() => this.getGame(), 2000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async getGame() {
        let resStatus = 0;
        fetch(`${getDomain()}/games/mine`, {
            method: "GET",
            headers: {
                userToken: localStorage.getItem("token")
            }
        })
            .then(response => {
                resStatus = response.status;
                return response.json()})
            .then( game => {
                switch (resStatus) {
                    case 404:
                        alert(`Your opponent has left the game. Room is deleted.`);
                        this.props.history.push(`/lobby`);
                        break;
                    case 200:
                        switch (game.stage) {
                            case 0: this.props.history.push(`/room/${game.gameId}`);
                                break;
                            case 1: this.props.history.push(`/game/start`);
                                break;
                            default: break;
                        }
                        this.setState({gameName: game.gameName});
                        this.setState({myNumber: game.myNumber});
                        this.setState({board: game.board});
                        game.players.map(player => {
                            if (player.number === game.myNumber) {
                                this.setState({chosenWorker: player.chosenWorker});
                                this.setState({myTurn: player.turnValue});
                                this.setState({myGodcard: player.godCard});
                                if (this.state.myTurn === "WON" || this.state.myTurn === "LOST"){
                                    this.props.history.push(`/game/end`)
                                }
                            }
                            if (player.number === 1) {
                                this.setState({player1: player.user});
                                this.setState({player1Godcard: player.godCard});
                            } else {
                                this.setState({player2: player.user});
                                this.setState({player2Godcard: player.godCard});
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

    boardData() {
        let fields = [];
        let workerMarginTop = "0px";
        let workerMarginLeft = "0px";
        this.state.board.map(field => {
            switch (field.level) {
                case 0:
                    workerMarginTop = "0px";
                    workerMarginLeft = "-4px";
                    break;
                case 1:
                    workerMarginTop = "-20px";
                    workerMarginLeft = "-4px";
                    break;
                case 2:
                    workerMarginTop = "-45px";
                    workerMarginLeft = "-4px";
                    break;
                case 3:
                    workerMarginTop = "-60px";
                    workerMarginLeft = "-4px";
                    break;
                default:
                    workerMarginTop = "0px";
                    workerMarginLeft = "0px";
                    break;
            }
            if (this.state.chosenWorker!=null && field.worker!=null &&
                field.worker.workerNr===this.state.chosenWorker && !(this.state.myGodcard==="HERMES" && this.state.myTurn==="MOVE")) {
                fields.push(
                    <SelectedField>
                        {field.level === 1 ?
                            <Level
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={"6px"}
                            >
                                <img
                                    src={level1}
                                    alt=""
                                    width={75}
                                    style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                            </Level> : null}
                        {field.level === 2 ?
                            <Level
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={"-10px"}
                            >
                                <img
                                    src={level2}
                                    alt=""
                                    width={75}
                                    style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                            </Level> : null}
                        {field.level === 3 ?
                            <Level
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={"-42px"}
                            >
                                <img
                                    src={level3}
                                    alt=""
                                    width={75}
                                    style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                            </Level> : null}
                        {field.worker!=null && field.worker.workerNr === 11 ?
                            <Worker
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={workerMarginTop}
                                marginLeft={workerMarginLeft}
                            >
                                <img
                                    src={worker11}
                                    alt=""
                                    width={40}
                                    style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                            </Worker> : null}
                        {field.worker!=null && field.worker.workerNr === 12 ?
                            <Worker
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={workerMarginTop}
                                marginLeft={workerMarginLeft}
                            >
                                <img
                                    src={worker12}
                                    alt=""
                                    width={40}
                                    style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                            </Worker> : null}
                        {field.worker!=null && field.worker.workerNr === 21 ?
                            <Worker
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={workerMarginTop}
                                marginLeft={workerMarginLeft}
                            >
                                <img
                                    src={worker21}
                                    alt=""
                                    width={40}
                                    style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                            </Worker> : null}
                        {field.worker!=null && field.worker.workerNr === 22 ?
                            <Worker
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={workerMarginTop}
                                marginLeft={workerMarginLeft}
                            >
                                <img
                                    src={worker22}
                                    alt=""
                                    width={40}
                                    style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                            </Worker> : null}
                    </SelectedField>
                )
            } else {
                fields.push(
                    <Field
                        disabled={!field.clickable[this.state.myNumber-1]}
                        onClick={() => this.handleClick(field.x,field.y)}
                    >
                        {field.level === 1 ?
                          <Level
                              disabled={!field.clickable[this.state.myNumber-1]}
                              marginTop={"5px"}
                          >
                            <img
                              src={level1}
                              alt=""
                              width={75}
                              style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                            />
                          </Level> : null}
                        {field.level === 2 ?
                            <Level
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={"-10px"}
                            >
                                <img
                                  src={level2}
                                  alt=""
                                  width={75}
                                  style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                        </Level> : null}
                        {field.level === 3 ?
                            <Level
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={"-25px"}
                            >
                                <img
                                  src={level3}
                                  alt=""
                                  width={75}
                                  style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                        </Level> : null}
                        {field.level === 4 ? <Level
                            disabled={!field.clickable[this.state.myNumber-1]}
                            marginTop={"-29px"}
                        >
                                <img
                                  src={level4}
                                  alt=""
                                  width={75}
                                  style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                        </Level> : null}
                        {field.level === 40 ?
                            <Level
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={"8px"}
                            >
                            <img
                                src={level40}
                                alt=""
                                width={51}
                                style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                            />
                        </Level>: null}
                        {field.level === 41 ?
                            <Level
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={"6px"}
                            >
                                <img
                                  src={level41}
                                  alt=""
                                  width={75}
                                  style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                        </Level> : null}
                        {field.level === 42 ?
                            <Level
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={"-15px"}
                            >
                                <img
                                  src={level42}
                                  alt=""
                                  width={75}
                                  style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                        </Level> : null}
                        {field.worker!=null && field.worker.workerNr === 11 ?
                            <Worker
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={workerMarginTop}
                                marginLeft={workerMarginLeft}
                            >
                                <img
                                    src={worker11}
                                    alt=""
                                    width={40}
                                    style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                            </Worker> : null}
                        {field.worker!=null && field.worker.workerNr === 12 ?
                            <Worker
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={workerMarginTop}
                                marginLeft={workerMarginLeft}
                            >
                                <img
                                    src={worker12}
                                    alt=""
                                    width={40}
                                    style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                            </Worker> : null}
                        {field.worker!=null && field.worker.workerNr === 21 ?
                            <Worker
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={workerMarginTop}
                                marginLeft={workerMarginLeft}
                            >
                                <img
                                    src={worker21}
                                    alt=""
                                    width={40}
                                    style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                            </Worker> : null}
                        {field.worker!=null && field.worker.workerNr === 22 ?
                            <Worker
                                disabled={!field.clickable[this.state.myNumber-1]}
                                marginTop={workerMarginTop}
                                marginLeft={workerMarginLeft}
                            >
                                <img
                                    src={worker22}
                                    alt=""
                                    width={40}
                                    style={{cursor: !field.clickable[this.state.myNumber-1] ? "default" : "pointer"}}
                                />
                            </Worker> : null}
                    </Field>
                )
            }
        });
        return fields
    };

    getText() {
        switch(this.state.myTurn) {
            case "SETWORKER":
                return <h3>Place a worker</h3>;
            case "MOVE":
                if (this.state.chosenWorker==null) {
                    return <h3>Choose a Worker</h3>
                } else {
                    return <h3>Make a move</h3>
                }
            case "BUILD":
                if (this.state.chosenWorker==null) {
                    return <h3>Choose a Worker</h3>
                } else {
                    return <h3>Choose a building to add a block</h3>
                }
            case "DOME":
                if (this.state.chosenWorker==null) {
                    return <h3>Choose a Worker to build something with him</h3>
                } else {
                    return <h3>Choose a building to add a dome</h3>
                }
            case "BUILDEND":
                return <div>
                    <h3>Do you want to build or to end your turn?</h3>
                    <ButtonContainer>
                        <Button
                            width="100%"
                            onClick={() => {
                                this.setNextTurnValue("BUILD");
                            }}
                        >
                            Build
                        </Button>
                        <Button
                            width="100%"
                            onClick={() => {
                                this.setNextTurnValue("END");
                            }}
                        >
                            End
                        </Button>
                    </ButtonContainer>
                </div>;
            case "BUILDMOVE":
                return <div>
                    <h3>Do you want to move or to build?</h3>
                    <ButtonContainer>
                        <Button
                            width="100%"
                            onClick={() => {
                                this.setNextTurnValue("MOVE");
                            }}
                        >
                            Move
                        </Button>
                        <Button
                            width="100%"
                            onClick={() => {
                                this.setNextTurnValue("BUILD");
                            }}
                        >
                            Build
                        </Button>
                    </ButtonContainer>
                </div>;
            case "BUILDDOME":
                return <div>
                    <h3>Do you want to add a block or a dome?</h3>
                    <ButtonContainer>
                        <Button
                            width="100%"
                            onClick={() => {
                                this.setNextTurnValue("BUILD");
                            }}
                        >
                            Block
                        </Button>
                        <Button
                            width="100%"
                            onClick={() => {
                                this.setNextTurnValue("DOME");
                            }}
                        >
                            Dome
                        </Button>
                    </ButtonContainer>
                </div>;
            case "HEPHAESTUSBUILD":
                return <div>
                    <h3>Do you want to build one block or two blocks?</h3>
                    <ButtonContainer>
                        <Button
                            width="100%"
                            onClick={() => {
                                this.hephaestusBuild(1);
                            }}
                        >
                            1
                        </Button>
                        <Button
                            width="100%"
                            onClick={() => {
                                this.hephaestusBuild(2);
                            }}
                        >
                            2
                        </Button>
                    </ButtonContainer>
                </div>;
            default: return <h3>It is your opponent's move</h3>
        }
    }

    render() {
        let important = {
            backgroundImage: 'url(' + require('../../pictures/board.png') + ')',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '611px'
        };
        let cardStyle = {
            backgroundImage: !this.state.player1Godcard ? (
                    <Spinner />) :
                'url(' + gods.getByName(this.state.player1Godcard).image + ')',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '155px',
            marginTop: '-10px'
        };
        let cardStyle2 = {
            backgroundImage: !this.state.player2Godcard ? (
                    <Spinner />) :
                'url(' + gods.getByName(this.state.player2Godcard).image + ')',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '155px',
            marginTop: '-10px'
        };
        return (
            <BaseContainer>
                <TopButtonContainer>
                    <RulesButton
                        width="100px"
                        variant="danger"
                        onClick={() => {
                            this.props.history.push("/rules");
                        }}
                    >
                        Rules
                    </RulesButton>
                    <ExitButton
                        width="100px"
                      variant="danger"
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
                        ) : [
                            this.state.myNumber === 1 ?
                                [
                                    <h2>Me</h2>,
                                    [this.state.withGodcards ?
                                        [
                                            <CardOuterContainer style={cardStyle}>
                                                <CardTextContainer>
                                                    <WorkerContainer>
                                                        {this.getText()}
                                                    </WorkerContainer>
                                                </CardTextContainer>
                                            </CardOuterContainer>,
                                            <TextContainer>
                                                {gods.getByName(this.state.player1Godcard).description}
                                            </TextContainer>
                                        ] :
                                        this.getText()
                                    ]
                                ] : [
                                    <h2>{this.state.player1.username}</h2>,
                                    [
                                        this.state.withGodcards &&
                                        [
                                            <CardOuterContainer style={cardStyle}>
                                            </CardOuterContainer>,
                                            <TextContainer>
                                                {gods.getByName(this.state.player1Godcard).description}
                                            </TextContainer>
                                        ]
                                    ]
                                ]
                        ]}
                    </PlayerContainer>
                    <GameOuterContainer style={important}>
                        <GameContainer>
                            <div className="wrapper">
                                {this.boardData()}
                            </div>
                        </GameContainer>
                    </GameOuterContainer>
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
                        ) : [
                            this.state.myNumber === 2 ?
                                [
                                    <h2>Me</h2>,
                                    [this.state.withGodcards ?
                                        [
                                            <CardOuterContainer style={cardStyle2}>
                                                <CardTextContainer>
                                                    {this.getText()}
                                                </CardTextContainer>
                                            </CardOuterContainer>,
                                            <TextContainer>
                                                {gods.getByName(this.state.player2Godcard).description}
                                            </TextContainer>
                                        ] :
                                        this.getText()
                                    ]
                                ] : [
                                    <h2>{this.state.player2.username}</h2>,
                                    [
                                        this.state.withGodcards &&
                                        [
                                            <CardOuterContainer style={cardStyle2}>
                                            </CardOuterContainer>,
                                            <TextContainer>
                                                {gods.getByName(this.state.player2Godcard).description}
                                            </TextContainer>
                                        ]
                                    ]
                                ]
                        ]}
                    </PlayerContainer>
                </OuterContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(Game);

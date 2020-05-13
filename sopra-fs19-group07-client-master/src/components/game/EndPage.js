import React from "react";
import styled from "styled-components";
import { getDomain } from "../../helpers/getDomain";
import { withRouter } from "react-router-dom";
import { Button } from "../../views/design/Button";
import {Spinner} from "../../views/design/Spinner";
import {Title, ButtonContainer, BaseContainer} from "../../views/design/General";
import {
    OuterContainer,
    Form,
    GameContainer,
    GameOuterContainer,
    PlayerContainer,
    EndPageContainer,
    SpinnerContainer, WorkerContainer
} from "../../views/design/GameDesign";
import {Field, Level, Worker} from "../../views/design/Fields";
import gods from "../../repos/Gods";
import level1 from "../../pictures/buildings/level1.png";
import level2 from "../../pictures/buildings/level2.png";
import level3 from "../../pictures/buildings/level3.png";
import worker12 from "../../pictures/buildings/worker12.png";
import worker22 from "../../pictures/buildings/worker22.png";
import level4 from "../../pictures/buildings/level4.png";
import level40 from "../../pictures/buildings/level40.png";
import level41 from "../../pictures/buildings/level41.png";
import level42 from "../../pictures/buildings/level42.png";
import  worker11 from "../../pictures/buildings/worker11.png";
import  worker21 from "../../pictures/buildings/worker21.png";
import Wreath from "../../pictures/wreath_winner.png";
import LoserSmiley from "../../pictures/loserSmiley.png";

const WinnerGameContainer = styled.div`
  flex-direction: column;
  height: 617px;
  width: 550px;
  padding-top: 10px; 
`;

const MiddleCardContainer = styled.div`
  display: inline-table;
  width: 150px;
  height: 230px;
  margin-left: 10px;
  margin-right: 10px;
  justify-content: center;
  align-content: center;
`;

const MiddleSpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 150px;
  margin-left: -20px;
  margin-bottom: 150px;
`;

const BoardButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 40px;
`;

class EndPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameName: null,
            player1: null,
            player2: null,
            player1Godcard: null,
            player2Godcard: null,
            player1turnValue: null,
            player2turnValue: null,
            withGodcards: false,
            board: [],
            showBoard: false,
            myTurn: null,
            myGodcard: null,
            gameId: null
        };
    }

    lobby(){
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
                    case 404:
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

    profiles(){
        fetch(`${getDomain()}/games`, {
            method: "DELETE",
            headers: {
                userToken: localStorage.getItem("token")
            }
        })
            .then(response => {
                switch (response.status) {
                    case 204:
                        this.props.history.push(`/game`);
                        break;
                    case 404:
                        this.props.history.push(`/game`);
                        break;
                    default:
                        alert(`Unexpected HTTP status: ${response.status}`);
                        this.props.history.push(`/game`);
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

    board() {
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
            fields.push(
              <Field
                disabled={true}
              >
                  {field.level === 1 ?
                    <Level
                      marginTop={"5px"}
                    >
                        <img
                          src={level1}
                          alt=""
                          width={75}
                        />
                    </Level> : null}
                  {field.level === 2 ?
                    <Level
                      marginTop={"-10px"}
                    >
                        <img
                          src={level2}
                          alt=""
                          width={75}
                        />
                    </Level> : null}
                  {field.level === 3 ?
                    <Level
                      marginTop={"-25px"}
                    >
                        <img
                          src={level3}
                          alt=""
                          width={75}
                        />
                    </Level> : null}
                  {field.level === 4 ? <Level
                    marginTop={"-29px"}
                  >
                      <img
                        src={level4}
                        alt=""
                        width={75}
                      />
                  </Level> : null}
                  {field.level === 40 ?
                    <Level
                      marginTop={"8px"}
                    >
                        <img
                          src={level40}
                          alt=""
                          width={51}
                        />
                    </Level>: null}
                  {field.level === 41 ?
                    <Level
                      marginTop={"6px"}
                    >
                        <img
                          src={level41}
                          alt=""
                          width={75}
                        />
                    </Level> : null}
                  {field.level === 42 ?
                    <Level
                      marginTop={"-15px"}
                    >
                        <img
                          src={level42}
                          alt=""
                          width={75}
                        />
                    </Level> : null}
                  {field.worker!=null && field.worker.workerNr === 11 ?
                    <Worker
                      marginTop={workerMarginTop}
                      marginLeft={workerMarginLeft}
                    >
                        <img
                          src={worker11}
                          alt=""
                          width={40}
                        />
                    </Worker> : null}
                  {field.worker!=null && field.worker.workerNr === 12 ?
                    <Worker
                      marginTop={workerMarginTop}
                      marginLeft={workerMarginLeft}
                    >
                        <img
                          src={worker12}
                          alt=""
                          width={40}
                        />
                    </Worker> : null}
                  {field.worker!=null && field.worker.workerNr === 21 ?
                    <Worker
                      marginTop={workerMarginTop}
                      marginLeft={workerMarginLeft}
                    >
                        <img
                          src={worker21}
                          alt=""
                          width={40}
                        />
                    </Worker> : null}
                  {field.worker!=null && field.worker.workerNr === 22 ?
                    <Worker
                      marginTop={workerMarginTop}
                      marginLeft={workerMarginLeft}
                    >
                        <img
                          src={worker22}
                          alt=""
                          width={40}
                        />
                    </Worker> : null}
              </Field>
            )
        });
        return fields
    };



    componentDidMount() {
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
                      this.setState({gameId: game.id});
                      this.setState({gameName: game.gameName});
                      this.setState({myNumber: game.myNumber});
                      this.setState({board: game.board});
                      game.players.map(player => {
                          if (player.number === game.myNumber) {
                              this.setState({myTurn: player.turnValue});
                              this.setState({myGodcard: player.godCard});
                          }
                          if (player.number === 1) {
                              this.setState({player1: player.user});
                              this.setState({player1Godcard: player.godCard});
                              this.setState({player1turnValue: player.turnValue});
                          } else {
                              this.setState({player2: player.user});
                              this.setState({player2Godcard: player.godCard});
                              this.setState({player2turnValue: player.turnValue});
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
        let cardStyle = {
            backgroundImage: !this.state.myGodcard ? (
                    <Spinner />) :
                'url(' + gods.getByName(this.state.myGodcard).image + ')',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '130px',
            marginTop: '-15px'
        };
        let important = {
            backgroundImage: 'url(' + require('../../pictures/board.png') + ')',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '611px'
        };
        return (
            <BaseContainer>
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
                                {this.state.player1turnValue === "WON" ?
                                    <h1>WINNER</h1> :
                                    <h1>LOSER</h1>
                                }
                                <h2>{this.state.player1.username}</h2>
                            </div>
                        )}
                        {this.state.withGodcards &&
                        <img
                            src={gods.getByName(this.state.player1Godcard).image}
                            alt=""
                            height={240}
                        />}
                    </PlayerContainer>
                    {this.state.showBoard ?
                        <WinnerGameContainer>
                            <GameOuterContainer style={important}>
                                <GameContainer>
                                    <div className="wrapper">
                                        {this.board()}
                                    </div>
                                </GameContainer>
                                <BoardButtonContainer>
                                    <Button
                                        width="40%"
                                        onClick={() => {
                                            this.setState({showBoard: false});
                                        }}
                                    >
                                        Return
                                    </Button>
                                </BoardButtonContainer>
                            </GameOuterContainer>
                        </WinnerGameContainer> :
                        <EndPageContainer>
                            {
                                (this.state.myTurn == null) ?
                                    <MiddleSpinnerContainer>
                                        <Spinner/>
                                    </MiddleSpinnerContainer> :
                                    [
                                        (this.state.myTurn === "WON") ?
                                            <Form>
                                                <Title><h1>VICTORY!</h1></Title>
                                                {
                                                    this.state.withGodcards ?
                                                        <MiddleCardContainer style={cardStyle}>
                                                            <img
                                                                src={Wreath}
                                                                alt=""
                                                                height={235}
                                                                style={{marginTop: "10px"}}
                                                            />
                                                        </MiddleCardContainer> :
                                                        <img src={Wreath} alt="wreath" height={210}/>
                                                }
                                                <h4 style={{marginTop: "3px", marginBottom: '-3px'}}>Congratulations! You have
                                                    won the game!</h4>
                                            </Form>
                                            :
                                            <Form>
                                                <Title><h1>Defeat</h1></Title>
                                                <img src={LoserSmiley} alt="loserSmiley" height={210}/>
                                                <h4 style={{marginTop: "3px", marginBottom: '-3px'}}>You have lost the
                                                    game.</h4>
                                                <h4 style={{marginTop: "3px", marginBottom: '-3px'}}> May the Gods be with you
                                                    next time!</h4>
                                            </Form>
                                    ]
                            }
                            <ButtonContainer>
                                <Button
                                    width="40%"
                                    onClick={() => {
                                        this.lobby();
                                    }}
                                >
                                    Return to Lobby
                                </Button>
                                <Button
                                    width="40%"
                                    onClick={() => {
                                        this.profiles();
                                    }}
                                >
                                    Return to Profiles
                                </Button>
                            </ButtonContainer>
                            <ButtonContainer>
                                <Button
                                    width="40%"
                                    onClick={() => {
                                        this.setState({showBoard: true});
                                    }}
                                >
                                    See the board
                                </Button>
                            </ButtonContainer>
                        </EndPageContainer>
                    }
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
                                {this.state.player2turnValue === "WON" ?
                                    <h1>WINNER</h1> :
                                    <h1>LOSER</h1>
                                }
                                <h2>{this.state.player2.username}</h2>
                            </div>
                        )}
                        {
                            this.state.withGodcards &&
                            <img
                                src={gods.getByName(this.state.player2Godcard).image}
                                alt=""
                                height={240}
                            />
                        }
                    </PlayerContainer>
                </OuterContainer>
            </BaseContainer>
        );
    }
}

export default withRouter(EndPage);

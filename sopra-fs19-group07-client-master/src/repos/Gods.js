import God from '../views/models/God';
import apollo from "../pictures/cards/1.png";
import artemis from "../pictures/cards/2.png";
import athena from "../pictures/cards/3.png";
import atlas from "../pictures/cards/4.png";
import demeter from "../pictures/cards/5.png";
import hephaestus from "../pictures/cards/6.png";
import hermes from "../pictures/cards/7.png";
import minotaur from "../pictures/cards/8.png";
import pan from "../pictures/cards/9.png";
import prometheus from "../pictures/cards/10.png";
import nogodcard from "../pictures/cards/NoGodcard.png"

/**
 * God Repository
 * 
 * This class is used as a repository for all gods.
 */
export class GodRepository {
  constructor(gods) {
    this.gods = gods;
  }

  /**
   * Gets all gods by name
   * 
   * @param {string} name The name of the god to get
   * @returns {God} The found god
   */
  getByName(name) {
    const foundGods = this.gods.filter(god => god.name === name);

    if (foundGods.length) {
      return foundGods[0];
    }

    throw new Error(`No god found for ${name}`);
  }

  /**
   * Returns all gods
   * 
   * @returns {[God]} All gods
   */
  getAll() {
    return this.gods;
  }
}


/**
 * This is just a temporary, static implementation for the interface defined above.
 * Normally this should come from another data source like a database or an api.
 */

const staticGodsRepo = new GodRepository([
  new God('APOLLO', 'God Of Music: ','Your Move: Your Worker may move into an opponent Worker’s space by forcing their Worker to the space yours just vacated.', apollo),
  new God('ARTEMIS', 'Goddess of the Hunt: ', 'Your Move: Your Worker may move one additional time, but not back to its initial space.', artemis),
  new God('ATHENA', 'Goddess of Wisdom: ', 'Opponent’s Turn: If one of your Workers moved up on your last turn, opponent Workers cannot move up this turn.', athena),
  new God('ATLAS', 'Titan Shouldering the Heavens: ', 'Your Build: Your Worker may build a dome at any level.', atlas),
  new God('DEMETER', 'Goddess of Harvest: ', 'Your Build: Your Worker may build one additional time, but not on the same space.', demeter),
  new God('HEPHAESTUS', 'God of Blacksmiths: ', 'Your Build: Your Worker may build one additional block (not dome) on top of your first block.', hephaestus),
  new God('HERMES', 'God of Travel: ', 'Your Turn: If your Workers do not move up or down, they may each move any number of times (even zero), and then either builds.', hermes),
  new God('MINOTAUR', 'Bull-headed Monster: ', 'Your Move: Your Worker may move into an opponent Worker’s space, if their Worker can be forced one space straight backwards to an unoccupied space at any level.', minotaur),
  new God('PAN', 'God of the Wild: ', 'Win Condition: You also win if your Worker moves down two or more levels.', pan),
  new God('PROMETHEUS', 'Titan Benefactor of Mankind: ', 'Your Turn: If your Worker does not move up, it may build both before and after moving.', prometheus),
  new God('NOGODCARD', '', '', nogodcard)
]);

export default staticGodsRepo;
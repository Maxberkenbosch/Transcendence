// Types
import { MatchRecord } from "../../../types/game";
import { ProfileType } from "../../../types/profile";

// Random int
import randomNum from "../../../utils/randomNum";

// Random player
import { generateProfile } from "./profile";

const generateGameResult = (player: ProfileType, amount: number): MatchRecord[] => {
    const matchRecordList: MatchRecord[] = [];

    const opponents: ProfileType[] = generateProfile(amount);

    for (let i = 0; i < amount; i++) {
        const winOrLose: number = randomNum(0, 1);

        let score = {
            opponent: 0,
            self: 0
        };

        const otherScore: number = randomNum(0, 4);

        if (winOrLose === 0) {
            score.opponent = 5;
            score.self = otherScore;
        } else {
            score.opponent = otherScore;
            score.self = 5;
        }

        const newMatchRecord: MatchRecord = {
            player,
            opponent: opponents[i],
            score
        };

        matchRecordList.push(newMatchRecord);
    }

    return matchRecordList;
};

export { generateGameResult };

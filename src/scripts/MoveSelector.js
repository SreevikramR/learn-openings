import { getMoveSequence } from "@/app/api/firebaseAccess";

const MoveSelector = (moveHistory, openingLine) => {

    var moveSequence = [];
    moveSequence = getMoveSequence(openingLine);

    //console.log(moveHistory);
    var i = 0;
    var j = moveHistory.length;

    if (moveSequence.length + 1 == moveHistory.length) {
        return null;
    }

    for (i = moveHistory.length - 1; i < moveHistory.length; i++) {
		if (moveHistory[i] !== moveSequence[i]) {
			//console.log("moveHistory: " + moveHistory[i] + ", moveSequence: " + moveSequence[i]);
			return "invalid";
		} else {
			// console.log("Next move: " + moveSequence[j]);
			return moveSequence[j];
		}
    }
};

export default MoveSelector;
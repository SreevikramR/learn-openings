import { getMoveSequence } from "@/app/api/firebaseAccess";

const MoveSelector = (moveHistory, openingLine) => {

	var moveSequence = [];
	moveSequence = getMoveSequence(openingLine);

	var i = 0;
	var j = moveHistory.length;

	if (moveSequence.length + 1 == moveHistory.length) {
		return null;
	}

	for (i = moveHistory.length - 1; i < moveHistory.length; i++) {
		if (moveHistory[i] !== moveSequence[i]) {
			return "invalid";
		} else {
			return moveSequence[j];
		}
	}
};

export default MoveSelector;
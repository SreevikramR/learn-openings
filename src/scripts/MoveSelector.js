import { getMoveSequence } from "@/app/api/firebaseAccess";

const MoveSelector = async (moveHistory, openingName, openingLine) => {

	var moveSequence = [];
	moveSequence = await getMoveSequence(openingName, openingLine);

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
import { useDroppable } from "@dnd-kit/core";
import { ReactElement } from "react";
import { Piece, useGame } from "../models/game";
import { arePositionsValid } from "../models/moves";

export function GameBoardSpacePiece({ position, pieceNodes }: {
	position: number;
	pieceNodes: Record<Piece, ReactElement>;
}) {
	const { state, actions } = useGame();
	const { isOver, active, setNodeRef } = useDroppable({ id: position });
	let background = "transparent";

	if (active) {
		const isValid = arePositionsValid({
			...state.pieces,
			[active.id as Piece]: position,
		});
		background = isValid ? "green" : "red";
	}

	return (
		<div
			ref={setNodeRef}
			css={{
				position: "relative",
				height: "8rem",
				padding: "1rem 0",
				display: "flex",
				alignItems: "flex-end",
			}}
			style={{
				outline: isOver ? "2px #ccc solid" : "none",
				background,
			}}
		>
			{/* TODO: This is nonsense */}
			{position === actions.game.piecesNormalisedForDisplay.guard1 &&
				pieceNodes.guard1}
			{position === actions.game.piecesNormalisedForDisplay.guard2 &&
				pieceNodes.guard2}
			{position === actions.game.piecesNormalisedForDisplay.jester &&
				pieceNodes.jester}
			{position === actions.game.piecesNormalisedForDisplay.queen &&
				pieceNodes.queen}
			{position === actions.game.piecesNormalisedForDisplay.witch &&
				pieceNodes.witch}
		</div>
	);
}

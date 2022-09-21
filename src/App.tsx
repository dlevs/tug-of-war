import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { range } from "lodash";
import { useState } from "react";
import "./App.css";
import { Game, Piece } from "./models/Game";
import { arePositionsValid } from "./models/moves";

const game = new Game();

function GamePiece({ type }: { type: Piece }) {
	// ${ // 		position > 0 && "flip" // 	}`
	const { attributes, listeners, setNodeRef, transform, active } = useDraggable(
		{
			id: type,
		},
	);
	const style = {
		// Outputs `translate3d(x, y, 0)`
		transform: CSS.Translate.toString(transform),
		cursor: active ? "grabbing" : "grab",
	};
	// TODO: Put flipping back
	return (
		<img
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			src={`${type}.png`}
			className={`piece-img piece-img-${type}`}
			alt=""
		// alt="Guard game piece" // TODO
		// title="Guard 1" // TODO
		/>
	);
}

function GamePieceSpace({ position }: { position: number }) {
	const { isOver, setNodeRef } = useDroppable({ id: position });

	return (
		<div
			ref={setNodeRef}
			className="piece-space"
			style={{
				// TODO: CSS in JS solution
				outline: isOver ? "2px #ccc solid" : undefined,
			}}
		>
			{position === game.piecesNormalisedForDisplay.guard1 && (
				<GamePiece type='guard1' />
			)}
			{position === game.piecesNormalisedForDisplay.guard2 && (
				<GamePiece type='guard2' />
			)}
			{position === game.piecesNormalisedForDisplay.jester && (
				<GamePiece type='jester' />
			)}
			{position === game.piecesNormalisedForDisplay.queen && (
				<GamePiece type='queen' />
			)}
			{position === game.piecesNormalisedForDisplay.witch && (
				<GamePiece type='witch' />
			)}
		</div>
	);
}

function App() {
	const [, setTurn] = useState(0);
	const jankyRerender = () => {
		setTurn((n) => n + 1);
	}; // TODO: Make something better

	return (
		<DndContext
			onDragEnd={({ active, over }) => {
				if (!over) {
					return;
				}

				const newPieces = {
					...game.pieces,
					[active.id as Piece]: Number(over.id),
				};

				if (!arePositionsValid(newPieces)) {
					return;
				}

				game.pieces = newPieces;
				jankyRerender();
			}}
		>
			<div className="App">
				<div className="board">
					{range(-8, 9).map((position) => {
						const side =
							position === 0 ? "middle" : position < 0 ? "blue" : "red";
						const chateauClass =
							Math.abs(position) > 6 ? "board-tile-chateau" : "";

						return (
							<div
								key={position}
								className={`board-tile board-tile-${side} ${chateauClass}`}
							>
								<GamePieceSpace position={position} />
								<div className="crown-space">
									{position === game.crownPosition && (
										<img
											src="crown.png"
											className="piece-img"
											alt="Crown game piece"
											title="Crown"
										/>
									)}
								</div>
							</div>
						);
					})}
				</div>
				<div>Deck: ({game.deck.cards.length})</div>
				<ul
					style={{
						display: "flex",
						width: "100%",
					}}
				>
					{[...game.players].reverse().map((player) => {
						return (
							<li key={player.color} style={{ flex: 1 }}>
								Player {player.color}
								<ul>
									{player.cards.map((card, i) => {
										return (
											<li key={i}>
												<strong className={`card-type-${card.group}`}>
													{card.group}:
												</strong>
												{" "}
												{"move" in card ? card.move : card.type}
											</li>
										);
									})}
								</ul>
								<ul>
									{player.possibleMoves.map((move, i) => {
										if (player.isPlaying) {
											return (
												<li key={i}>
													<button
														key={i}
														onClick={() => {
															game.playTurn(i);
															jankyRerender();
														}}
													>
														{move.piecesToMove.map((piece) => {
															return (
																<p>
																	{piece.type} can move to: {piece.to}
																</p>
															);
														})}
														{move.cardsUsed.length === 0
															? " (with witch)"
															: null}
													</button>
												</li>
											);
										}

										return (
											<li key={i}>
												{move.piecesToMove.map((piece) => {
													return (
														<p>
															{piece.type} can move to: {piece.to}
														</p>
													);
												})}
											</li>
										);
									})}
								</ul>
								<hr />
							</li>
						);
					})}
				</ul>
			</div>
		</DndContext>
	);
}

export default App;

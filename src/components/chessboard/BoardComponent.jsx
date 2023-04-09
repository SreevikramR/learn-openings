"use client"
import { Chessboard } from "react-chessboard";

const BoardComponent = () => {

  return (
    <>
      <Chessboard boardWidth={window.innerWidth / 3} />
    </>
  );
};

export default BoardComponent
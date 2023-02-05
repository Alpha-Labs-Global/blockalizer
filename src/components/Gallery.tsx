import React from "react";
import placeholder from "../media/updatingMint.png";

interface ComponentProps {
  ownedPieces: Array<any>;
}

const Gallery: React.FC<ComponentProps> = (props: ComponentProps) => {
  const display = props.ownedPieces.map((piece, i) => {
    return (
      <div key={i} className="lg:w-[33%] md:w-[50%] mb-6">
        {piece.metadata.name} by <span className="text-teal">you</span>
        <span className="block mb-2"></span>
        <img
          src={piece.metadata.image}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; // prevents looping
            currentTarget.src = placeholder;
          }}
          className="w-[80%]"
        />
      </div>
    );
  });

  return (
    <div className="lg:w-[70%] lg:ml-[20%] md:w-[60%] md:m-auto sm:w-[90%] sm:m-auto lg:float-right">
      <h1 className="text-3xl ">Gallery</h1>
      <span className="block mb-4"></span>
      <div className="flex flex-row content-start flex-wrap w-full items-left justify-start flex-start lg:max-w-[1500px] lg:min-w-[350px]">
        {display}
      </div>
    </div>
  );
};

export default Gallery;

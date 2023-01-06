import React from "react";

interface ComponentProps {
  ownedPieces: Array<any>;
}

const Gallery: React.FC<ComponentProps> = (props: ComponentProps) => {
  const display = props.ownedPieces.map((piece, i) => {
    return (
      <div key={i}>
        {piece.tokenId}
        <img src={piece.metadata.image} height="200" width="200" />
      </div>
    );
  });

  return (
    <div>
      <h1>Gallery</h1>
      {display}
    </div>
  );
};

export default Gallery;

import React, { useEffect, useState } from "react";

import "./Sandbox.css";

interface ComponentProps {}

const Sandbox: React.FC<ComponentProps> = (props: ComponentProps) => {
  return (
    <div className="SandboxContainer">
      <h1>Sandbox</h1>
    </div>
  );
};

export default Sandbox;

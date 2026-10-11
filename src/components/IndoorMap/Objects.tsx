interface ObjectsProps {
  handleObjectClick: (e: React.MouseEvent<SVGPathElement>) => void;
  className?: string;
}
function Objects({ handleObjectClick: _handleObjectClick, className: _className }: ObjectsProps) {
  // No demo/placeholder room shapes - real venue hit-areas (Vooruit, Wintercircus) go here.
  return <g id="Objects" />;
}

export default Objects;

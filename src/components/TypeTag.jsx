import { TYPE_COLORS } from "../constants";

export default function TypeTag({ type }) {
  return (
    <span className="tag" style={{ background: TYPE_COLORS[type] || "#888" }}>
      {type}
    </span>
  );
}

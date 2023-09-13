import "@/styles/button.css";
import { MousePointerClick } from "lucide-react";

export default function WatchButton({
  className,
  count,
}: {
  className?: string;
  count: string;
}) {
  return (
    <button className="Btn">
      <span className="leftContainer">
        <MousePointerClick className="h-6 w-6 text-white" />
        {/* <span className="like"></span> */}
      </span>
      <span className="likeCount">{count}</span>
    </button>
  );
}

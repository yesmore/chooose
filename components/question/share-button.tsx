import "@/styles/button.css";

export default function ShareButton({ className }: { className?: string }) {
  return (
    <button className={"Btn"}>
      <span className="svgContainer">&</span>
      <span className="BG"></span>
    </button>
  );
}

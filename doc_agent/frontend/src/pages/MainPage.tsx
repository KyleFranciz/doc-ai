import "../main.css";

export default function MainPage() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center">
        <h1 className="font-bold text-[80px] text-white">
          Welcome to Doc Ai
        </h1>
      </div>
      <div className="flex items-center mt-[-25px] justify-center text-[20px] font-semibold">
        Your favorite local ai agent, here to help with all coding needs.
      </div>
    </div>
  );
}

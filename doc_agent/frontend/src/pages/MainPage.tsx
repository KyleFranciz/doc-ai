import { Link } from "react-router";
import "../main.css";

export default function MainPage() {
  return (
    <>
      <div className="flex justify-center items-center">
        <h1 className="text-white">
          This page will introduce the user to the application
        </h1>
      </div>
      <div className="bg-[#272727] p-2 rounded-[5px] ml-2 font-semibold">
        <Link to={"/prompt"}>(Link to the prompt page)</Link>
      </div>
    </>
  );
}

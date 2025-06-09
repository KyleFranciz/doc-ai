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
      <Link to={"/prompt"}>(Add button here to link to the prompt page)</Link>
    </>
  );
}

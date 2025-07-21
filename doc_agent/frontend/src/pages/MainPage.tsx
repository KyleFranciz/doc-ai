import "../main.css";

export default function MainPage() {
  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center">
        <h1 className="font-[instrument-serif] tracking-tight text-[80px] text-white">
          It's nice to meet you,
        </h1>
      </div>
      {/*NOTE: MIGHT MAKE A SECOND LINE TO THE MAIN PAGE*/}
      {/* <div className="flex justify-center items-center"> */}
      {/*   <h2 className="font-[instrument-serif] tracking-tight text-[80px] text-white"> */}
      {/*     my name is Doc */}
      {/*   </h2> */}
      {/* </div> */}
      <div className="flex items-center mt-[-22px] justify-center text-[22px] font-semibold">
        I'm <span className="font-bold italic mx-1.5 text-[#0F9E6A]">Doc</span>{" "}
        your favorite local ai agent here to help with all coding needs.
      </div>
    </div>
  );
}

import { Seat } from "./components/Seat";

function App() {
  return (
    <div className="m-10">
      <div className="grid grid-cols-18 gap-14">
        {/* STAGE */}
        <div className="col-start-3 col-span-14">
          <div className="border h-20 rounded-md flex justify-center items-center">
            <p>STAGE</p>
          </div>
        </div>

        <div className="col-start-1 col-span-2 flex flex-wrap gap-2">
          {new Array(144).fill("").map((_, index) => (
            <Seat key={index} />
          ))}
        </div>
        <div className="col-start-3 col-span-7 flex flex-wrap gap-2.5">
          {new Array(612).fill("").map((_, index) => (
            <Seat key={index} />
          ))}
        </div>
        <div className="col-start-10 col-span-7 flex flex-wrap gap-2.5">
          {new Array(612).fill("").map((_, index) => (
            <Seat key={index} />
          ))}
        </div>
        <div className="col-start-17 col-span-2 flex flex-wrap gap-2">
          {new Array(144).fill("").map((_, index) => (
            <Seat key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

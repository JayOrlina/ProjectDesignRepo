import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = ({ isBatchActive }) => {

  const handleNewBatchClick = (e) => {
    if (isBatchActive) {
      e.preventDefault();
      toast.error("A batch is already in progress. Please wait for it to finish.", {
        duration: 4000,
      });
    }
  };

  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-primary font-mono tracking-tighter">Pot-O-Matic</h1>
          <div className="flex items-center gap-4">
            <div
              className="tooltip tooltip-bottom"
              data-tip={isBatchActive ? "A batch is already in progress" : "Create a new batch"}
            >
              <Link
                to={"/create"}
                className={`btn btn-primary ${isBatchActive ? "btn-disabled" : ""}`}
                onClick={handleNewBatchClick}
              >
                <PlusIcon className="size-5" />
                <span>New Batch</span>
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
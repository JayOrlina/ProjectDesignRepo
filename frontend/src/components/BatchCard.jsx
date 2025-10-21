import { Link } from "react-router";
import { Trash2Icon } from "lucide-react";
import { formatDate } from "../lib/utils";
import api from "../lib/axios"
import toast from "react-hot-toast";

const BatchCard = ({ batch, setBatch }) => {
    const handleDelete = async (e, id) => {
        e.preventDefault();

        if(!window.confirm("Are you sure you want to delete this batch?")) return;

        try {
            await api.delete(`/batch/${id}`)
            setBatch((prev) => prev.filter(batch => batch._id !== id)); //get rid of the deleted one
            toast.success("Deleted Successfully")
            
        } catch (error) {
            console.log("Error in handleDelete", error)
            toast.error("Failed to delete")
        }
    }
  return (
    <Link
      to={`/batch/${batch._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-[#00FF9D]"
    >
      <div className="card-body">
        <h3 className="card-title text-base-content">{batch.title}</h3>
        <p className="text-base-content/70 line-clamp-3">{batch.content}</p>
        <div className="card-actions justify-between items-center mt-4">
          <span className="text-sm text-base-content/50">
            {formatDate(new Date(batch.createdAt))}
          </span>
          <div className="flex items-center gap-1">
            <button className="btn btn-ghost btn-xs text-error" onClick={(e) => handleDelete(e, batch._id)}>
              <Trash2Icon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BatchCard;

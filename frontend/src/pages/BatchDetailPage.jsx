import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { LoaderIcon } from "lucide-react";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import api from "../lib/axios";
import toast from "react-hot-toast";

const BatchDetailPage = () => {
  const [batch, setBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await api.get(`/batch/${id}`);
        setBatch(res.data);
      } catch (error) {
        console.log("Error in fetching Batch", error);
        toast.error("Failed to fetch the Batch");
      } finally {
        setLoading(false);
      }
    };

    fetchBatch();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this Batch?")) return;

    try {
      await api.delete(`/batch/${id}`);
      toast.success("Batch deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the Batch", error);
      toast.error("Failed to delete the Batch");
    }
  };

  const handleSave = async () => {
    if (!batch.title.trim() || !batch.content.trim()) {
      toast.error("Please fill all the blanks");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/batch/${id}`, batch);
      toast.success("Batch updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the Batch", error);
      toast.error("Failed to save the Batch");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </Link>
            <button
              onClick={handleDelete}
              className="btn btn-error btn-outline"
            >
              <Trash2Icon className="h-5 w-5" />
              Delete
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Batch Title"
                  className="input input-bordered"
                  value={batch.title}
                  onChange={(e) =>
                    setBatch({ ...batch, title: e.target.value })
                  }
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your content here..."
                  className="textarea textarea-bordered h-32"
                  value={batch.content}
                  onChange={(e) =>
                    setBatch({ ...batch, content: e.target.value })
                  }
                />
              </div>

              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailPage;

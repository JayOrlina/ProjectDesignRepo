import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router"; 
import { LoaderIcon, ArrowLeftIcon, Trash2Icon, AlertTriangleIcon, PauseCircleIcon, PlayCircleIcon, CheckCircle2Icon } from "lucide-react";
import api from "../lib/axios";
import toast from "react-hot-toast";

// --- Helper UI Components ---

const ProgressBar = ({ value, colorClass = 'progress-primary' }) => (
    <progress className={`progress ${colorClass} w-full`} value={value} max="100"></progress>
);

const StatusBadge = ({ status }) => {
    // (This component is unchanged)
    const statusConfig = {
        Ongoing: { icon: <PlayCircleIcon className="h-5 w-5 mr-2" />, text: 'Ongoing', color: 'info' },
        Paused: { icon: <PauseCircleIcon className="h-5 w-5 mr-2" />, text: 'Paused', color: 'warning' },
        Finished: { icon: <CheckCircle2Icon className="h-5 w-5 mr-2" />, text: 'Finished', color: 'success' },
        default: { icon: null, text: 'Unknown', color: 'ghost' }
    };
    const config = statusConfig[status] || statusConfig.default;
    return (
        <div className={`badge badge-lg badge-${config.color} gap-2 p-4`}>
            {config.icon}
            <span className="font-semibold">{config.text}</span>
        </div>
    );
};

// --- UPDATED COMPONENT ---
// This component no longer needs a 'threshold' prop
const LowSupplyAlert = ({ soilLevel, cupLevel }) => {
    // <-- CHANGED: Logic now checks for 0
    const isSoilLow = soilLevel === 0;
    const isCupLow = cupLevel === 0;

    if (!isSoilLow && !isCupLow) {
        return null;
    }

    const lowSupplies = [];
    if (isSoilLow) lowSupplies.push("Soil");
    if (isCupLow) lowSupplies.push("Potting Cups");

    return (
        <div className="alert alert-error shadow-lg mb-6 animate-pulse">
            <AlertTriangleIcon className="h-6 w-6 stroke-current shrink-0" />
            <div>
                <h3 className="font-bold">Critical Alert: Supplies Low!</h3>
                <div className="text-xs">
                    The process is paused. Please refill {lowSupplies.join(' and ')}.
                </div>
            </div>
        </div>
    );
};


const SupplyStatus = ({ label, level }) => {
    const isLow = level === 0; // 0 = Low, 1 = Sufficient
    const statusText = isLow ? 'Low' : 'Sufficient';
    const colorClass = isLow ? 'text-error' : 'text-success';

    return (
        <div className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
            <span className="label-text font-medium">{label}</span>
            <span className={`font-bold ${colorClass} badge badge-outline badge-lg`}>{statusText}</span>
        </div>
    );
};


// --- Main Page Component ---

const BatchDetailPage = () => {
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const pollingRef = useRef(null);


    useEffect(() => {
        const fetchBatch = async () => {
            try {
                const res = await api.get(`/batch/${id}`);
                setBatch(res.data);
                if (res.data.status === 'Finished' && pollingRef.current) {
                    clearInterval(pollingRef.current);
                }
            } catch (error) {
                console.error("Error fetching Batch", error);
                toast.error("Failed to fetch batch data.");
                if (pollingRef.current) clearInterval(pollingRef.current);
            } finally {
                setLoading(false);
            }
        };

        fetchBatch();
        pollingRef.current = setInterval(fetchBatch, 3000);

        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, [id]);

    const handleDelete = async () => {
        document.getElementById('delete_modal').showModal();
    };

    const confirmDelete = async () => {
       try {
            await api.delete(`/batch/${id}`);
            toast.success("Batch deleted successfully");
            navigate("/");
        } catch (error) {
            console.error("Error deleting the Batch", error);
            toast.error("Failed to delete the Batch");
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <LoaderIcon className="animate-spin size-10 text-primary" />
            </div>
        );
    }

    if (!batch) {
        return (
             <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold mb-4">Batch Not Found</h2>
                <p className="text-gray-500 mb-6">The batch may have been deleted.</p>
                <Link to="/" className="btn btn-primary">
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to All Batches
                </Link>
            </div>
        );
    }

    const progressPercentage = batch.outputCount > 0 ? (batch.potsDoneCount / batch.outputCount) * 100 : 0;

    return (
        <>
        <div className="min-h-screen bg-base-200 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link to="/" className="btn btn-ghost">
                        <ArrowLeftIcon className="h-5 w-5" />
                        Back
                    </Link>
                    <button onClick={handleDelete} className="btn btn-error btn-outline">
                        <Trash2Icon className="h-5 w-5" />
                        Delete Batch
                    </button>
                </div>

                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-6">
                            <div>
                                <h1 className="card-title text-3xl font-bold mb-1">{batch.title}</h1>
                                <p className="text-gray-500">Seed Type ID: <span className="font-semibold">{batch.seedType}</span></p>
                            </div>
                            <div className="mt-4 sm:mt-0">
                                <StatusBadge status={batch.status} />
                            </div>
                        </div>

                        {/* <-- CHANGED: Removed 'threshold' prop */}
                        <LowSupplyAlert
                            soilLevel={batch.soilLevel}
                            cupLevel={batch.cupLevel}
                        />

                        <div className="mb-8">
                             <label className="label">
                                <span className="label-text text-lg font-semibold">Overall Progress</span>
                            </label>
                            <ProgressBar value={progressPercentage} />
                            <div className="text-right mt-1 font-mono text-gray-600">
                                Pots Done: {batch.potsDoneCount} / {batch.outputCount}
                            </div>
                        </div>
                        
                        {/* <-- CHANGED: Replaced 'SupplyGauge' with 'SupplyStatus' */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                           <SupplyStatus label="Soil Supply Level" level={batch.soilLevel} />
                           <SupplyStatus label="Potting Cup Supply Level" level={batch.cupLevel} />
                        </div>
                        
                        <div className="mt-8">
                            <h3 className="font-semibold text-md mb-2">Description / Notes</h3>
                            <p className="text-gray-600 bg-base-200 p-4 rounded-lg text-sm">{batch.content}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <dialog id="delete_modal" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">Confirm Deletion</h3>
                <p className="py-4">Are you sure you want to delete this batch? This action cannot be undone.</p>
                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn mr-2">Cancel</button>
                        <button className="btn btn-error" onClick={confirmDelete}>Delete</button>
                    </form>
                </div>
            </div>
             <form method="dialog" className="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
        </>
    );
};

export default BatchDetailPage;
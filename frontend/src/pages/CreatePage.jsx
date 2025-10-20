import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import api from '../lib/axios'

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required", {
        duration: 3000,
      });
      return;
    }
    setLoading(true)
    try{
      await api.post("/batch", {
        title,
        content
      });
      toast.success("Created Successfully")
      navigate("/")

    }catch (error){
      console.log("Error", error)
      if(error.response.status == 429){
        toast.error("Slow down! You're submitting too fast",{
          duration: 3000, 
        });
      }else {
        toast.error("Failed to create")
      }

    }finally{
      setLoading(false)
    }
  };
  return (
    <div className="min-h-screen bg-base-200">
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <Link to={"/"} className="btn btn-ghost mb-6">
            <ArrowLeftIcon className='size-5'>Back</ArrowLeftIcon>    
          </Link> 
          <div className='card bg-base-100'>
            <div className='card-body'>
              <h2 className='card-title text-2xl mb-4'>Create New Batch</h2>
              <form onSubmit={handleSubmit}>
                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text'>Batch Title</span>
                  </label>
                  <input type="text" 
                  placeholder='Title' 
                  className='input input-bordered'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                
                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text'>Content</span>
                  </label>
                  <textarea 
                  placeholder='Write your Content Here' 
                  className='textarea textarea-bordered h-32'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <div className='card-actions justify-end'>
                  <button type='submit' className='btn btn-primary' disabled={loading}>
                    {loading ? "Creating..." : "Create Batch"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePage
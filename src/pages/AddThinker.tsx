
import React from "react";
import { Helmet } from "react-helmet-async";
import { AddThinkerForm } from "@/components/AddThinkerForm";
import { useNavigate } from "react-router-dom";
import { UserThinker } from "@/types/UserThinker";

const AddThinker = () => {
  const navigate = useNavigate();

  const handleSuccess = (thinker: UserThinker) => {
    // Navigate to favorites page after successful creation
    navigate("/favorites");
  };

  return (
    <>
      <Helmet>
        <title>Add Your Own Guru - Organ Framework</title>
        <meta name="description" content="Create a comprehensive profile for any thinker, philosopher, or mentor" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <AddThinkerForm onSuccess={handleSuccess} />
      </div>
    </>
  );
};

export default AddThinker;

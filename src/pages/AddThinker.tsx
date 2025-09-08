
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
        <title>Add Thinker - Contribute Your Guru | Tech4Humanity</title>
        <meta name="description" content="Share your favorite thinker or guru with our community. Add their frameworks and insights to help others learn from transformative ideas." />
        <link rel="canonical" href="https://ai-thinker-flux.lovable.app/add-thinker" />
        <meta property="og:title" content="Add Thinker - Contribute Your Guru | Tech4Humanity" />
        <meta property="og:description" content="Share your favorite thinker or guru with our community." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-thinker-flux.lovable.app/add-thinker" />
        <meta property="og:image" content="https://ai-thinker-flux.lovable.app/og-share.jpg" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <AddThinkerForm onSuccess={handleSuccess} />
      </div>
    </>
  );
};

export default AddThinker;

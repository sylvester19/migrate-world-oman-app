"use client";

import React, { useEffect, useState } from "react";

export default function PersonaVerification({ stageSet, formId }: any) {
  const [message, setMessage] = useState<string>(
    "Ready to start your identity verification."
  );

  useEffect(() => {
    // Check for return from Persona verification
    const urlParams = new URLSearchParams(window.location.search);
    const inquiryId = urlParams.get('inquiry-id');
    const status = urlParams.get('status');
    
    if (inquiryId && status) {
      // User returned from Persona verification
      setMessage(`Verification completed with status: ${status}`);
      console.log(`Inquiry ID: ${inquiryId}, Status: ${status}`);
      
      // Clean up URL parameters
      const url = new URL(window.location.href);
      url.searchParams.delete('inquiry-id');
      url.searchParams.delete('status');
      window.history.replaceState({}, document.title, url.pathname + url.search);
    } else {
      // Check if Persona is configured
      const templateId = process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID;
      if (!templateId) {
        setMessage("Persona verification is not configured. Please contact support.");
      } else {
        setMessage("Ready to start your identity verification.");
      }
    }
  }, []);

  const startVerification = () => {
    const templateId = process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID;
    const environment = process.env.NEXT_PUBLIC_PERSONA_ENVIRONMENT || "sandbox";
    
    if (!templateId) {
      setMessage("Verification service is not configured.");
      return;
    }

    // Log the template ID for debugging
    console.log("Using template ID:", templateId);
    console.log("Environment:", environment);

    setMessage("Preparing verification...");
    
    // Try using the Persona hosted verification page
    // This is a simpler approach that should work with your template
    const personaUrl = `https://withpersona.com/verify/${templateId}?environment=${environment}`;
    
    console.log("Redirecting to:", personaUrl);
    
    // Store current location to return to after verification
    sessionStorage.setItem('verification_return_url', window.location.href);
    
    // Open in same window
    window.location.href = personaUrl;
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Identity Verification</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800">{message}</p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={startVerification}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 w-full"
          >
            Start Identity Verification
          </button>
          
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p><strong>Template ID:</strong> {process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID || 'Not configured'}</p>
            <p><strong>Environment:</strong> {process.env.NEXT_PUBLIC_PERSONA_ENVIRONMENT || 'sandbox'}</p>
          </div>
        </div>
        
        {message.includes("not configured") || message.includes("error") || message.includes("Failed") ? (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
              <strong>For developers:</strong> Please configure the Persona verification service by adding your template ID to the environment variables.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

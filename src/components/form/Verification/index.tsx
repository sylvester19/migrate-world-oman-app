"use client";

import React, { useEffect, useState } from "react";
import { Client } from "persona";

export default function PersonaVerification({ stageSet, formId }: any) {
  const [message, setMessage] = useState<string>(
    "Ready to start your identity verification."
  );
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const templateId = process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID;
    const environment = process.env.NEXT_PUBLIC_PERSONA_ENVIRONMENT || "sandbox";

    if (!templateId) {
      setMessage("Persona verification is not configured. Please contact support.");
      return;
    }

    console.log("Initializing Persona with:", { templateId, environment });

    try {
      const newClient = new Client({
        templateId: templateId,
        environment: environment as "sandbox" | "production",
        onReady: () => {
          setMessage("Verification service is ready. Click the button to start.");
          console.log("Persona client ready");
        },
        onComplete: ({ inquiryId, status, fields }: any) => {
          setMessage(`Verification completed with status: ${status}`);
          console.log(`Inquiry completed: ${inquiryId}, Status: ${status}`, fields);
        },
        onCancel: ({ inquiryId, sessionToken }: any) => {
          setMessage("Verification was cancelled. You can restart if needed.");
          console.log(`Inquiry cancelled: ${inquiryId}`);
        },
        onError: (error: any) => {
          console.error("Persona verification error:", error);
          setMessage("Verification encountered an error. Please try again.");
        },
      });

      setClient(newClient);
    } catch (error) {
      console.error("Failed to initialize Persona client:", error);
      setMessage("Failed to initialize verification service.");
    }
  }, []);

  const startVerification = () => {
    if (!client) {
      setMessage("Verification service is not ready. Please wait a moment and try again.");
      return;
    }

    try {
      setMessage("Opening verification...");
      client.open();
    } catch (error) {
      console.error("Error opening verification:", error);
      setMessage("Failed to start verification. Please refresh the page and try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Identity Verification</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800">{message}</p>
        </div>
        
        <div className="space-y-4">
          {message.includes("completed") ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm">
                ✅ Identity verification completed successfully!
              </p>
            </div>
          ) : message.includes("not configured") ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">
                ⚠️ Verification service is not configured properly.
              </p>
            </div>
          ) : (
            <button
              onClick={startVerification}
              disabled={!client}
              className={`w-full py-3 px-6 rounded-lg font-bold transition-colors duration-200 ${
                client 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {client ? 'Start Identity Verification' : 'Initializing...'}
            </button>
          )}
          
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p><strong>Template ID:</strong> {process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID || 'Not configured'}</p>
            <p><strong>Environment:</strong> {process.env.NEXT_PUBLIC_PERSONA_ENVIRONMENT || 'sandbox'}</p>
            <p><strong>Client Status:</strong> {client ? 'Ready' : 'Initializing...'}</p>
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

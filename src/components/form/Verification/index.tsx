"use client";

import React, { useEffect, useState } from "react";
// import PersonaReact from 'persona-react';
import { Client } from "persona";

export default function PersonaVerification({ stageSet, formId }: any) {
  const [message, setMessage] = useState<string>(
    "Ready to start your identity verification."
  );
  const [client, setClient] = useState<Client | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    // Check if Persona configuration is available
    const templateId = process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID;
    const environment = process.env.NEXT_PUBLIC_PERSONA_ENVIRONMENT || "sandbox";

    if (!templateId) {
      setMessage("Persona verification is not configured. Please contact support.");
      return;
    }

    // Initialize client but don't auto-open
    try {
      const clientConfig: any = {
        templateId: templateId,
        environment: environment as "sandbox" | "production",
        // Don't set onReady to auto-open
        onReady: () => {
          setIsReady(true);
          setMessage("Verification service is ready. Click the button below to start.");
        },
        onComplete: ({ inquiryId, status, fields }: any) => {
          setMessage(`Verification completed with status: ${status}`);
          console.log(`Inquiry ID: ${inquiryId}`, fields);
        },
        onCancel: ({ inquiryId, sessionToken }: any) => {
          setMessage(`Verification was cancelled. You can restart the process if needed.`);
        },
        onError: (error: any) => {
          console.error("Persona verification error:", error);
          setMessage("Verification service encountered an error. Please try again or contact support.");
        },
      };

      const newClient = new Client(clientConfig);
      setClient(newClient);
    } catch (error) {
      console.error("Failed to initialize Persona client:", error);
      setMessage("Failed to initialize verification service. Please contact support.");
    }
  }, []);

  const startVerification = () => {
    if (client) {
      try {
        setMessage("Opening verification window...");
        client.open();
      } catch (error) {
        console.error("Error opening verification:", error);
        setMessage("Failed to open verification. This may be due to browser restrictions.");
        // Fallback: open Persona directly in new window
        const templateId = process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID;
        if (templateId) {
          const personaUrl = `https://inquiry.withpersona.com/?inquiry-template-id=${templateId}&environment=sandbox`;
          window.open(personaUrl, '_blank', 'width=800,height=900');
        }
      }
    } else {
      // Fallback: open Persona directly
      const templateId = process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID;
      if (templateId) {
        setMessage("Opening verification in new window...");
        const personaUrl = `https://inquiry.withpersona.com/?inquiry-template-id=${templateId}&environment=sandbox`;
        window.open(personaUrl, '_blank', 'width=800,height=900');
      } else {
        setMessage("Verification service is not configured.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Identity Verification</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800">{message}</p>
        </div>
        
        <button
          onClick={startVerification}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Start Identity Verification
        </button>
        
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

"use client";

import React, { useEffect, useState } from "react";
// import PersonaReact from 'persona-react';
import { Client } from "persona";

export default function PersonaVerification({ stageSet, formId }: any) {
  const [message, setMessage] = useState<string>(
    "Your verification is loading..."
  );
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    // Check if Persona configuration is available
    const templateId = process.env.NEXT_PUBLIC_PERSONA_TEMPLATE_ID;
    const environment = process.env.NEXT_PUBLIC_PERSONA_ENVIRONMENT || "sandbox";
    const apiKey = process.env.NEXT_PUBLIC_PERSONA_API_KEY;

    if (!templateId) {
      setMessage("Persona verification is not configured. Please contact support.");
      return;
    }

    try {
      const clientConfig: any = {
        templateId: templateId,
        environment: environment as "sandbox" | "production",
        onReady: () => {
          setMessage("Verification ready. Opening...");
          newClient.open();
        },
        onComplete: ({ inquiryId, status, fields }: any) => {
          // Inquiry completed. Optionally tell your server about it.
          setMessage(`Verification completed with status: ${status}`);
          console.log(`Inquiry ID: ${inquiryId}`, fields);
        },
        onCancel: ({ inquiryId, sessionToken }: any) => {
          // Inquiry cancelled. Optionally tell your server about it.
          setMessage(`Verification was cancelled. You can restart the process if needed.`);
        },
        onError: (error: any) => {
          console.error("Persona verification error:", error);
          setMessage("Verification service encountered an error. Please try again or contact support.");
        },
      };

      // Add API key if provided (for server-side operations)
      if (apiKey) {
        clientConfig.apiKey = apiKey;
      }

      const newClient = new Client(clientConfig);
      setClient(newClient);
    } catch (error) {
      console.error("Failed to initialize Persona client:", error);
      setMessage("Failed to initialize verification service. Please contact support.");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[400px]">
      <div className="max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Identity Verification</h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-blue-800">{message}</p>
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

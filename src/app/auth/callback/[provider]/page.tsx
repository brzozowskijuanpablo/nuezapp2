"use client";

import { useEffect, use } from "react";

export default function AuthCallbackPage({ params }: { params: Promise<{ provider: string }> }) {
  const resolvedParams = use(params);
  const provider = resolvedParams.provider;

  useEffect(() => {
    async function handleAuth() {
      const hash = window.location.hash.substring(1);
      const search = window.location.search.substring(1);
      const urlParams = new URLSearchParams(hash || search);
      const accessToken = urlParams.get("access_token");
      const emailParam = urlParams.get("email");
      const nameParam = urlParams.get("name");

      if (emailParam) {
        if (window.opener) {
          window.opener.postMessage({
            type: "SSO_AUTH_SUCCESS",
            provider,
            email: emailParam,
            name: nameParam || emailParam.split("@")[0],
          }, window.location.origin);
          window.close();
        }
        return;
      }

      if (accessToken) {
        try {
          let email = "";
          let name = "";

          if (provider === "google") {
            const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();
            email = data.email;
            name = data.name;
          } else if (provider === "microsoft") {
            const res = await fetch("https://graph.microsoft.com/v1.0/me", {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
            const data = await res.json();
            email = data.mail || data.userPrincipalName;
            name = data.displayName;
          }

          if (email && window.opener) {
            window.opener.postMessage({
              type: "SSO_AUTH_SUCCESS",
              provider,
              email,
              name,
            }, window.location.origin);
            window.close();
          }
        } catch (e) {
          console.error("Error fetching SSO user info:", e);
        }
      }
    }

    handleAuth();
  }, [provider]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 font-sans text-center">
      <div>
        <div className="w-10 h-10 border-4 border-[#675B37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="font-serif text-xl text-[#2B2118] mb-1">
          Autenticando con {provider === "google" ? "Google" : "Microsoft"}...
        </h2>
        <p className="text-xs text-gray-500">Por favor espera mientras validamos tus datos.</p>
      </div>
    </div>
  );
}

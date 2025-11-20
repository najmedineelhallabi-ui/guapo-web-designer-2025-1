"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, Mail, XCircle } from "lucide-react";
import Image from "next/image";

export default function ConfirmQuotePage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  // Récupérer les données du devis depuis l'URL
  const firstName = searchParams.get("firstName") || "";
  const lastName = searchParams.get("lastName") || "";
  const email = searchParams.get("email") || "";
  const company = searchParams.get("company") || "";
  const siteType = searchParams.get("siteType") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    const sendConfirmation = async () => {
      try {
        const response = await fetch("/api/confirm-quote", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            company,
            siteType,
            minPrice,
            maxPrice,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage("Votre confirmation a été envoyée avec succès !");
        } else {
          setStatus("error");
          setMessage("Une erreur est survenue. Veuillez réessayer.");
        }
      } catch (error) {
        console.error("Error confirming quote:", error);
        setStatus("error");
        setMessage("Une erreur est survenue. Veuillez nous contacter directement.");
      }
    };

    if (firstName && lastName && email) {
      sendConfirmation();
    } else {
      setStatus("error");
      setMessage("Informations manquantes. Veuillez nous contacter directement.");
    }
  }, [firstName, lastName, email, company, siteType, minPrice, maxPrice]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/20 to-secondary/20 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
            alt="GUAPO Web Designer"
            width={150}
            height={75}
            className="h-16 w-auto object-contain"
          />
        </div>

        {/* Status Display */}
        {status === "loading" && (
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Envoi de votre confirmation...
            </h1>
            <p className="text-gray-600">
              Veuillez patienter quelques instants
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ✅ Confirmation envoyée !
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Merci {firstName} {lastName} pour votre confirmation !
            </p>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <p className="text-gray-700 leading-relaxed">
                Notre équipe a bien reçu votre confirmation d'intérêt pour votre projet{" "}
                <strong className="text-green-700">{company || "web"}</strong>.
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Nous vous contacterons sous <strong>24-48 heures</strong> avec un devis détaillé et personnalisé.
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                <strong>Votre projet :</strong> {siteType}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Estimation :</strong> {minPrice}€ - {maxPrice}€
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Retour à l'accueil
              </a>
              <a
                href="mailto:info@guapowebdesigner.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold"
              >
                <Mail className="w-4 h-4" />
                Nous contacter
              </a>
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Erreur lors de l'envoi
            </h1>
            <p className="text-lg text-gray-700 mb-6">{message}</p>
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
              <p className="text-gray-700 leading-relaxed mb-3">
                Nous sommes désolés, une erreur technique est survenue.
              </p>
              <p className="text-gray-700 leading-relaxed">
                N'hésitez pas à nous contacter directement par email ou sur nos réseaux sociaux.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:info@guapowebdesigner.com"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                <Mail className="w-4 h-4" />
                info@guapowebdesigner.com
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold"
              >
                Retour à l'accueil
              </a>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            📧 info@guapowebdesigner.com | 📱 @guapo_webdesigner
          </p>
        </div>
      </div>
    </div>
  );
}

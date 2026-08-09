"use client";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutElementsProvider } from "@stripe/react-stripe-js/checkout";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { ShippingFormInputs } from "@repo/types";
import CheckoutForm from "./CheckoutForm";
import useCartStore from "@/stores/cartStore";

const stripePromise = loadStripe(
  "pk_test_51JLmO3DwfXSy25poTPdhaBillZLGuu8ijXCqemLe47Pz1DRJmXs6uVJ6o4Km43nZw7xbgxIJacW5uWl61KBLxsFq0038V0FQdD",
);

const StripePaymentForm = ({
  shippingForm,
}: {
  shippingForm: ShippingFormInputs;
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();
  const { cart } = useCartStore();

  useEffect(() => {
    let isMounted = true;

    getToken().then((token) => {
      if (isMounted) {
        setToken(token);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [getToken]);

  useEffect(() => {
    let isMounted = true;

    if (!token || !cart?.length) {
      setClientSecret(null);
      return () => {
        isMounted = false;
      };
    }

    const fetchClientSecret = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PAYMENT_SERVICE_URL}/sessions/create-checkout-session`,
          {
            method: "POST",
            body: JSON.stringify({ cart }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const data = await response.json();
        const secret = data?.checkoutSessionClientSecret ?? data?.client_secret;

        if (!response.ok) {
          throw new Error(
            data?.error || "Failed to create Stripe checkout session",
          );
        }

        if (!secret) {
          throw new Error("No checkout client secret was returned.");
        }

        if (isMounted) {
          setClientSecret(secret);
        }
      } catch (error) {
        console.error("Failed to create Stripe checkout session", error);
        if (isMounted) {
          setClientSecret(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchClientSecret();

    return () => {
      isMounted = false;
    };
  }, [cart, token]);

  if (!token || isLoading || !clientSecret) {
    return <div className="">Loading...</div>;
  }

  return (
    <CheckoutElementsProvider
      stripe={stripePromise}
      options={{
        clientSecret,
      }}
    >
      <CheckoutForm shippingForm={shippingForm} />
    </CheckoutElementsProvider>
  );
};

export default StripePaymentForm;

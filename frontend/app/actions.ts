"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { ApiResponse, LoginResponse, Order } from "@/lib/types";

type ActionResult = {
  success: boolean;
  message: string;
};

class ApiError extends Error {}

async function apiRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<{ response: Response; result: ApiResponse<T> }> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) throw new Error("El servicio no está configurado todavía.");
  const response = await fetch(`${apiUrl.replace(/\/$/, "")}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  const result = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !result.success) {
    throw new ApiError(result.message || "No se pudo completar la solicitud.");
  }
  return { response, result };
}

function getFormString(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

/** Authenticates with Laravel and persists the bearer token in an httpOnly cookie. */
export async function loginAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password");
  if (!email || !password) return { success: false, message: "Completa todos los campos." };

  try {
    const { result } = await apiRequest<LoginResponse>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    const cookieStore = await cookies();
    cookieStore.set("auth_token", result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return { success: true, message: "¡Qué bueno verte de nuevo!" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? `${error.message} Puedes seguir explorando y guardar tu carrito en este dispositivo.`
          : "No se pudo iniciar sesión. Inténtalo de nuevo.",
    };
  }
}

/** Registers an account with Laravel and stores any returned token in an httpOnly cookie. */
export async function registerAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const name = getFormString(formData, "name");
  const email = getFormString(formData, "email");
  const password = getFormString(formData, "password");
  if (!name || !email || !password) {
    return { success: false, message: "Completa todos los campos." };
  }

  try {
    const { result } = await apiRequest<LoginResponse>("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    if (result.data.token) {
      const cookieStore = await cookies();
      cookieStore.set("auth_token", result.data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }
    return { success: true, message: "Tu cuenta está lista. ¡Bienvenido a Nova!" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? `${error.message} Puedes seguir explorando la tienda en modo demostración.`
          : "No se pudo crear tu cuenta. Inténtalo de nuevo.",
    };
  }
}

/** Creates an order through Laravel; without a reachable API, confirms it as a local demo order. */
export async function createOrderAction(
  items: { product_id: number; quantity: number }[],
): Promise<ActionResult> {
  if (
    items.length === 0 ||
    items.some(
      (item) =>
        !Number.isSafeInteger(item.product_id) ||
        item.product_id < 1 ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1,
    )
  ) {
    return { success: false, message: "Añade productos válidos para continuar." };
  }
  try {
    const token = (await cookies()).get("auth_token")?.value;
    await apiRequest<Order>("/orders", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({ items }),
    });
    revalidatePath("/orders");
    return { success: true, message: "Tu pedido se ha creado correctamente." };
  } catch (error) {
    if (error instanceof ApiError) {
      return { success: false, message: error.message };
    }
    if (error instanceof Error) {
      return {
        success: true,
        message: `Pedido de demostración confirmado. ${error.message}`,
      };
    }
    return { success: false, message: "No se pudo crear el pedido. Inténtalo de nuevo." };
  }
}

/** Placeholder payment action for the Laravel order-payment endpoint. */
export async function createPaymentAction(
  orderId: number | string,
): Promise<ActionResult> {
  try {
    const token = (await cookies()).get("auth_token")?.value;
    await apiRequest<unknown>(`/orders/${orderId}/payment`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: JSON.stringify({}),
    });
    revalidatePath("/orders");
    return { success: true, message: "El pago se ha procesado correctamente." };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? `El pago no está disponible: ${error.message}`
          : "El pago no está disponible en este momento.",
    };
  }
}

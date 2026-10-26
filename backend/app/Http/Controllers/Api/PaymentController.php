<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProcessPaymentRequest;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Stripe\Exception\ApiErrorException;
use Stripe\StripeClient;
use Throwable;

class PaymentController extends Controller
{
    public function process(
        ProcessPaymentRequest $request,
        Order $order
    ): JsonResponse {
        if ($order->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para pagar esta orden.',
            ], 403);
        }

        if ($order->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Esta orden ya fue procesada.',
            ], 422);
        }

        $stripeSecret = config('services.stripe.secret');

        if (!$stripeSecret) {
            return response()->json([
                'success' => false,
                'message' => 'Stripe no se encuentra configurado.',
            ], 500);
        }

        try {
            $stripe = new StripeClient($stripeSecret);

            $amountInCents = (int) round(
                (float) $order->total * 100
            );

            $paymentIntent = $stripe->paymentIntents->create([
                'amount' => $amountInCents,
                'currency' => 'usd',
                'payment_method' =>
                    $request->validated()['payment_method_id'],
                'payment_method_types' => ['card'],
                'confirm' => true,
                'description' =>
                    "Pago de la orden #{$order->id}",
                'metadata' => [
                    'order_id' => (string) $order->id,
                    'user_id' => (string) $request->user()->id,
                ],
            ], [
                'idempotency_key' =>
                    "order-{$order->id}-payment",
            ]);

            $payment = $order->payments()->updateOrCreate(
                [
                    'stripe_payment_intent_id' =>
                        $paymentIntent->id,
                ],
                [
                    'amount' => $order->total,
                    'currency' => 'usd',
                    'status' => $paymentIntent->status,
                ]
            );

            if ($paymentIntent->status === 'succeeded') {
                $order->update([
                    'status' => 'paid',
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Pago procesado correctamente.',
                    'data' => [
                        'order' => $order->fresh([
                            'items.product',
                            'payments',
                        ]),
                        'payment' => $payment,
                        'payment_intent_id' =>
                            $paymentIntent->id,
                        'status' => $paymentIntent->status,
                    ],
                ]);
            }

            if ($paymentIntent->status === 'requires_action') {
                return response()->json([
                    'success' => true,
                    'message' =>
                        'El pago requiere autenticacion adicional.',
                    'data' => [
                        'order_id' => $order->id,
                        'payment_id' => $payment->id,
                        'payment_intent_id' =>
                            $paymentIntent->id,
                        'client_secret' =>
                            $paymentIntent->client_secret,
                        'status' => $paymentIntent->status,
                    ],
                ], 202);
            }

            return response()->json([
                'success' => false,
                'message' =>
                    'El pago no pudo completarse inmediatamente.',
                'data' => [
                    'order_id' => $order->id,
                    'payment_id' => $payment->id,
                    'payment_intent_id' =>
                        $paymentIntent->id,
                    'client_secret' =>
                        $paymentIntent->client_secret,
                    'status' => $paymentIntent->status,
                ],
            ], 422);
        } catch (ApiErrorException $exception) {
            return response()->json([
                'success' => false,
                'message' =>
                    'Stripe rechazo el pago.',
                'error' => $exception->getMessage(),
            ], 422);
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' =>
                    'Ocurrio un error al procesar el pago.',
            ], 500);
        }
    }
}
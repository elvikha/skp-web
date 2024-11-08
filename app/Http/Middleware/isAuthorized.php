<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class isAuthorized
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated
        if (Auth::check()) {
            // Get the authenticated user
            $user = Auth::user();

            // Check if the user's status is greater than 1
            if ((int) $user->status > 1) {
                return $next($request);
            }
        }

        // If the user is not authenticated or their status is not greater than 1, redirect to home or any other route
        return redirect('/dashboard')->with('error', 'You do not have access.');
    }
}

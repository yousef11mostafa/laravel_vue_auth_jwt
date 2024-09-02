<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Cookie;
use App\Models\User;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // Register a new user
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = JWTAuth::fromUser($user);
        $cookie = $this->getCookieToken($token);

        return response()->json(['message' => 'User registered successfully'])
            ->cookie($cookie);
    }

    // Log in a user
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $cookie = $this->getCookieToken($token);

        return response()->json(['message' => 'Login successful'])
            ->cookie($cookie);
    }

    // Log out a user
    public function logout()
    {
        JWTAuth::invalidate(JWTAuth::getToken());
        $cookie = Cookie::forget('token');

        return response()->json(['message' => 'Logged out successfully'])->withCookie($cookie);
    }

    // Refresh the JWT token
    public function refresh()
    {
        try {
            $token = JWTAuth::parseToken()->refresh();
            $cookie = $this->getCookieToken($token);

            return response()->json(['message' => 'Token refreshed successfully'])
                ->cookie($cookie);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token refresh failed'], 500);
        }
    }

    // Get user profile
    public function profile(Request $request)
    {
        $user = $request->user();
        return response()->json($user);
    }

    // Forgot password
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $response = Password::sendResetLink($request->only('email'));

        return $response == Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Password reset link sent to your email.'])
            : response()->json(['error' => 'Unable to send password reset link.'], 500);
    }

    // Reset password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed',
        ]);

        $response = Password::reset($request->only('email', 'password', 'token'), function ($user, $password) {
            $user->password = Hash::make($password);
            $user->save();
        });

        return $response == Password::PASSWORD_RESET
            ? response()->json(['message' => 'Password has been reset.'])
            : response()->json(['error' => 'Password reset failed.'], 500);
    }

    protected function getCookieToken($token)
    {
        return cookie(
            'token', // Cookie name
            $token, // Cookie value (JWT token)
            config('jwt.ttl'), // Cookie expiration (matches JWT expiration)
            '/', // Path
            null, // Domain (default to null)
            false, // Secure (only send over HTTPS)
            true, // HttpOnly (accessible only through HTTP)
            false, // Raw (do not encode)
            'Lax' // SameSite attribute
        );
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        // Fetch users data with specific columns
        $users = User::select('name', 'email', 'phone_number', 'identification_number', 'status')->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }
}
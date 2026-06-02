<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'success' => true,
        'message' => 'Jeevan Roshini API Backend is running and connected successfully.'
    ]);
});

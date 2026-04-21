<?php

use Illuminate\Support\Facades\Route;

/*
| This Laravel app is used as the admin/driver dashboard only.
| Root and unknown paths redirect to /admin; SPA is served only for
| /admin/*, /driver/*, and static Vite / public assets (build, storage, etc.).
*/

Route::get('/', function () {
    return redirect('/admin', 302);
});

Route::get('/{any}', function (?string $any = null) {
    $path = $any === null || $any === '' ? '' : trim($any, '/');

    if ($path === '') {
        return redirect('/admin', 302);
    }

    $first = strtolower(explode('/', $path, 2)[0]);

    $allowedFirstSegments = [
        'admin',
        'driver',
        'book',
        'build',
        'storage',
        'sanctum',
        'robots.txt',
        'favicon.ico',
    ];

    if (in_array($first, $allowedFirstSegments, true)) {
        return view('app');
    }

    return redirect('/admin', 302);
})->where('any', '.*');

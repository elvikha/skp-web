<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;
use Monolog\Formatter\LineFormatter;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $logFormatter = new LineFormatter(
            null,
            null,
            true,
            true
        );

        foreach (Log::getLogger()->getHandlers() as $handler) {
            $handler->setFormatter($logFormatter);
        }

        URL::forceScheme('https');
        Vite::prefetch(concurrency: 3);
    }
}

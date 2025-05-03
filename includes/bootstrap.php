<?php

use Dotenv\Dotenv;

class Bootstrap {
    private static bool $initialized = false;

    public static function run(): void {

        if (!defined('FOGGER_ROOT')) {
            /** @var string $FOGGER_ROOT Absolute Path to Project Root */
            define('FOGGER_ROOT', realpath(__DIR__ . "/.."));
        }

        // Initialize application environment if not already done
        if (!self::$initialized) {

            // require composer
            require_once FOGGER_ROOT . "/vendor/autoload.php";

            /* load environment vars */
            $dotenv = Dotenv::createImmutable(FOGGER_ROOT);
            $dotenv->load();

            if (!defined('IS_PRODUCTION')) {
                /** @var bool $IS_PRODUCTION Whether on production server */
                define("IS_PRODUCTION", filter_var(@$_ENV['PRODUCTION'], FILTER_VALIDATE_BOOL));
            }

            error_reporting(E_ALL);
            ini_set("display_errors", IS_PRODUCTION ? 0 : 1);

            self::$initialized = true;
        }
    }
}

Bootstrap::run();

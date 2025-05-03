<?php

namespace Fogger;

use Exception;
use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Error\SyntaxError;
use Twig\Loader\FilesystemLoader;

class PageController {
    private Environment $twig;
    public array $twig_context;

    public function __construct(string $page_title) {
        // Set up Twig templating.
        $loader = new FilesystemLoader(FOGGER_ROOT . '/views');
        $this->twig = new Environment(
            $loader,
            array(
                'debug' => false,
            )
        );

        $this->twig_context = array(
            'page_title' => $page_title,
            'is_production' => IS_PRODUCTION
        );
    }

    /**
     * Render twig template
     */
    public function render(string $path, array $additional_context = []): void {
        try {
            echo $this->twig->render($path, array_merge($this->twig_context, $additional_context));
        } catch(Exception|RuntimeError|SyntaxError|LoaderError $e) {
            // TODO: Handle error
            var_dump($e->getMessage());
            echo 'Unable to load page.';
        }
    }
}

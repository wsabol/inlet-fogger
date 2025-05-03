<?php

namespace Tests\Fogger;

use Fogger\PageController;
use PHPUnit\Framework\TestCase;

class PageControllerTest extends TestCase {

    public function testGetPageContextBasic(): void {
        $pageController = new PageController('Test Page');

        $context = $pageController->get_twig_context();

        $this->assertArrayHasKey('page_title', $context);
        $this->assertArrayHasKey('is_production', $context);

        $this->assertEquals('Test Page', $context['page_title']);
    }
}

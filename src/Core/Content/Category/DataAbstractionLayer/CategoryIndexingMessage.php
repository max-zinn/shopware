<?php declare(strict_types=1);

namespace Shopware\Core\Content\Category\DataAbstractionLayer;

use Shopware\Core\Framework\DataAbstractionLayer\Indexing\EntityIndexingMessage;
use Shopware\Core\Framework\Log\Package;

#[Package('discovery')]
class CategoryIndexingMessage extends EntityIndexingMessage
{
    private bool $optimized;

    public function __construct(array $data, ?array $offset = null, bool $optimized = false)
    {
        parent::__construct($data, $offset);
        $this->optimized = $optimized;
    }

    public function getData(): array
    {
        $data = parent::getData();
        $data['optimized'] = $this->optimized;
        return $data;
    }

    public function isOptimized(): bool
    {
        return $this->optimized;
    }
}

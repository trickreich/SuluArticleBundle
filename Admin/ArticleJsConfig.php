<?php

/*
 * This file is part of Sulu.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\ArticleBundle\Admin;

use Sulu\Bundle\AdminBundle\Admin\JsConfigInterface;
use Sulu\Bundle\ArticleBundle\Util\TypeTrait;
use Sulu\Component\Content\Compat\StructureManagerInterface;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;

/**
 * Provides js-configuration.
 */
class ArticleJsConfig implements JsConfigInterface
{
    use TypeTrait;

    /**
     * @var TokenStorageInterface
     */
    private $tokenStorage;

    /**
     * @var StructureManagerInterface
     */
    private $structureManager;

    /**
     * @var array
     */
    private $typeConfiguration;

    /**
     * @param TokenStorageInterface $tokenStorage
     * @param StructureManagerInterface $structureManager
     * @param $typeConfiguration
     */
    public function __construct(
        TokenStorageInterface $tokenStorage,
        StructureManagerInterface $structureManager,
        $typeConfiguration
    ) {
        $this->tokenStorage = $tokenStorage;
        $this->structureManager = $structureManager;
        $this->typeConfiguration = $typeConfiguration;
    }

    /**
     * {@inheritdoc}
     */
    public function getParameters()
    {
        $locale = $this->getLocale();

        $types = [];
        foreach ($this->structureManager->getStructures('article') as $structure) {
            $type = $this->getType($structure->getStructure());
            if (!array_key_exists($type, $types)) {
                $types[$type] = [
                    'default' => $structure->getKey(),
                    'title' => $this->getTitle($type, $locale),
                ];
            }
        }

        return $types;
    }

    /**
     * {@inheritdoc}
     */
    public function getName()
    {
        return 'sulu_article.types';
    }

    /**
     * Returns title for given type.
     *
     * @param string $type
     * @param string $locale
     *
     * @return string
     */
    private function getTitle($type, $locale)
    {
        if (!array_key_exists($type, $this->typeConfiguration)
            || !array_key_exists($locale, $this->typeConfiguration[$type]['translations'])
        ) {
            return $type;
        }

        return $this->typeConfiguration[$type]['translations'][$locale];
    }

    /**
     * Returns locale.
     *
     * @return string
     */
    private function getLocale()
    {
        return $this->tokenStorage->getToken()->getUser()->getLocale();
    }
}

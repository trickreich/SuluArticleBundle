<?php

/*
 * This file is part of Sulu.
 *
 * (c) MASSIVE ART WebServices GmbH
 *
 * This source file is subject to the MIT license that is bundled
 * with this source code in the file LICENSE.
 */

namespace Sulu\Bundle\ArticleBundle\Document\Serializer;

use JMS\Serializer\EventDispatcher\Events;
use JMS\Serializer\EventDispatcher\EventSubscriberInterface;
use JMS\Serializer\EventDispatcher\ObjectEvent;
use ProxyManager\Factory\LazyLoadingValueHolderFactory;
use ProxyManager\Proxy\LazyLoadingInterface;
use Sulu\Bundle\ArticleBundle\Document\ArticleDocument;
use Sulu\Bundle\ArticleBundle\Metadata\ArticleTypeTrait;
use Sulu\Component\Content\Compat\StructureManagerInterface;
use Sulu\Component\Content\ContentTypeManagerInterface;

/**
 * Extends serialization for articles.
 */
class ArticleSubscriber implements EventSubscriberInterface
{
    use ArticleTypeTrait;

    /**
     * @var StructureManagerInterface
     */
    private $structureManager;

    /**
     * @var ContentTypeManagerInterface
     */
    private $contentTypeManager;

    /**
     * @var LazyLoadingValueHolderFactory
     */
    private $proxyFactory;

    /**
     * @param StructureManagerInterface $structureManager
     * @param ContentTypeManagerInterface $contentTypeManager
     * @param LazyLoadingValueHolderFactory $proxyFactory
     */
    public function __construct(
        StructureManagerInterface $structureManager,
        ContentTypeManagerInterface $contentTypeManager,
        LazyLoadingValueHolderFactory $proxyFactory
    ) {
        $this->structureManager = $structureManager;
        $this->contentTypeManager = $contentTypeManager;
        $this->proxyFactory = $proxyFactory;
    }

    /**
     * {@inheritdoc}
     */
    public static function getSubscribedEvents()
    {
        return [
            [
                'event' => Events::POST_SERIALIZE,
                'format' => 'json',
                'method' => 'addTypeOnPostSerialize',
            ],
            [
                'event' => Events::POST_SERIALIZE,
                'format' => 'array',
                'method' => 'resolveContentOnPostSerialize',
            ],
        ];
    }

    /**
     * Append type to result.
     *
     * @param ObjectEvent $event
     */
    public function addTypeOnPostSerialize(ObjectEvent $event)
    {
        $article = $event->getObject();
        $visitor = $event->getVisitor();
        $context = $event->getContext();

        if (!($article instanceof ArticleDocument)) {
            return;
        }

        $structure = $this->structureManager->getStructure($article->getStructureType(), 'article');
        $visitor->addData('articleType', $context->accept($this->getType($structure->getStructure())));
    }

    /**
     * Resolve content on serialization.
     *
     * @param ObjectEvent $event
     */
    public function resolveContentOnPostSerialize(ObjectEvent $event)
    {
        $article = $event->getObject();
        $visitor = $event->getVisitor();
        $context = $event->getContext();

        if (!$article instanceof ArticleDocument || !$context->attributes->containsKey('website')) {
            return;
        }

        $visitor->addData('uuid', $context->accept($article->getUuid()));
        $visitor->addData('extension', $context->accept($article->getExtensionsData()->toArray()));

        $content = $this->resolve($article);
        foreach ($content as $name => $value) {
            $visitor->addData($name, $value);
        }
    }

    /**
     * Returns content and view of article.
     *
     * @param ArticleDocument $article
     *
     * @return array
     */
    private function resolve(ArticleDocument $article)
    {
        $structure = $this->structureManager->getStructure($article->getStructureType(), 'article');
        $structure->setDocument($article);

        $data = $article->getStructure()->toArray();

        $content = $this->proxyFactory->createProxy(
            \ArrayObject::class,
            function (
                &$wrappedObject,
                LazyLoadingInterface $proxy,
                $method,
                array $parameters,
                &$initializer
            ) use ($structure, $data) {
                $content = [];
                foreach ($structure->getProperties(true) as $child) {
                    if (array_key_exists($child->getName(), $data)) {
                        $child->setValue($data[$child->getName()]);
                    }

                    $contentType = $this->contentTypeManager->get($child->getContentTypeName());
                    $content[$child->getName()] = $contentType->getContentData($child);
                }

                $initializer = null;
                $wrappedObject = new \ArrayObject($content);

                return true;
            }
        );
        $view = $this->proxyFactory->createProxy(
            \ArrayObject::class,
            function (
                &$wrappedObject,
                LazyLoadingInterface $proxy,
                $method,
                array $parameters,
                &$initializer
            ) use ($structure, $data) {
                $view = [];
                foreach ($structure->getProperties(true) as $child) {
                    if (array_key_exists($child->getName(), $data)) {
                        $child->setValue($data[$child->getName()]);
                    }

                    $contentType = $this->contentTypeManager->get($child->getContentTypeName());
                    $view[$child->getName()] = $contentType->getViewData($child);
                }

                $initializer = null;
                $wrappedObject = new \ArrayObject($view);

                return true;
            }
        );

        return ['content' => $content, 'view' => $view];
    }
}

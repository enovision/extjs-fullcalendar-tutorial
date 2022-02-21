<?php

namespace Enovision\ShortcodesThunder\Shortcodes;

use Thunder\Shortcode\Shortcode\ShortcodeInterface;
use Enovision\ShortcodesThunder\Classes\Shortcode;

class FolderShortcode extends Shortcode
{
    protected $postHandler = true;

    protected $iconPrefix = 'fa ';
    protected $iconMap = 'fa-folder';
    protected $iconMapOpen = 'fa-folder-open';
    protected $iconFile = 'fa-file';
    protected $iconQuestion = 'fa-question';
    protected $iconClass = '--icon--';

    protected $charPath = '+';
    protected $charFile = '.';
    protected $charMap = 'o';
    protected $charMapOpen = '^';

    protected $validator;

    protected $typeFile = 'file-item';
    protected $typeMap = 'folder-item';
    protected $typeMapOpen = 'folder-item-open folder-item';

    protected $colorName = false;

    protected $extIcons = [
        'jpg' => 'fa fa-cog',
        'pdf' => 'fa fa-question'
    ];

    private $lastLevel = null;

    public function init()
    {
        $this->validator = [$this->charFile, $this->charMap, $this->charMapOpen, $this->charPath];

        // $this->shortcode->getHandlers()->add('code', function (ShortcodeInterface $sc) {
        //     return $sc->getContent();
        // });

        $this->shortcode->getHandlers()->add('folder', function (ShortcodeInterface $sc) {
            $content = $sc->getBbCode() ?: $sc->getContent();

            $this->colorName = $sc->getParameter('colorName', true);

            if (!empty($content)) {
                $newContent = $this->process($sc, $content);
            } else {
                return $content;
            }

            return $newContent;
        });
    }

    private function process($sc, $content)
    {
        $lines = explode(PHP_EOL, $content);

        $classes = $sc->getParameter('class', '');

        $html = sprintf('<div class="shortcode-thunder-folder %s">', $classes);

        // master level that holds the complete tree
        $html .= '<ul class="folder-container">';

        foreach ($lines as $line) {
            if (in_array(substr($line, 0, 1), $this->validator)) {
                $html .= $this->processLine($sc, $line);
            }
        }

        $html .= '</ul>';
        $html .= '</div>';

        return $html;
    }

    private function processLine($sc, $line)
    {
        $level = $this->getLevel($line);
        $type = $this->getType($line);

        $levelClass = 'level-' . $level;

        $firstClass = $this->lastLevel !== null && $level !== $this->lastLevel;

        $hiliteColor = null;

        if ($this->colorName) {
            if ($type === $this->typeMap) {
                $hiliteColor = $sc->getParameter('mc', null);
            } elseif ($type === $this->typeMapOpen) {
                $hiliteColor = $sc->getParameter('mco', null);
                if (empty($hiliteColor)) {
                    $hiliteColor = $sc->getParameter('mc', null);
                }
            } elseif ($type === $this->typeFile) {
                $hiliteColor = $sc->getParameter('fc', null);
            }
        }

        $html = sprintf(
            '<li class="%s %s %s" %s>%s%s</li>',
            $type,
            $levelClass,
            $firstClass ? '--first--' : '--rest--',
            $this->colorName && !empty($hiliteColor)  ? 'style="color:' . $hiliteColor . '"' : '',
            $this->getIcon($sc, $type),
            $this->getContent($line)
        );

        $this->lastLevel = $level;

        return $html;
    }

    private function getIcon($sc, $type)
    {
        $icon = $this->iconQuestion;
        $iconColor = null;

        if ($type === $this->typeMap) {
            $mi = $sc->getParameter('mi', null);
            $iconColor = $sc->getParameter('mc', null);
            $icon = empty($mi) ? $this->iconMap : $mi;
        } elseif ($type === $this->typeMapOpen) {
            $mio = $sc->getParameter('mio', null);
            $icon = empty($mio) ? $this->iconMapOpen : $mio;
            $iconColor = $sc->getParameter('mco', null);
            if (empty($iconColor)) {
                $iconColor = $sc->getParameter('mc', null);
            }
        } elseif ($type === $this->typeFile) {
            $fi = $sc->getParameter('fi', null);
            $icon = empty($fi) ? $this->iconFile : $fi;
            $iconColor = $sc->getParameter('fc', null);
        }

        return sprintf(
            '<i class="%s%s %s" %s></i>',
            $this->iconPrefix,
            $icon,
            $this->iconClass,
            !empty($iconColor) ? 'style="color:' . $iconColor . '"' : ''
        );
    }

    private function getLevel($line)
    {
        $level = 0;
        $split = str_split($line);

        foreach ($split as $char) {
            if ($char === $this->charPath) {
                $level++;
            } else {
                break;
            }
        }

        return $level;
    }

    private function getType($line)
    {
        $type = $this->typeFile;

        $split = str_split($line);

        foreach ($split as $char) {
            if (!in_array($char, $this->validator)) {
                break;
            }

            if ($char === $this->charFile) {
                $type = $this->typeFile;
            } elseif ($char === $this->charMap) {
                $type = $this->typeMap;
            } elseif ($char === $this->charMapOpen) {
                $type = $this->typeMapOpen;
            }
        }

        return $type;
    }

    private function getContent($line)
    {
        $pos = 0;
        $split = str_split($line);

        $validator = array_merge($this->validator, [' ']);

        foreach ($split as $char) {
            if (!in_array($char, $validator)) {
                break;
            }
            $pos++;
        }

        $output = substr($line, $pos);
        $output = preg_replace('~[\r\n]+~', '', $output);

        return sprintf(
            '<span class="%s-name">%s</span>',
            $this->getType($line),
            $output
        );
    }
}

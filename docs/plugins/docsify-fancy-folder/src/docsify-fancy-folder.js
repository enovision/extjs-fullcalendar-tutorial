import './css/style.min.css';
import folderizer from './folderizer';

const LANG = 'directory';
const SELECTOR = 'pre[data-lang="' + LANG + '"]';

const plugin = (hook, vm) => {
    let config = Object.assign({}, {
        elId: 0,
        iconPrefix: 'fa ',
        iconMap: 'fa-folder',
        iconMapOpen: 'fa-folder-open',
        iconFile: 'fa-file',
        iconQuestion: 'fa-question',
        iconClass: '--icon--',
        charPath = '+',
        charFile = '.',
        charMap = 'o',
        charMapOpen = '^',
        typeFile = 'file-item',
        typeMap = 'folder-item',
        typeMapOpen = 'folder-item-open folder-item',
        hiliteColor = {
            mc: null,
            mco: null,
            mio: null,
            fc: null,
            fi: null
        }
    }, vm.config.pseudocode);

    hook.beforeEach(function (content) {
        config.elId++;
        return content;
    });

    hook.afterEach(function (html, next) {
        let me = this,
            folderizer = new folderizer(config, me),
            lineContent;

        const htmlElement = document.createElement('div');
        const ulElement = document.createElement('ul');

        htmlElement.classList.add('shortcode-thunder-folder');

        if (config.wrapClass !== null) {
            htmlElement.classList.add(wrapClass);
        }

        htmlElement.querySelectorAll(SELECTOR).forEach((element) => {
            lineContent = folderizer.renderElement(element, config);
            ulElement.appendChild(lineContent);
        });

        htmlElement.appendChild(ulElement);

        next(htmlElement.innerHTML);
    });
};

export default plugin;



renderElement($sc, $content)
{
    $lines = explode(PHP_EOL, $content);


    // master level that holds the complete tree
    $html.= '<ul class="folder-container">';

    foreach($lines as $line) {
        if (in_array(substr($line, 0, 1), $this -> validator)) {
            $html.= $this -> processLine($sc, $line);
        }
    }

    $html.= '</ul>';
    $html.= '</div>';

    return $html;
}
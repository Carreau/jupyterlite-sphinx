window.jupyterliteShowIframe = (tryItButtonId, iframeSrc) => {
  const tryItButton = document.getElementById(tryItButtonId);
  const iframe = document.createElement('iframe');

  iframe.src = iframeSrc;
  iframe.width = iframe.height = '100%';
  iframe.classList.add('jupyterlite_sphinx_iframe');

  tryItButton.parentNode.appendChild(iframe);
  tryItButton.innerText = 'Loading ...';
  tryItButton.classList.remove('jupyterlite_sphinx_try_it_button_unclicked');
  tryItButton.classList.add('jupyterlite_sphinx_try_it_button_clicked');
}

window.jupyterliteConcatSearchParams = (iframeSrc, params) => {
  const baseURL = window.location.origin;
  const iframeUrl = new URL(iframeSrc, baseURL);

  let pageParams = new URLSearchParams(window.location.search);

  if (params === true) {
    params = Array.from(pageParams.keys());
  } else if (params === false) {
    params = [];
  } else if (!Array.isArray(params)) {
    console.error('The search parameters are not an array');
  }

  params.forEach(param => {
    value = pageParams.get(param);
    if (value !== null) {
      iframeUrl.searchParams.append(param, value);
    }
  });

  if (iframeUrl.searchParams.size) {
    return `${iframeSrc.split('?')[0]}?${iframeUrl.searchParams.toString()}`;
  } else {
    return iframeSrc;
  }
}


window.tryExamplesShowIframe = (
    examplesContainerId, iframeContainerId, iframeParentContainerId, iframeSrc,
    iframeMinHeight
) => {
    const examplesContainer = document.getElementById(examplesContainerId);
    const iframeParentContainer = document.getElementById(iframeParentContainerId);
    const iframeContainer = document.getElementById(iframeContainerId);

    let iframe = iframeContainer.querySelector('iframe.jupyterlite_sphinx_raw_iframe');

    if (!iframe) {
              const examples = examplesContainer.querySelector('.try_examples_content');
              iframe = document.createElement('iframe');
              iframe.src = iframeSrc;
              iframe.style.width = '100%';
              minHeight = parseInt(iframeMinHeight);
              height = Math.max(minHeight, examples.offsetHeight);
              iframe.style.height = `${height}px`;
              iframe.classList.add('jupyterlite_sphinx_raw_iframe');
              examplesContainer.classList.add("hidden");
              iframeContainer.appendChild(iframe);
    } else {
              examplesContainer.classList.add("hidden");
    }
    iframeParentContainer.classList.remove("hidden");
}


window.tryExamplesHideIframe = (examplesContainerId, iframeParentContainerId) => {
    const examplesContainer = document.getElementById(examplesContainerId);
    const iframeParentContainer = document.getElementById(iframeParentContainerId);

    iframeParentContainer.classList.add("hidden");
    examplesContainer.classList.remove("hidden");
}


window.loadTryExamplesConfig = async (configFilePath) => {
    try {
        // Add a timestamp as query parameter to ensure a cached version of the
        // file is not used.
        const timestamp = new Date().getTime();
        const configFileUrl = `${configFilePath}?cb=${timestamp}`;
        const currentPageUrl = window.location.pathname;

        const response = await fetch(configFileUrl);
        if (!response.ok) {
            if (response.status === 404) {
                // Try examples ignore file is not present.
                console.log('try_examples config file not found.');
                return;
            }
            throw new Error(`Error fetching ${configFilePath}`);
        }

        const data = await response.json();
        if (!data) {
            return;
        }

        // Disable interactive examples if file matches one of the ignore patterns
        // by hiding try_examples_buttons.
        Patterns = data.ignore_patterns;
        for (let pattern of Patterns) {
            let regex = new RegExp(pattern);
            if (regex.test(currentPageUrl)) {
                var buttons = document.getElementsByClassName('try_examples_button');
                for (var i = 0; i < buttons.length; i++) {
                    buttons[i].classList.add('hidden');
                }
                break;
            }
        }
    } catch (error) {
        console.error(error);
    }
};


window.toggleTryExamplesButtons = () => {
    /* Toggle visibility of TryExamples buttons. For use in console for debug
     * purposes. */
    var buttons = document.getElementsByClassName('try_examples_button');

    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.toggle('hidden');
    }

};
